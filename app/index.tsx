import { colors, radius, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase"; // 1. استدعينا supabase
import { useRouter } from "expo-router";
import { useEffect, useState } from "react"; // 2. استدعينا الـ hooks
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"; // 3.  مؤشر التحميل

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // حالة تحميل عشان الشاشة ما ترمش

  // ✅ هذا هو التعديل الوحيد: فحص الجلسة أول ما يفتح التطبيق
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // إذا مسجل دخول من قبل -> وديه الهوم فوراً
        router.replace("/home");
      } else {
        // إذا مو مسجل -> وقف التحميل واظهر الصفحة 
        setLoading(false);
      }
    });
  }, []);

  // شاشة تحميل بسيطة تطلع لأجزاء من الثانية أثناء الفحص
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.buttonPrimary} />
      </View>
    );
  }

 
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{
          fontSize: typography.title.fontSize,
          fontWeight: typography.title.fontWeight,
          marginBottom: spacing.xl,
          color: colors.textPrimary,
        }}
      >
        Welcome to Ai HajjCare
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: colors.buttonPrimary,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.md,
        }}
        onPress={() => router.push("./login")}
      >
        <Text
          style={{
            color: colors.textOnPrimary,
            fontSize: typography.body.fontSize,
            fontWeight: "600",
          }}
        >
          SignIn
        </Text>
      </TouchableOpacity>
    </View>
  );
}