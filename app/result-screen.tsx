import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Linking, Alert } from "react-native";

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
// رقم الطوارئ والدالة المخصصة للآيفون
  const phoneNumber = '911';

  const callEmergency = () => {
    const phoneUrl = `telprompt:${phoneNumber}`;

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert('عذراً', 'لا يمكن فتح شاشة الاتصال في المحاكي. الرجاء التجربة على جهاز آيفون حقيقي.');
        } else {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch((err) => console.error('Error calling:', err));
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

      

      {/* زر الإجراء (مدمج مع الاتصال للحالات الخطرة) */}
      <TouchableOpacity
        style={{
          backgroundColor: config.actionColor,
          borderRadius: radius.md,
          padding: spacing.lg,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.md,
          flexDirection: severity === "High" ? "row" : "column", // نخليها صف عشان الأيقونة في الحالة الخطرة
          ...shadow.floating,
        }}
        onPress={() => {
          if (severity === "High") {
            callEmergency(); // يتصل بـ 911 فوراً
          } else if (severity === "Insufficient") {
            router.back();
          } else {
            router.push("/home");
          }
        }}
      >
        {/* إظهار أيقونة سماعة فقط في حالة الخطورة */}
        {severity === "High" && (
          <Ionicons name="call" size={24} color="#fff" style={{ marginRight: 10 }} />
        )}
        
        <Text style={{ ...typography.body, fontWeight: "700", color: "#fff", fontSize: 18 }}>
          {severity === "High" ? `اتصل بالطوارئ ${phoneNumber}` : config.action}
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