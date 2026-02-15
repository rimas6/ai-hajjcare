import { colors, radius, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

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
    const { error: insertError } = await supabase
      .from("pilgrims")
      .upsert(
        {
          nusuk_id: pilgrimData.id,        // المفتاح الأساسي (Unique)
          full_name: pilgrimData.full_name,
          email: currentUser.email,        // الإيميل من الجلسة
          nationality: pilgrimData.nationality,
          medical_info: pilgrimData.medical_info,
          accommodation: pilgrimData.accommodation,
          
          // ✅ الربط المهم جداً
          user_id: currentUser.id,         
          last_login: new Date(),          
        },
        { onConflict: 'nusuk_id' } // ✅ يمنع التكرار ويحدث البيانات
      );

    if (insertError) {
      console.error("Database Error:", insertError);
      // ملاحظة: حتى لو فشل الحفظ، سنسمح بالدخول لأن الـ OTP صحيح
      // لكن الأفضل مراجعة Log الخطأ
    }

    // الانتقال للصفحة الرئيسية
    router.replace("/home");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        justifyContent: "center",
      }}
    >
      {/* العنوان */}
      <Text
        style={{
          fontSize: typography.title.fontSize,
          fontWeight: typography.title.fontWeight,
          color: colors.textPrimary,
          marginBottom: spacing.sm,
          textAlign: "center",
        }}
      >
        Verification Code
      </Text>

      {/* النص التوضيحي */}
      <Text
        style={{
          fontSize: typography.body.fontSize,
          color: colors.textSecondary,
          marginBottom: spacing.xl,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        Please enter the verification code sent to{"\n"}
        <Text style={{ fontWeight: "700", color: colors.textPrimary }}>
          {email}
        </Text>
      </Text>

      {/* حقل الإدخال */}
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="12345678"
        placeholderTextColor={colors.textSecondary}
        maxLength={8}
        style={{
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.textSecondary, // يمكنك تغييره لـ colors.border إذا وجد
          borderRadius: radius.md,
          padding: spacing.lg,
          fontSize: 24,
          fontWeight: "600",
          color: colors.textPrimary,
          textAlign: "center",
          marginBottom: spacing.xl,
          letterSpacing: 8, // تباعد بين الأرقام لجمالية أكثر
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
          opacity: verifying || code.length < 6 ? 0.7 : 1, // تأثير بصري عند التعطيل
        }}
      >
        {verifying ? (
          <ActivityIndicator color={colors.textOnPrimary} />
        ) : (
          <Text
            style={{
              color: colors.textOnPrimary,
              fontSize: typography.body.fontSize,
              fontWeight: "600",
            }}
          >
            Verify & Login
          </Text>
        )}
      </TouchableOpacity>

      {/* زر العودة (اختياري) */}
      <TouchableOpacity
        onPress={() => router.back()}
        disabled={verifying}
        style={{
          marginTop: spacing.lg,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.textSecondary, fontSize: typography.body.fontSize }}>
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}