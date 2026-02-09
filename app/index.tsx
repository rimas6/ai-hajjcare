import { colors, radius, spacing, typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

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
