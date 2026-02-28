import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

// استيراد الثيم الخاص بكِ
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";

export default function SymptomIntakeScreen() {
  const router = useRouter();

  // نعدلها بعدين لاعراض المودل حقتنا عشان يفهمها
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const commonSymptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Dizziness",
    "Fatigue",
    "Nausea",
  ];

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      {/* 1️⃣ Header - زر الرجوع المعتمد */}
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

      {/* خيار 1: القائمة السريعة (Checklist) */}
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
          Select the symptoms you are currently experiencing:
        </Text>

        <View
          style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}
        >
          {commonSymptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom}
              onPress={() => toggleSymptom(symptom)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
                borderWidth: 1,
                borderColor: selectedSymptoms.includes(symptom)
                  ? colors.primary
                  : colors.divider,
                backgroundColor: selectedSymptoms.includes(symptom)
                  ? colors.primaryLight
                  : colors.card,
              }}
            >
              <Text
                style={{
                  color: selectedSymptoms.includes(symptom)
                    ? colors.primary
                    : colors.textPrimary,
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* فاصل رسمي */}
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

      {/* خيار 2: المحادثة الذكية (Gemini AI Chat) */}
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
          //وقت الباك اند
          onPress={() =>
            Alert.alert("HajjSence AI", "Opening Gemini Chatbot...")
          }
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
              Chat with Gemini
            </Text>
            <Text
              style={{ ...typography.caption, color: colors.textSecondary }}
            >
              Explain your case in detail
            </Text>
          </View>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* زر الانتقال لصفحة النتائج */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.buttonPrimary,
          borderRadius: radius.md,
          padding: spacing.lg,
          alignItems: "center",
          ...shadow.floating,
          opacity: selectedSymptoms.length > 0 ? 1 : 0.6, // تفعيل الزر عند الاختيار
        }}
        disabled={selectedSymptoms.length === 0}
        //وقت الباك اند
        onPress={() => Alert.alert("System", "Navigating to Results Page...")}
      >
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
      </TouchableOpacity>
    </ScrollView>
  );
}
