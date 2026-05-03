/**
 * lib/gemini.ts
 * Gemini AI client configuration — Indian Electoral System focus.
 * SERVER-SIDE ONLY — never import in client components.
 */
import { z } from "zod";
import { UserProfileSchema } from "./schemas";
import { AIEngine } from "./ai-engine";

// --- Input validation schema ---
export const ChatMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  parts: z.array(
    z.object({
      text: z
        .string()
        .min(1, "Message cannot be empty")
        .max(2000, "Message too long — maximum 2000 characters"),
    })
  ),
});

export const ChatRequestSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, "At least one message is required")
    .max(50, "Conversation history too long"),
  profile: UserProfileSchema.optional(),
  threadId: z.string().optional(),
});

export const VerificationRequestSchema = z.object({
  text: z
    .string()
    .min(10, "Suspected text is too short to verify")
    .max(3000, "Suspected text is too long (max 3000 chars)"),
  profile: UserProfileSchema.optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// --- Input sanitization ---
/**
 * Sanitizes user input by removing script tags, style blocks, and malicious protocols.
 */
export function sanitizeInput(input: string): string {
  // Remove script/style block content entirely (tags + inner content)
  const noScriptBlocks = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  // Remove remaining HTML tags
  const stripped = noScriptBlocks.replace(/<[^>]*>/g, "");
  // Remove script-like protocol injection patterns
  const noProtocol = stripped.replace(
    /javascript:|data:|vbscript:|on\w+\s*=/gi,
    ""
  );
  // Trim and normalize whitespace
  return noProtocol.trim().replace(/\s+/g, " ");
}

// --- System Prompt (India-focused) ---
/**
 * Constructs the primary system prompt for the AI assistant.
 */
export function buildSystemPrompt(profile?: z.infer<typeof UserProfileSchema>): string {
  let profileContext = "";
  if (profile) {
    const age = profile.dateOfBirth
      ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / 31557600000)
      : "unknown";

    profileContext = `
USER CONTEXT (CONFIDENTIAL):
- Name: ${profile.fullName}
- Age: ${age}
- Voter Category: ${profile.voterType.replace("_", " ")}
- Location: ${profile.location.district}, ${profile.location.state}
- Primary Interests: ${profile.interests.join(", ")}

ADAPTATION RULES:
1. Address the user by their name (${profile.fullName}) occasionally in a friendly manner.
2. Prioritize info related to their interests (${profile.interests.join(", ")}).
3. If they are a ${profile.voterType}, emphasize rights and facilities relevant to them.
4. Use region-specific context for ${profile.location.state} if relevant.
`;
  }

  return `You are CivicGuide India, an agentic AI assistant dedicated to civic education about India's democratic election process.

AGENTIC CAPABILITIES:
- You have access to real-time tools to search the election timeline, get voting steps, and provide official contact info.
- Use these tools whenever a user asks about specific stages of the election or needs official links.
${profileContext}
- Topics: Voter registration (ECI, EPIC, NVSP), MCC, EVMs, VVPAT, NOTA, Polling booths, Form 6/8.

STRICT NEUTRALITY:
1. NEVER endorse or oppose any political party or candidate.
2. If asked for a recommendation, redirect to official ECI affidavits.

LANGUAGE:
1. Respond in the same language the user writes in (Hindi, English, etc.).
2. Use technical terms with explanations.

COMMUNICATION STYLE:
1. Be warm, encouraging, and empowering.
2. Use numbered steps for processes.`;
}

// --- Fact-Check Specific Prompt ---
/**
 * Constructs a prompt specialized for electoral fact-checking.
 */
export function buildFactCheckPrompt(profile?: z.infer<typeof UserProfileSchema>): string {
  const base = buildSystemPrompt(profile);
  return `${base}

SPECIAL MISSION: ELECTORAL FACT-CHECKER
1. Analyze core claims.
2. Cross-reference with ECI rules.
3. Section format: VERDICT, SUMMARY, ANALYSIS, ECI RULE, CALL TO ACTION.

Always respond in Markdown. Include a "⚠️ AI-Generated Fact-Check — Verify with 1950 or voters.eci.gov.in" disclaimer at the bottom.`;
}

// --- Gemini Client Factory ---
/**
 * Creates a pre-configured Gemini model instance with caching and throttling.
 * @param profile - Optional user profile for personalization
 * @param systemInstruction - Optional override for the system prompt
 */
export function createGeminiModel(profile?: z.infer<typeof UserProfileSchema>, systemInstruction?: string) {
  return AIEngine.createModel({
    modelName: "gemini-2.5-flash",
    systemInstruction: systemInstruction || buildSystemPrompt(profile),
    temperature: 0.4,
    maxTokens: 1024
  });
}