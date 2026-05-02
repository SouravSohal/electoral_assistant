import { createAgentModel } from "../core/provider";
import { AssistantStateType } from "../core/assistant-state";
import { SystemMessage } from "@langchain/core/messages";

const model = createAgentModel(0.1);

/**
 * Personalizer Agent Node.
 * Tailors the context based on user profile and long-term history.
 */
export async function personalizerNode(state: AssistantStateType) {
  const { userProfile, messages } = state;
  
  const systemPrompt = `You are the Personalization Engine for CivicGuide India.
Your task is to analyze the user profile and current conversation to create a "Personalized Context" for the response agent.

User Profile: ${JSON.stringify(userProfile || {})}

Guidelines:
1. Identify the user's location (State/City) and prioritize local election news.
2. Note the user's preferred language and complexity level.
3. If the user has specific interests (e.g., student rights, senior citizen voting), highlight those.
4. Keep it concise. Focus only on what's relevant to the current query.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    ...messages.slice(-3) // Look at recent history
  ]);

  return {
    personalizedContext: response.content.toString()
  };
}
