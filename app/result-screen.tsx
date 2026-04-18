import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { colors, radius, shadow, spacing, typography } from "@/constants/theme";

// إعدادات كل مستوى خطورة
const SEVERITY_CONFIG = {
  High: {
    color:       "#ef4444",
    bgColor:     "#fef2f2",
    icon:        "alert-circle" as const,
    title:       "⚠️ حالة خطيرة",
    subtitle:    "توجه للطوارئ فوراً",
    description: "أعراضك تشير إلى حالة طبية طارئة تستوجب رعاية طبية فورية. لا تتأخر في التوجه لأقرب مستشفى أو مركز طبي.",
    action:      "🏥 توجه للطوارئ الآن",
    actionColor: "#ef4444",
  },
  Medium: {
    color:       "#f97316",
    bgColor:     "#fff7ed",
    icon:        "warning" as const,
    title:       "⚡ تحتاج عناية طبية",
    subtitle:    "راجع طبيباً قريباً",
    description: "حالتك تستدعي مراجعة طبيب في أقرب وقت. لا تتجاهل الأعراض وتوجه لأقرب عيادة أو مستوصف.",
    action:      "🩺 احجز موعد طبي",
    actionColor: "#f97316",
  },
  Low: {
    color:       "#22c55e",
    bgColor:     "#f0fdf4",
    icon:        "checkmark-circle" as const,
    title:       "✅ حالة بسيطة",
    subtitle:    "الراحة تكفي",
    description: "أعراضك بسيطة ولا تستدعي قلقاً. احرص على الراحة والترطيب الجيد، وإذا ساءت الأعراض راجع طبيباً.",
    action:      "💊 توجه للصيدلية",
    actionColor: "#22c55e",
  },
  Insufficient: {
    color:       "#6b7280",
    bgColor:     "#f9fafb",
    icon:        "help-circle" as const,
    title:       "❓ بيانات غير كافية",
    subtitle:    "أدخل المزيد من الأعراض",
    description: "لم تكن الأعراض المدخلة كافية لتحديد درجة الخطورة بدقة. يرجى إدخال 3 أعراض على الأقل.",
    action:      "🔄 حاول مرة أخرى",
    actionColor: "#6b7280",
  },
};

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    severity:   string;
    confidence: string;
    decided_by: string;
    reason:     string;
    symptoms:   string;
  }>();

  const severity   = params.severity   || "Insufficient";
  const confidence = parseFloat(params.confidence || "0");
  const decided_by = params.decided_by || "model";
  const reason     = params.reason     || "";
  const symptoms   = params.symptoms   ? params.symptoms.split(",") : [];

  const config = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.Insufficient;

  const decidedByLabel: Record<string, string> = {
    model:            "🤖 الموديل",
    safety_override:  "🛡️ قاعدة السلامة",
    gemini_override:  "🧠 Gemini AI",
    confidence_boost: "📊 تعزيز الثقة",
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: spacing.xl,
          marginBottom: spacing.xl,
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
        <Text style={{ ...typography.title, color: colors.textPrimary, fontSize: 22, fontWeight: "800" }}>
          نتيجة التحليل
        </Text>
      </View>

      {/* بطاقة النتيجة الرئيسية */}
      <View
        style={{
          backgroundColor: config.bgColor,
          borderRadius: radius.xl,
          padding: spacing.xl,
          alignItems: "center",
          marginBottom: spacing.xl,
          borderWidth: 2,
          borderColor: config.color,
          ...shadow.card,
        }}
      >
        <Ionicons name={config.icon} size={64} color={config.color} />
        <Text style={{ fontSize: 28, fontWeight: "900", color: config.color, marginTop: spacing.md }}>
          {config.title}
        </Text>
        <Text style={{ fontSize: 16, color: config.color, fontWeight: "600", marginTop: spacing.xs }}>
          {config.subtitle}
        </Text>

        {/* شريط الثقة */}
        {severity !== "Insufficient" && (
          <View style={{ width: "100%", marginTop: spacing.lg }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: "center", marginBottom: spacing.xs }}>
              دقة التحليل: {Math.round(confidence * 100)}%
            </Text>
            <View style={{ backgroundColor: colors.divider, borderRadius: 4, height: 8 }}>
              <View
                style={{
                  backgroundColor: config.color,
                  borderRadius: 4,
                  height: 8,
                  width: `${Math.round(confidence * 100)}%`,
                }}
              />
            </View>
          </View>
        )}
      </View>

      {/* التوصية */}
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.lg,
          marginBottom: spacing.lg,
          ...shadow.card,
        }}
      >
        <Text style={{ ...typography.subtitle, fontWeight: "700", color: colors.textPrimary, marginBottom: spacing.sm }}>
          التوصية
        </Text>
        <Text style={{ ...typography.body, color: colors.textSecondary, lineHeight: 24 }}>
          {config.description}
        </Text>
        {reason ? (
          <Text style={{ ...typography.caption, color: colors.textMuted, marginTop: spacing.sm, fontStyle: "italic" }}>
            {reason}
          </Text>
        ) : null}
      </View>

      {/* الأعراض المكتشفة */}
      {symptoms.length > 0 && (
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            ...shadow.card,
          }}
        >
          <Text style={{ ...typography.subtitle, fontWeight: "700", color: colors.textPrimary, marginBottom: spacing.sm }}>
            الأعراض المحللة ({symptoms.length})
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }}>
            {symptoms.map((s, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: colors.primaryLight,
                  borderRadius: radius.full,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
                  {s.replace(/_/g, " ")}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* مصدر القرار */}
      {severity !== "Insufficient" && (
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            padding: spacing.lg,
            marginBottom: spacing.xl,
            flexDirection: "row",
            alignItems: "center",
            ...shadow.card,
          }}
        >
          <MaterialCommunityIcons name="information-outline" size={20} color={colors.textMuted} />
          <Text style={{ ...typography.caption, color: colors.textMuted, marginLeft: spacing.sm }}>
            القرار بواسطة: {decidedByLabel[decided_by] || decided_by}
          </Text>
        </View>
      )}

      {/* زر الإجراء */}
      <TouchableOpacity
        style={{
          backgroundColor: config.actionColor,
          borderRadius: radius.md,
          padding: spacing.lg,
          alignItems: "center",
          marginBottom: spacing.md,
          ...shadow.floating,
        }}
        onPress={() => {
          if (severity === "Insufficient") {
            router.back();
          } else {
            router.push("/home");
          }
        }}
      >
        <Text style={{ ...typography.body, fontWeight: "700", color: "#fff", fontSize: 18 }}>
          {config.action}
        </Text>
      </TouchableOpacity>

      {/* زر إعادة التحليل */}
      <TouchableOpacity
        style={{
          borderRadius: radius.md,
          padding: spacing.md,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.divider,
        }}
        onPress={() => router.push("/symptom-screen")}
      >
        <Text style={{ color: colors.textSecondary, fontWeight: "600" }}>
          🔄 تحليل جديد
        </Text>
      </TouchableOpacity>

      {/* تنبيه طبي */}
      <Text
        style={{
          ...typography.caption,
          color: colors.textMuted,
          textAlign: "center",
          marginTop: spacing.xl,
          lineHeight: 18,
        }}
      >
        ⚠️ هذا التطبيق للمساعدة فقط ولا يُغني عن استشارة الطبيب المختص
      </Text>
    </ScrollView>
  );
}