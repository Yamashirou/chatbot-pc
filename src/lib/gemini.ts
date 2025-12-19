import { GoogleGenAI } from "@google/genai";

// API Key loaded from environment variable (set via Vite's import.meta.env)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Grounding tool for Google Search
const groundingTool = {
    googleSearch: {},
};

export const generateResponse = async (history: ChatMessage[], prompt: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env file.");
    }

    // For multi-turn conversation, we need to format the history
    // The new SDK uses a slightly different format
    const contents = [
        ...history.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        })),
        {
            role: 'user',
            parts: [{ text: prompt }]
        }
    ];

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                tools: [groundingTool],
            },
        });

        // Extract text from response
        const text = response.text || "";
        return text;
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        throw new Error(error.message || "Failed to fetch response from Gemini");
    }
};
