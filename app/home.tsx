import { colors, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [pilgrimData, setPilgrimData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPilgrimData();
  }, []);

  const loadPilgrimData = async () => {
    try {
      // 1. جلب المستخدم الحالي من الجلسة
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // إذا ما في جلسة، ارجع لصفحة البداية
        router.replace("/");
        return;
      }

      // 2. البحث باستخدام user_id (الطريقة الصحيحة ✅)
      const { data, error } = await supabase
        .from("pilgrims")
        .select("nusuk_id, full_name")
        .eq("user_id", user.id) // 👈 الربط الصحيح
        .maybeSingle();

      if (error) {
        console.error("Error fetching data:", error);
      }

      if (data) {
        setPilgrimData({
          id: data.nusuk_id,
          name: data.full_name,
        });
      } else {
        // حالة نادرة: المستخدم مسجل دخول لكن بياناته غير موجودة في جدول الحجاج
        console.log("User exists in Auth but not in Pilgrims table");
      }

    } catch (error) {
      console.error("System Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          // 1. تسجيل الخروج من Supabase
          await supabase.auth.signOut();
          
          // 2. تنظيف أي بيانات مخزنة محلياً (إن وجدت)
          await AsyncStorage.removeItem("user_id");
          await AsyncStorage.removeItem("user_name");
          
          // 3. العودة لصفحة البداية
          router.replace("/");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.buttonPrimary} />
        <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>
          Loading your profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing.xl,
          marginTop: spacing.md,
        }}
      >
        <Text
          style={{
            fontSize: typography.title.fontSize,
            fontWeight: "700",
            color: colors.textPrimary,
          }}
        >
          Hajj Care
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <View
        style={{
          backgroundColor: colors.buttonSecondary,
          borderRadius: 12,
          padding: spacing.lg,
          marginBottom: spacing.xl,
        }}
      >
        <Text
          style={{
            fontSize: typography.subtitle.fontSize,
            fontWeight: "600",
            color: colors.textPrimary,
            marginBottom: spacing.sm,
          }}
        >
          Welcome Back, {pilgrimData?.name || "Pilgrim"}!
        </Text>
        <Text
          style={{
            fontSize: typography.body.fontSize,
            color: colors.textSecondary,
          }}
        >
          Your pilgrimage journey starts here
        </Text>
      </View>

      {/* Symptom Check Button */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.buttonPrimary,
          borderRadius: 12,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.md,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
        // هنا يمكنك إضافة التنقل لصفحة الأعراض مستقبلاً
        // onPress={() => router.push("/symptoms")} 
      >
        <Ionicons name="pulse" size={28} color={colors.textOnPrimary} />
        <Text
          style={{
            fontSize: typography.body.fontSize,
            fontWeight: "600",
            color: colors.textOnPrimary,
          }}
        >
          Check Symptoms
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}