import { colors, radius, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);

  // منطق تسجيل الدخول العادي الخاص بزميلاتك
  const handleLogin = () => {
    console.log("Login attempt:", { email, password });
  };

  // ميزتك الجديدة: معالجة الباركود والحفظ في سوبابيس
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setShowScanner(false);
    try {
      // 1. تحويل نص الباركود إلى JSON
      const pilgrimData = JSON.parse(data);

      // 2. مزامنة البيانات مع جدول الحجاج
      const { error } = await supabase
        .from('pilgrims')
        .upsert({
          nusuk_id: pilgrimData.id,
          full_name: pilgrimData.full_name,
          nationality: pilgrimData.nationality,
          medical_info: pilgrimData.medical_info,
          accommodation: pilgrimData.accommodation,
          transport: pilgrimData.transport,
          service_provider: pilgrimData.service_provider,
          last_login: new Date()
        }, { onConflict: 'nusuk_id' });

      if (error) throw error;

      // 3. حفظ المعرف محلياً للرجوع إليه في صفحة البروفايل
      await AsyncStorage.setItem('user_id', pilgrimData.id);

      // تنبيه بالنجاح يظهر للمستخدم
      Alert.alert("Success", `Welcome, ${pilgrimData.full_name}`);
      
      // تعطيل الانتقال مؤقتاً لتجنب الخطأ البرمجي حتى تجهز صفحة الهوم
      // router.replace("/(tabs)");

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Invalid barcode or connection failed");
    }
  };

  // واجهة الكاميرا لمسح البطاقة
  if (showScanner) {
    if (!permission?.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.label}>Camera permission is required to scan the card</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <TouchableOpacity style={styles.closeScanner} onPress={() => setShowScanner(false)}>
          <Ionicons name="close-circle" size={60} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Login</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* زر نسك مدمج باللغة الإنجليزية */}
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: '#009688', flexDirection: 'row', gap: 10 }]} 
          onPress={() => setShowScanner(true)}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={22} color="white" />
          <Text style={styles.loginButtonText}>Nusuk Card Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.md, paddingTop: spacing.md },
  title: { fontSize: typography.subtitle.fontSize, fontWeight: typography.subtitle.fontWeight, color: colors.textPrimary },
  formContainer: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  label: { fontSize: typography.body.fontSize, fontWeight: "600", color: colors.textPrimary, marginBottom: spacing.sm },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, fontSize: typography.body.fontSize },
  loginButton: { backgroundColor: colors.buttonPrimary, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  loginButtonText: { color: colors.textOnPrimary, fontSize: typography.body.fontSize, fontWeight: "bold" },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: { marginHorizontal: spacing.md, color: colors.textMuted, fontSize: typography.body.fontSize },
  scannerContainer: { flex: 1, backgroundColor: 'black' },
  closeScanner: { position: 'absolute', bottom: 50, alignSelf: 'center' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
});