import { colors, radius, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase"; // 1. استدعينا supabase
import { useRouter } from "expo-router";
import { useEffect, useState } from "react"; // 2. استدعينا الـ hooks
import { Dimensions, ActivityIndicator, Text, View } from "react-native"; // 3.  مؤشر التحميل
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");
export default function Index() {
  const router = useRouter();
  
  // ✅ هذا هو التعديل الوحيد: فحص الجلسة أول ما يفتح التطبيق
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setTimeout(() => {
      if (session) {
        // إذا مسجل دخول من قبل -> وديه الهوم فوراً
        router.replace("/home");
      } else {
        // إذا مو مسجل -> وقف التحميل واظهر الصفحة 
       router.replace("/login");
      }
      }, 5000); //اول ما يخلص الأنيميشن (5 ثواني) ممكن ننقصه
    };

    checkSession();
  }, []);
 
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >{/* مشغل الأنيميشن */}
      <LottieView
        source={require('@/assets/splash.json')}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
  
      <Text style={{ 
        marginTop: 60, 
        fontSize: 28, 
        fontWeight: "bold", 
        color: colors.textPrimary,
        letterSpacing: 1 
      }}>
        AI HajjCare
      </Text>
    </View>
  );
}