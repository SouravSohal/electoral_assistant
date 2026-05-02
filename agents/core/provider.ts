import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Factory for creating configured Gemini models for different agents.
 */
export function createAgentModel(temperature = 0) {
  const apiKey = process.env.GEMINI_API_KEY || "BUILD_TIME_DUMMY_KEY";

  return new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    apiKey: apiKey,
    temperature: temperature,
    maxOutputTokens: 2048,
  });
}
