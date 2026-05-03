import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Factory for creating pre-configured Gemini models for agentic workflows.
 * Optimized for reasoning and tool-calling with gemini-2.5-flash.
 * 
 * @param temperature - Controls randomness (default: 0 for high precision)
 * @returns Configured ChatGoogleGenerativeAI instance
 */
export function createAgentModel(temperature = 0) {
  const apiKey = process.env.GEMINI_API_KEY || "BUILD_TIME_DUMMY_KEY";

  return new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: apiKey,
    temperature: temperature,
    maxOutputTokens: 2048,
  });
}
