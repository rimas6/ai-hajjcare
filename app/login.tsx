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
    // 1️⃣ الفحص الفوري: هل القفل مفعل؟
    if (isProcessing.current) return;

    // 2️⃣ تفعيل القفل فوراً
    isProcessing.current = true;
    
    // إخفاء الكاميرا لراحة المستخدم
    setShowScanner(false);

    let pilgrimData;
    try {
      pilgrimData = JSON.parse(data);
    } catch {
      Alert.alert("Error", "QR code is not valid.");
      isProcessing.current = false; // 🔓 فتح القفل عند الخطأ
      return;
    }

    if (!pilgrimData.email) {
      Alert.alert("Error", "QR code does not contain an email.");
      isProcessing.current = false;
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: pilgrimData.email,
        options: { shouldCreateUser: true },
      });

      if (error) {
        Alert.alert("Error", error.message);
        isProcessing.current = false;
        return;
      }

      // النجاح: الانتقال لصفحة التحقق
      router.replace({
        pathname: "/otp-verification",
        params: {
          email: pilgrimData.email,
          data: JSON.stringify(pilgrimData),
        },
      });

    } catch (err: any) {
      Alert.alert("Error", "Something went wrong.");
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