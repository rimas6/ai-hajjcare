import { colors, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [pilgrimData, setPilgrimData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      // بيانات وهمية مؤقتة (عدا الإيميل) لاختبار شكل الواجهة
      setPilgrimData({
        name: "Raghad Aljabri",
        email: user.email,          
        nusuk_id: "12345678",
        nationality: "Saudi"
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.buttonPrimary || "#000"} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      {/* ===== Header مع زر الرجوع ===== */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color={colors.textPrimary} />
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* ===== بطاقة عرض البيانات ===== */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{pilgrimData?.name}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{pilgrimData?.email}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Nusuk ID:</Text>
          <Text style={styles.value}>{pilgrimData?.nusuk_id}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Nationality:</Text>
          <Text style={styles.value}>{pilgrimData?.nationality}</Text>
        </View>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  backText: {
    fontSize: typography.body.fontSize,
    color: colors.textPrimary,
    marginLeft: 6,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: typography.title.fontSize,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: spacing.sm,
  },
  label: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
    fontWeight: "600",
    width: 100,
  },
  value: {
    fontSize: typography.body.fontSize,
    color: "#333333",
    flex: 1,
  },
});
