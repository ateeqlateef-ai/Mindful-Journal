
import { GoogleGenAI, Type } from "@google/genai";

// Always use a named parameter for the apiKey during initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an AI reflection and mood analysis for a journal entry.
 * Uses gemini-3-flash-preview as recommended for basic text tasks.
 */
export async function getAIReflection(content: string): Promise<{ reflection: string; mood: string }> {
  try {
    // Using responseSchema is the recommended way to get structured JSON output
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following journal entry: "${content}"`,
      config: {
        systemInstruction: "You are an empathetic personal journal assistant. Provide a brief, supportive reflection (2-3 sentences) and identify the primary mood (one word).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: {
              type: Type.STRING,
              description: 'The primary mood identified in the entry.',
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

    // Access the .text property directly to get the response string
    const jsonStr = response.text || "{}";
    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      data = { mood: "Neutral", reflection: "Thank you for sharing your thoughts today." };
    }

    return {
      mood: data.mood || "Neutral",
      reflection: data.reflection || "Thank you for sharing your thoughts today."
    };
  } catch (error) {
    console.error("Gemini AI error:", error);
    return {
      mood: "Unknown",
      reflection: "An error occurred while generating AI insights. Your privacy and entry are still safe."
    };
  }
}
