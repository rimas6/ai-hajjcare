import { colors, radius, spacing, typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ai HajjCare</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("./login")}
      >
        <Text style={styles.buttonText}>SignIn</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    marginBottom: spacing.xl,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
});
