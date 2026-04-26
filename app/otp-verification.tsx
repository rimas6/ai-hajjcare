import { colors, radius, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { 
  ActivityIndicator, 
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView,  
  ScrollView, 
  TouchableWithoutFeedback,
  Platform,
  Keyboard 
} from "react-native";
import { useHeaderHeight } from '@react-navigation/elements';

export default function OtpVerification() {
  const router = useRouter();
  const { email, data } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const verifyCode = async () => {
    if (!code || verifying) return;
    setVerifying(true);

    // 1. التحقق من صحة الرمز (OTP)
    const { error } = await supabase.auth.verifyOtp({
      email: email as string,
      token: code,
      type: "email",
    });

    if (error) {
      Alert.alert("Verification Error", error.message);
      setVerifying(false);
      return;
    }

    // 2. تجهيز البيانات من QR Code
    let pilgrimData;
    try {
      pilgrimData = JSON.parse(data as string);
    } catch {
      Alert.alert("Error", "Invalid QR Data format");
      setVerifying(false);
      return;
    }

    // 3. جلب بيانات المستخدم الحالي لربط الحساب
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUser = sessionData.session?.user;

    if (!currentUser) {
      Alert.alert("Error", "User session not found.");
      setVerifying(false);
      return;
    }

    // 4. الحفظ في الداتابيس (Upsert) مع ربط user_id
    const { error: updateError } = await supabase
      .from("pilgrims")
      .update(
        { // ✅ الربط المهم جداً
          user_id: currentUser.id,         
          last_login: new Date(),          
        })
      .eq("nusuk_id", pilgrimData.id); // الشرط: حدث الصف الذي يطابق رقم نسك الممسوح

    if (updateError) {
      console.error("Database Error:", updateError);
      Alert.alert("Database Error", "Failed to update pilgrim data. Please try again.");
    }

    // الانتقال للصفحة الرئيسية
    router.replace("/home");
  };
// دالة لإخفاء جزء من الإيميل لأسباب أمنية
  const maskEmail = (emailText: string) => {
    if (!emailText) return "";
    const [name, domain] = emailText.split("@");
    if (!domain) return emailText; // لو مو إيميل صالح رجعه زي ما هو
    
    // إذا كان الاسم قصير جداً
    if (name.length <= 3) {
      return `${name}***@${domain}`;
    }
    
    // إظهار أول 3 حروف، وبعدها نجوم، وبعدها النطاق
    const visibleStart = name.substring(0, 3);
    return `${visibleStart}***@${domain}`;
  };
  const headerHeight = useHeaderHeight();
 return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0} 
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView 
        contentContainerStyle={{
          flexGrow: 1, 
          justifyContent: "center", 
          paddingTop: 60,
          paddingHorizontal: spacing.lg 
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* العنوان */}
        <Text style={{
            fontSize: typography.title.fontSize,
            fontWeight: typography.title.fontWeight,
            color: colors.textPrimary,
            marginBottom: spacing.sm,
            textAlign: "center",
          }}
        >
          Verification Code
        </Text>

        <Text style={{
            fontSize: typography.body.fontSize,
            color: colors.textSecondary,
            marginBottom: spacing.xl,
            textAlign: "center",
            lineHeight: 22,
          }}
        >
          Please enter the verification code sent to{"\n"}
          <Text style={{ fontWeight: "700", color: colors.textPrimary }}>
            {maskEmail(email as string)}
          </Text>
        </Text>

        {/* حقل الإدخال */}
        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          placeholder=" - - - - - - - -"
          placeholderTextColor={colors.textSecondary}
          maxLength={8}
          style={{
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.textSecondary,
            borderRadius: radius.md,
            padding: spacing.lg,
            fontSize: 17,
            fontWeight: "600",
            color: colors.textPrimary,
            textAlign: "center",
            marginBottom: spacing.xl,
            letterSpacing: 8,
          }}
        />

        {/* زر التحقق */}
        <TouchableOpacity
          onPress={verifyCode}
          disabled={verifying || code.length < 6}
          style={{
            backgroundColor: colors.buttonPrimary,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            alignItems: "center",
            opacity: verifying || code.length < 6 ? 0.7 : 1,
          }}
        >
          {verifying ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={{
                color: colors.textOnPrimary,
                fontSize: typography.body.fontSize,
                fontWeight: "600",
              }}
            >
              Verify & Login
            </Text>
          )}
        </TouchableOpacity>

        {/* زر العودة */}
        <TouchableOpacity
          onPress={() => router.replace("/login")}
          disabled={verifying}
          activeOpacity={0.6}
          style={{ 
            marginTop: spacing.lg, 
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: spacing.sm,
            paddingVertical: spacing.sm,
            opacity: verifying ? 0.4 : 1,
          }}
        >
          <Ionicons 
            name="arrow-back-outline" 
            size={20} 
            color={colors.textSecondary} 
          />
          
          <Text style={{ 
            color: colors.textSecondary, 
            fontSize: typography.body.fontSize,
            fontWeight: "600",
          }}>
            Go Back
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}