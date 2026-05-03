import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { z } from "zod";
import { UserProfileSchema } from "./schemas";

/**
 * Custom error class for Civic AI operations
 */
export class CivicAIError extends Error {
  constructor(public statusCode: number, message: string, public model?: string) {
    super(message);
    this.name = "CivicAIError";
  }
}

// --- Internal Constants ---
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const MIN_REQUEST_GAP = 2000; // 2 seconds safety gap
const MAX_CACHE_SIZE = 100; // Prevent memory leaks

// --- State Management ---
const responseCache = new Map<string, { content: any; timestamp: number }>();
let lastRequestTime = 0;

/**
 * Core AI Engine for CivicGuide India.
 * Handles:
 * - Model Instantiation
 * - Semantic Caching (LRU)
 * - Request Throttling (RPM protection)
 * - Error Normalization
 */
export class AIEngine {
  private static genAI: GoogleGenerativeAI | null = null;

  private static getClient(): GoogleGenerativeAI {
    if (!this.genAI) {
      const apiKey = process.env.GEMINI_API_KEY || "BUILD_TIME_DUMMY_KEY";
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  /**
   * Throttles the execution to respect API quota limits.
   */
  private static async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLast = now - lastRequestTime;
    if (timeSinceLast < MIN_REQUEST_GAP) {
      const delay = MIN_REQUEST_GAP - timeSinceLast;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    lastRequestTime = Date.now();
  }

  /**
   * Factory method to create a pre-configured Gemini model.
   * @param config - Configuration options for the model
   */
  static createModel(config: {
    modelName: string;
    systemInstruction?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    const client = this.getClient();
    const model = client.getGenerativeModel({
      model: config.modelName,
      systemInstruction: config.systemInstruction,
      generationConfig: {
        maxOutputTokens: config.maxTokens || 1024,
        temperature: config.temperature ?? 0.4,
        topP: 0.9,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Wrap with Caching & Throttling Proxy
    const originalGenerateContent = model.generateContent.bind(model);
    
    model.generateContent = async (request: any) => {
      const cacheKey = `${config.modelName}:${JSON.stringify(request)}`;
      
      // Cache Lookup
      const cached = responseCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.content;
      }

      // Execution with Throttling & Error Handling
      try {
        await this.throttle();
        const result = await originalGenerateContent(request);
        
        // Cache Commit
        if (responseCache.size >= MAX_CACHE_SIZE) {
          const oldestKey = responseCache.keys().next().value;
          if (oldestKey) responseCache.delete(oldestKey);
        }
        responseCache.set(cacheKey, { content: result, timestamp: Date.now() });
        return result;
      } catch (error: any) {
        if (error.message?.includes("429")) {
          throw new CivicAIError(429, "Rate limit exceeded. Please wait a moment.", config.modelName);
        }
        throw new CivicAIError(500, error.message || "An unexpected AI error occurred.", config.modelName);
      }
    };

    return model;
  }
}
