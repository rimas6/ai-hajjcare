import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function OtpVerification() {
  const router = useRouter();
  const { email, data } = useLocalSearchParams();
  const [code, setCode] = useState("");
const [verifying, setVerifying] = useState(false);

 const verifyCode = async () => {
  if (verifying) return;
  setVerifying(true);

  const { error } = await supabase.auth.verifyOtp({
    email: email as string,
    token: code,
    type: "email",
  });

  if (error) {
    Alert.alert("Error", error.message);
    setVerifying(false);
    return;
  }

  // 👇 نحول بيانات QR
  const pilgrimData = JSON.parse(data as string);

  // 👇 نجيب الجلسة
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) {
    setVerifying(false);
    return;
  }

  const emailFromSession = sessionData.session.user.email;

  // 👇 نحفظ في الداتابيس
 const { data: insertData, error: insertError } = await supabase
  .from("pilgrims")
  .upsert({
    nusuk_id: pilgrimData.id,
    full_name: pilgrimData.full_name,
    email: emailFromSession,
    nationality: pilgrimData.nationality,
    medical_info: pilgrimData.medical_info,
    accommodation: pilgrimData.accommodation,
  });

console.log("INSERT DATA:", insertData);
console.log("INSERT ERROR:", insertError);

  setTimeout(() => {
    router.replace("/home");
  }, 300);
};

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter verification code:</Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="Enter code"
        style={{
          borderWidth: 1,
          marginVertical: 20,
          padding: 10,
        }}
      />

    <TouchableOpacity 
  onPress={verifyCode}
  disabled={verifying}
>
  <Text>
    {verifying ? "Verifying..." : "Verify"}
  </Text>
</TouchableOpacity>

    </View>
  );
}
