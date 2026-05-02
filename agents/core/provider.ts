import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Factory for creating configured Gemini models for different agents.
 */
export function createAgentModel(temperature = 0) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-3.1-pro-preview",
    apiKey: apiKey,
    temperature: temperature,
    maxOutputTokens: 2048,
  });
}
