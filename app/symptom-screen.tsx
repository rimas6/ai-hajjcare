import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, radius, shadow, spacing, typography } from "@/constants/theme";

// ── رابط الـ Backend — غيّريه لرابط ngrok الخاص بك ──────────────
const API_URL = "https://gaited-stormless-galileo.ngrok-free.dev";
// ─────────────────────────────────────────────────────────────────

// الأعراض الشائعة مع الاسم العربي للعرض + الاسم التقني للموديل
const COMMON_SYMPTOMS = [
  { label: "headache",           value: "headache" },
  { label: "high fever",            value: "high_fever" },
  { label: "cough",            value: "cough" },
  { label: "dizziness",           value: "dizziness" },
  { label: "fatigue",    value: "fatigue" },
  { label: "nausea",          value: "nausea" },
  { label: "vomiting",            value: "vomiting" },
  { label: "chest pain",   value: "chest_pain" },
  { label: "breath lessness",       value: "breathlessness" },
  { label: "joint pain",      value: "joint_pain" },
  { label: "diarrhoea",       value: "diarrhoea" },
  { label: "abdominal pain",  value: "abdominal_pain" },
  { label: "skin rash",       value: "skin_rash" },
  { label: "sweating",        value: "sweating" },
  { label: "chills",          value: "chills" },
  { label: " loss of appetite",  value: "loss_of_appetite" },
];

export default function SymptomIntakeScreen() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (value: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  // ── إرسال الأعراض للـ Backend ─────────────────────────────────
  const handleAnalyze = async () => {
    if (selectedSymptoms.length < 3) {
      Alert.alert("تنبيه", "يرجى اختيار 3 أعراض على الأقل للحصول على تقييم دقيق.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selectedSymptoms }),
      });

      const data = await response.json();

      // ── انتقلي لشاشة النتيجة مع البيانات ───────────────────
      router.push({
        pathname: "/result-screen",
        params: {
          severity:   data.severity,
          confidence: String(data.confidence),
          decided_by: data.decided_by,
          reason:     data.reason,
          symptoms:   selectedSymptoms.join(","),
        },
      });
    } catch (error) {
      Alert.alert("خطأ", "تعذّر الاتصال بالسيرفر. تأكد من تشغيل الـ Backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: spacing.xl,
          marginBottom: spacing.xxl,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: spacing.xs,
            backgroundColor: colors.primaryLight,
            borderRadius: radius.sm,
            marginRight: spacing.md,
          }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text
          style={{
            ...typography.title,
            color: colors.textPrimary,
            fontSize: 22,
            fontWeight: "800",
          }}
        >
          Symptom Analysis
        </Text>
      </View>

      {/* Quick Checklist */}
      <View style={{ marginBottom: spacing.xl }}>
        <Text
          style={{
            ...typography.subtitle,
            color: colors.textPrimary,
            fontWeight: "700",
            marginBottom: spacing.sm,
          }}
        >
          Quick Checklist
        </Text>
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
            fontSize: 13,
            marginBottom: spacing.md,
          }}
        >
          اختر الأعراض التي تعاني منها حالياً ({selectedSymptoms.length} مختار)
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          {COMMON_SYMPTOMS.map((symptom) => (
            <TouchableOpacity
              key={symptom.value}
              onPress={() => toggleSymptom(symptom.value)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: selectedSymptoms.includes(symptom.value)
                  ? colors.primary
                  : colors.divider,
                backgroundColor: selectedSymptoms.includes(symptom.value)
                  ? colors.primaryLight
                  : colors.card,
              }}
            >
              <Text
                style={{
                  color: selectedSymptoms.includes(symptom.value)
                    ? colors.primary
                    : colors.textPrimary,
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {symptom.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* فاصل OR */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: spacing.lg,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: colors.divider }} />
        <Text
          style={{
            paddingHorizontal: spacing.md,
            color: colors.textMuted,
            fontSize: 12,
            fontWeight: "700",
          }}
        >
          OR
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.divider }} />
      </View>

      {/* AI Chat */}
      <View style={{ marginBottom: spacing.xxl }}>
        <Text
          style={{
            ...typography.subtitle,
            color: colors.textPrimary,
            fontWeight: "700",
            marginBottom: spacing.sm,
          }}
        >
          AI Medical Consultant
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.primary,
            flexDirection: "row",
            alignItems: "center",
            ...shadow.card,
          }}
          onPress={() => router.push("/chat-screen")}
        >
          <View
            style={{
              backgroundColor: colors.primaryLight,
              padding: 12,
              borderRadius: radius.md,
              marginRight: spacing.md,
            }}
          >
            <MaterialCommunityIcons
              name="robot-outline"
              size={30}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...typography.body,
                fontWeight: "700",
                color: colors.textPrimary,
              }}
            >
              Chat with AI
            </Text>
            <Text style={{ ...typography.caption, color: colors.textSecondary }}>
              اوصف حالتك بالعربي أو الإنجليزي
            </Text>
          </View>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* زر View Results */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.buttonPrimary,
          borderRadius: radius.md,
          padding: spacing.lg,
          alignItems: "center",
          ...shadow.floating,
          opacity: selectedSymptoms.length >= 3 ? 1 : 0.6,
        }}
        disabled={selectedSymptoms.length < 3 || loading}
        onPress={handleAnalyze}
      >
        {loading ? (
          <ActivityIndicator color={colors.textOnPrimary} />
        ) : (
          <Text
            style={{
              ...typography.body,
              fontWeight: "700",
              color: colors.textOnPrimary,
              fontSize: 18,
            }}
          >
            View Results
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
