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
      Alert.alert("خطأ", "الباركود غير صالح.");
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
        Alert.alert("دخول مرفوض", "عذراً، بطاقة نسك هذه غير مسجلة في نظامنا.");
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
        Alert.alert("خطأ", authError.message);
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
      Alert.alert("خطأ", "حدث خطأ أثناء الاتصال بقاعدة البيانات.");
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
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Welcome</Text>
      
      <TouchableOpacity
        style={{ backgroundColor: colors.buttonPrimary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}
        onPress={() => {
          isProcessing.current = false; // تصفير القفل
          setShowScanner(true);
        }}
      >
        <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Scan Nusuk Card</Text>
      </TouchableOpacity>
    </View>
  );
}