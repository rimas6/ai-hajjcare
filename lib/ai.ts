import axios from "axios";

// 1. إعدادات المفتاح والرابط
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// 2. قائمة الأعراض الكاملة (تأكدي أن الترتيب يطابق ملف الـ CSV تماماً)
const ALL_SYMPTOMS_ORDERED = [
  "itching", "skin_rash", "joint_pain", "stomach_pain", "vomiting", 
  "fatigue", "cough", "high_fever", "breathlessness", "sweating", 
  "dehydration", "headache", "nausea", "chest_pain", "dizziness", "muscle_pain"
  // اضفي بقية الأعراض هنا الأسبوع القادم
];

// 3. دالة استخراج الأعراض باستخدام Gemini
export const extractSymptoms = async (userText: string) => {
  try {
    if (!GEMINI_API_KEY) throw new Error("API Key is missing!");

    const systemPrompt = `
      You are a Medical Triage Assistant for Hajj pilgrims. 
      Extract symptoms from user text and map them to our list.

      ### KNOWN SYMPTOMS LIST:
      [${ALL_SYMPTOMS_ORDERED.join(", ")}]

      ### EVALUATION RULES for Unknown Symptoms:
      1. CRITICAL (High): Heat Stroke, Unconsciousness, Severe Bleeding, Confusion, Seizures.
      2. WARNING (Medium): Severe Diarrhea, Persistent Vomiting, Extreme Thirst.
      3. STABLE (Low): Minor cuts, mild itch, dry throat.

      ### OUTPUT FORMAT:
      Return ONLY a JSON object:
      {
        "mapped_symptoms": ["symptom_name_from_list"],
        "unknown_symptoms": [{"name": "original_text", "severity_guess": "High/Medium/Low"}]
      }
    `;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: userText }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1 // لزيادة الدقة وتقليل "تأليف" الذكاء الاصطناعي
      }
    };

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody);
    return JSON.parse(response.data.candidates[0].content.parts[0].text);

  } catch (error) {
    console.error("AI Extraction Error:", error);
    return { mapped_symptoms: [], unknown_symptoms: [] };
  }
};

// دالة بسيطة ترسل البيانات للسيرفر (لما تجهزينه الأسبوع القادم)
export const getDiagnosisFromServer = async (mappedSymptoms: string[]) => {
  try {
    const response = await axios.post('https://your-python-server.com/predict', {
      symptoms: mappedSymptoms // نرسل الأسماء فقط: ["cough", "fever"]
    });
    return response.data.prediction; // يرجع لك المرض المتوقع
  } catch (error) {
    console.error("Server Error:", error);
  }
};