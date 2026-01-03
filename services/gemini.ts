import { GoogleGenAI, Type } from "@google/genai";

/**
 * Generates an AI reflection and mood analysis for a journal entry.
 */
export async function getAIReflection(content: string): Promise<{ reflection: string; mood: string }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following journal entry and provide a reflection: "${content}"`,
      config: {
        systemInstruction: "You are an empathetic personal journal assistant. Provide a brief, supportive reflection (2-3 sentences) and identify the primary mood (one word).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: {
              type: Type.STRING,
              description: 'The primary mood identified.',
            },
            reflection: {
              type: Type.STRING,
              description: 'A supportive, empathetic reflection (2-3 sentences).',
            },
          },
          required: ["mood", "reflection"],
        },
      },
    });

    const text = response.text || "{}";
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("AI JSON Parse Error:", e);
      data = { mood: "Thoughtful", reflection: "Thank you for sharing your thoughts." };
    }

    return {
      mood: data.mood || "Thoughtful",
      reflection: data.reflection || "Thank you for sharing your thoughts."
    };
  } catch (error) {
    console.error("Gemini AI error:", error);
    return {
      mood: "Neutral",
      reflection: "Your entry has been saved. The AI reflection is currently unavailable, but your words are safe."
    };
  }
}