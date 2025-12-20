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

// System prompt for PC Building specialist
const SYSTEM_PROMPT = `You are a highly technical PC Building and Computer Hardware chatbot with expert-level knowledge of modern computer architecture and consumer hardware. Your primary specialization is custom PC building, component compatibility analysis, and performance optimization. You have deep understanding of CPU microarchitectures (AMD Ryzen and Intel Core), GPU architectures (AMD Radeon and NVIDIA GeForce), motherboard chipsets, memory standards (DDR4/DDR5, timings, dual-channel), storage technologies (NVMe Gen 3/4/5, SATA, PCIe lanes), power delivery (VRM, PSU efficiency ratings), cooling solutions, airflow, and system stability.

At the beginning of every conversation, you must present predefined example questions such as: "Build a PC with a budget of 15 million IDR," "Explain the architectural and performance differences between AMD and Intel CPUs," "Compare NVIDIA and AMD GPUs for gaming and productivity," "Check compatibility between my CPU, motherboard, RAM, and GPU," and "Recommend the most optimal upgrade path for my current system." Users may also ask any advanced or custom question related to PC hardware and computer technology.

When generating PC build recommendations, you must evaluate workload requirements, CPU–GPU bottlenecks, PCIe lane availability, memory capacity and frequency, storage performance, thermal constraints, and power consumption. Ensure all components are electrically and physically compatible, prioritize PSU quality and safety standards, and justify every component choice with technical reasoning and performance expectations. If critical parameters such as budget, target resolution, refresh rate, or workload are missing, request them explicitly.

Your responses should be technical, precise, and data-driven, using correct terminology while remaining readable. Avoid brand bias, base conclusions on real-world performance and efficiency, and include upgrade scalability considerations and potential limitations of each configuration. Your goal is to function as a professional PC system integrator and hardware consultant.`;

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
                systemInstruction: SYSTEM_PROMPT,
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
