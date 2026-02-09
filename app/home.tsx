import { colors, spacing, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [pilgrimData, setPilgrimData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPilgrimData();
  }, []);

  const loadPilgrimData = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const userName = await AsyncStorage.getItem("user_name");
      if (!userId) {
        router.replace("/");
        return;
      }
      setPilgrimData({ id: userId, name: userName || "Pilgrim" });
    } catch (error) {
      console.error("Error loading pilgrim data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("user_id");
          await AsyncStorage.removeItem("user_name");
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
        <Text
          style={{
            fontSize: typography.body.fontSize,
            color: colors.textSecondary,
          }}
        >
          Loading...
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
          <Ionicons name="log-out" size={24} color={colors.buttonPrimary} />
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
          Welcome Back, {pilgrimData?.name}!
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
