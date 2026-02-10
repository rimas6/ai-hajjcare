import axios from "axios";

const GEMINI_API_KEY = "AIzaSyAqyyS8qUpY8nOBKK5aXKjx6aSJDhSjNJw";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const ALL_SYMPTOMS_ORDERED = [
  "itching", "skin_rash", "joint_pain", "stomach_pain", "vomiting", 
  "fatigue", "cough", "high_fever", "breathlessness", "sweating", 
  "dehydration", "headache", "nausea", "chest_pain", "dizziness", "muscle_pain"
];

export const extractSymptoms = async (userText: string) => {
  console.log("--- الدالة بدأت تشتغل الآن (Gemini 2.0) ---");
  try {
    const systemPrompt = `
      You are a Medical Assistant for Hajj. 
      Extract symptoms from the user's text and map them ONLY to this list: [${ALL_SYMPTOMS_ORDERED.join(", ")}].
      Return the result as a JSON object with this exact structure:
      {
        "mapped_symptoms": ["symptom_name"],
        "unknown_symptoms": ["original_text"]
      }
    `;

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [
        { role: "user", parts: [{ text: userText }] }
      ],
      systemInstruction: { parts: [{ text: systemPrompt }] }, // يدعمه Gemini 2.0 بقوة
      generationConfig: {
        responseMimeType: "application/json", // يضمن لكِ الرد كـ JSON
        temperature: 0.1, // لزيادة الدقة وعدم التأليف
      }
    });

    // استخراج النص وتحويله لـ Object
    const resultText = response.data.candidates[0].content.parts[0].text;
    console.log("✅ رد الذكاء الاصطناعي:", resultText);
    return JSON.parse(resultText);

  } catch (error: any) {
    if (error.response?.status === 429) {
      console.log("⚠️ تم تجاوز الحصة المجانية، انتظري دقيقة وجربي.");
    } else {
      console.log("❌ فشل الاتصال:", error.response?.data?.error?.message || error.message);
    }
    return { mapped_symptoms: [], unknown_symptoms: [] };
  }
};