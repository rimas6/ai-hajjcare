import { colors, radius, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react"; // 👈 انتبه: أضفنا useRef
import { Alert, ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);
  
  // 🔒 القفل الصارم (استخدام useRef بدلاً من State)
  const isProcessing = useRef(false);

  useEffect(() => {
    // تصفير القفل عند فتح الصفحة
    isProcessing.current = false;
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // 1️⃣ الفحص الفوري للقفل
    if (isProcessing.current) return;
    isProcessing.current = true;
    setShowScanner(false);

    let scannedData;
    try {
      scannedData = JSON.parse(data);
    } catch {
      Alert.alert("error", "Invalid QR code format.");
      isProcessing.current = false;
      return;
    }

    try {
      // 2️⃣ الخطوة الأهم: التأكد أن هذا الـ id موجود في جدولنا في Supabase
      const { data: pilgrim, error: dbError } = await supabase
        .from("pilgrims")
        .select("email")
        .eq("nusuk_id", scannedData.id) // نبحث برقم الهوية الموجود في الباركود
        .maybeSingle();

      if (dbError || !pilgrim) {
        Alert.alert("Access Denied", "Sorry, this Nusuk card is not registered in our system.");
        isProcessing.current = false;
        return;
      }

      // 3️⃣ إذا وجده، نرسل الرمز للإيميل المرتبط به في قاعدة بياناتنا
      // نستخدم pilgrim.email لضمان أننا نراسل الحساب الرسمي وليس أي إيميل عشوائي
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: pilgrim.email,
        options: { shouldCreateUser: true },
      });

      if (authError) {
        Alert.alert("Error", authError.message);
        isProcessing.current = false;
        return;
      }

      // 4️⃣ الانتقال لصفحة التحقق بنجاح
      router.replace({
        pathname: "/otp-verification",
        params: {
          email: pilgrim.email,
          data: JSON.stringify(scannedData),
        },
      });

    } catch (err: any) {
      Alert.alert("Error", "An error occurred while connecting to the database.");
      isProcessing.current = false;
    }
  };
  
  // --- واجهة التحميل ---
  // ملاحظة: نستخدم showScanner للتحقق لأن useRef لا يحدث الواجهة
  if (!showScanner && isProcessing.current) {
     return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.buttonPrimary} />
        <Text style={{ marginTop: 20, color: colors.textSecondary }}>Processing...</Text>
      </View>
    );
  }

  // --- واجهة الكاميرا ---
  if (showScanner) {
    if (!permission?.granted) {
       return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ marginBottom: 20 }}>Camera permission required</Text>
          <TouchableOpacity onPress={requestPermission} style={{ backgroundColor: colors.buttonPrimary, padding: 10, borderRadius: 5 }}>
            <Text style={{ color: 'white' }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <CameraView
          style={{ flex: 1 }}
          onBarcodeScanned={handleBarCodeScanned} // 👈 الدالة نفسها فيها الحماية
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <TouchableOpacity
          style={{ position: "absolute", bottom: 50, alignSelf: "center" }}
          onPress={() => {
              setShowScanner(false);
              isProcessing.current = false;
          }}
        >
          <Ionicons name="close-circle" size={60} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  // --- الواجهة الرئيسية ---
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingHorizontal: spacing.xl, 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      
      {/* 1. أيقونة الـ QR Code الخضراء الكبيرة في المنتصف */}
      <View style={{ marginBottom: spacing.xl }}>
        <MaterialCommunityIcons 
          name="qrcode" 
          size={140} 
          color={colors.primary} // الأخضر الأساسي من الثيم حقك
        />
      </View>

      {/* 2. العنوان الرئيسي */}
      <Text style={{ 
        fontSize: 26, 
        fontWeight: 'bold', 
        color: colors.textPrimary, 
        marginBottom: spacing.sm,
        textAlign: 'center'
      }}>
        Scan Your Nusuk Card
      </Text>

      {/* 3. النص الوصفي الصغير */}
      <Text style={{ 
        fontSize: 16, 
        color: colors.textSecondary, 
        textAlign: 'center', 
        marginBottom: spacing.xxl, // مسافة كبيرة قبل الزر
        lineHeight: 22,
        paddingHorizontal: 10
      }}>
        Point your camera at the QR code on your Nusuk card to log in
      </Text>

      {/* 4. زر البدء (Start Scanning) */}
      <TouchableOpacity
        style={{ 
          backgroundColor: colors.buttonPrimary, 
          width: '85%', // عرض الزر مثل اللي بالصورة
          height: 55, 
          borderRadius: radius.md, 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 12,
          // إضافة ظل خفيف للزر ليعطيه طابع احترافي
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
        onPress={() => {
          isProcessing.current = false;
          setShowScanner(true);
        }}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={22} color="white" />
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          Start Scanning
        </Text>
      </TouchableOpacity>

    </View>
  );
}