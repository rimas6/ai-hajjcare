import { colors, radius, spacing, typography } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);

  // ميزتك الجديدة: معالجة الباركود والحفظ في سوبابيس
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setShowScanner(false);
    try {
      // 1. تحويل نص الباركود إلى JSON
      const pilgrimData = JSON.parse(data);

      // 2. مزامنة البيانات مع جدول الحجاج
      const { error } = await supabase.from("pilgrims").upsert(
        {
          nusuk_id: pilgrimData.id,
          full_name: pilgrimData.full_name,
          nationality: pilgrimData.nationality,
          medical_info: pilgrimData.medical_info,
          accommodation: pilgrimData.accommodation,
          transport: pilgrimData.transport,
          service_provider: pilgrimData.service_provider,
          last_login: new Date(),
        },
        { onConflict: "nusuk_id" },
      );

      if (error) throw error;

      // 3. حفظ المعرف والاسم محلياً
      await AsyncStorage.setItem("user_id", pilgrimData.id);
      await AsyncStorage.setItem("user_name", pilgrimData.full_name);

      // الانتقال لصفحة البيت
      router.replace("/home");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Invalid barcode or connection failed");
    }
  };

  // واجهة الكاميرا لمسح البطاقة
  if (showScanner) {
    if (!permission?.granted) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
            paddingHorizontal: spacing.lg,
          }}
        >
          <Ionicons
            name="camera"
            size={60}
            color={colors.buttonPrimary}
            style={{ marginBottom: spacing.xl }}
          />
          <Text
            style={{
              fontSize: typography.title.fontSize,
              fontWeight: typography.title.fontWeight,
              color: colors.textPrimary,
              marginBottom: spacing.md,
            }}
          >
            Camera Permission
          </Text>
          <Text
            style={{
              fontSize: typography.body.fontSize,
              color: colors.textSecondary,
              marginBottom: spacing.xl,
              textAlign: "center",
            }}
          >
            Camera permission is required to scan cards
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={{
              backgroundColor: colors.buttonPrimary,
              paddingVertical: spacing.lg,
              paddingHorizontal: spacing.xl,
              borderRadius: radius.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.md,
            }}
          >
            <Text
              style={{
                color: colors.textOnPrimary,
                fontSize: typography.body.fontSize,
                fontWeight: "600",
              }}
            >
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <CameraView
          style={{ flex: 1 }}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <TouchableOpacity
          style={{ position: "absolute", bottom: 50, alignSelf: "center" }}
          onPress={() => setShowScanner(false)}
        >
          <Ionicons name="close-circle" size={60} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.md,
          paddingTop: spacing.md,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: typography.subtitle.fontSize,
            fontWeight: typography.subtitle.fontWeight,
            color: colors.textPrimary,
          }}
        >
          Scan Nusuk Card
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
        }}
      >
        <Ionicons
          name="qr-code"
          size={80}
          color={colors.buttonPrimary}
          style={{ marginBottom: spacing.xl }}
        />
        <Text
          style={{
            fontSize: typography.title.fontSize,
            fontWeight: "700",
            color: colors.textPrimary,
            marginBottom: spacing.md,
            textAlign: "center",
          }}
        >
          Scan Your Nusuk Card
        </Text>
        <Text
          style={{
            fontSize: typography.body.fontSize,
            color: colors.textSecondary,
            textAlign: "center",
            marginBottom: spacing.xl,
            lineHeight: 22,
          }}
        >
          Point your camera at the QR code on your Nusuk card to log in
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: colors.buttonPrimary,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.xl,
            borderRadius: radius.md,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing.md,
          }}
          onPress={() => setShowScanner(true)}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
          <Text
            style={{
              color: colors.textOnPrimary,
              fontSize: typography.body.fontSize,
              fontWeight: "600",
            }}
          >
            Start Scanning
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
