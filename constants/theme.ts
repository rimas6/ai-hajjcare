export const colors = {
  /* =======================
     Brand / Identity
  ======================== */
  primary: "#2BB673",        // الأخضر الأساسي (حسب التقرير)
  primaryDark: "#1F9D6A",
  primaryLight: "#EAF7F1",

  /* =======================
     Backgrounds
  ======================== */
  background: "#FFFFFF",
  surface: "#F9FAFB",
  card: "#FFFFFF",
  softGreen: "#F0FBF6",

  /* =======================
     Text
  ======================== */
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textOnPrimary: "#FFFFFF",

  /* =======================
     Severity Levels
  ======================== */
  severity: {
    normal: "#22C55E",       // 🟢 طبيعي
    low: "#A3E635",          // 🟢 منخفض
    moderate: "#F59E0B",     // 🟡 متوسط
    high: "#EF4444",         // 🔴 متوسط شديد (بحاجة تدخل)
    emergency: "#DC2626",    // 🚨 بلاغ طارئ
  },

  /* =======================
     UI States
  ======================== */
  border: "#E5E7EB",
  divider: "#F3F4F6",
  disabled: "#D1D5DB",

  /* =======================
     Buttons
  ======================== */
  buttonPrimary: "#2BB673",
  buttonSecondary: "#EAF7F1",
  buttonDanger: "#EF4444",
  buttonEmergency: "#DC2626",

  /* =======================
     Icons
  ======================== */
  iconPrimary: "#2BB673",
  iconSecondary: "#9CA3AF",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const typography = {
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
  },
};

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
};