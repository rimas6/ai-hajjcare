import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
      <Stack.Screen name="login" options={{ title: "Sign In" }} />
      <Stack.Screen name="otp-verification" options={{ title: "Verify Code" }} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
    </Stack>
  );
}
