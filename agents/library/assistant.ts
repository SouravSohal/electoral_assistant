import { createAgentModel } from "../core/provider";
import { AssistantStateType } from "../core/assistant-state";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const model = createAgentModel(0.7);

/**
 * Main Assistant Node.
 * Uses personalized context to provide helpful, accurate guidance.
 */
export async function assistantNode(state: AssistantStateType) {
  const { messages, personalizedContext, userProfile } = state;
  
  const systemPrompt = `You are CivicGuide India, a helpful, neutral, and high-fidelity AI assistant for Indian elections.
  
PERSONALIZED CONTEXT:
${personalizedContext}

CORE GUIDELINES:
1. Always be neutral and non-partisan. Do not favor any political party.
2. Provide information based on ECI (Election Commission of India) rules.
3. If asked about polling locations, mention checking the "Polling Booth" page.
4. Use the user's preferred language if indicated in the context.
5. If the information is time-sensitive, advise checking official ECI portals.

Respond warmly and clearly. You are helping a fellow citizen navigate democracy.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    ...messages
  ]);

  return {
    messages: [response]
  };
}
