
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAIReflection(content: string): Promise<{ reflection: string; mood: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an empathetic personal journal assistant. Analyze the following journal entry. 
      Provide a brief, supportive reflection (2-3 sentences) and identify the primary mood (one word).
      
      Entry: "${content}"
      
      Respond in plain text formatted as:
      MOOD: [One Word]
      REFLECTION: [Brief Reflection]`,
    });

    const text = response.text || "";
    const moodMatch = text.match(/MOOD:\s*(\w+)/i);
    const reflectionMatch = text.match(/REFLECTION:\s*(.*)/i);

    return {
      mood: moodMatch ? moodMatch[1] : "Neutral",
      reflection: reflectionMatch ? reflectionMatch[1] : "Thank you for sharing your thoughts today."
    };
  } catch (error) {
    console.error("Gemini AI error:", error);
    return {
      mood: "Unknown",
      reflection: "An error occurred while generating AI insights."
    };
  }
}
