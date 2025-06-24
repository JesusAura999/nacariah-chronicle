
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT, SWEET_MESSAGE_PROMPT, DEEPEN_THOUGHT_PROMPT } from '../constants';
import { GroundingChunk } from "../types";


const getApiKey = (): string | undefined => {
  // In a real build process, process.env.API_KEY would be substituted.
  // For local development, you might use a .env file and a bundler like Vite/Webpack.
  // For this environment, we assume it's directly available or hardcoded for example purposes if not set.
  // IMPORTANT: Do NOT hardcode API keys in production code.
  return process.env.API_KEY;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() || "MISSING_API_KEY" });


export const generateSweetMessage = async (name: string): Promise<string> => {
  if (!getApiKey()) {
    return "API Key is missing. Please configure it to use this feature.";
  }
  try {
    const prompt = SWEET_MESSAGE_PROMPT(name);
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating sweet message:", error);
    if (error instanceof Error) {
        return `Error from Gemini: ${error.message}. Ensure your API key is valid and has Gemini API enabled.`;
    }
    return "Failed to generate sweet message. Please try again later.";
  }
};

export const deepenThought = async (sectionTitle: string, sectionContent: string): Promise<string> => {
  if (!getApiKey()) {
    return "API Key is missing. Please configure it to use this feature.";
  }
  try {
    // Take first 50 words as sample for prompt
    const contentSample = sectionContent.split(" ").slice(0, 50).join(" ") + "...";
    const prompt = DEEPEN_THOUGHT_PROMPT(sectionTitle, contentSample);
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error deepening thought for ${sectionTitle}:`, error);
     if (error instanceof Error) {
        return `Error from Gemini: ${error.message}. Ensure your API key is valid and has Gemini API enabled.`;
    }
    return "Failed to generate reflection. Please try again later.";
  }
};

export const fetchAnswerWithGoogleSearch = async (query: string): Promise<{ text: string; sources: GroundingChunk[] }> => {
  if (!getApiKey()) {
    return { text: "API Key is missing. Please configure it to use this feature.", sources: [] };
  }
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, sources };

  } catch (error) {
    console.error("Error fetching answer with Google Search:", error);
    if (error instanceof Error) {
        return { text: `Error from Gemini: ${error.message}. Ensure your API key is valid and has Gemini API enabled.`, sources: [] };
    }
    return { text: "Failed to fetch answer. Please try again later.", sources: [] };
  }
};
