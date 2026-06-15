import { createAgentModel } from "../core/provider";
import { AssistantStateType } from "../core/assistant-state";
import { SystemMessage, HumanMessage, BaseMessage } from "@langchain/core/messages";
import { getWebSearchTool } from "../tools/web-search";
import { RunnableConfig } from "@langchain/core/runnables";

const model = createAgentModel(0.4); // Lower temperature for more factual tool use
const searchTool = getWebSearchTool();

/**
 * Main Assistant Node.
 * Uses personalized context and real-time tools to provide helpful, accurate guidance.
 */
export async function assistantNode(state: AssistantStateType, config?: RunnableConfig) {
  const { messages, personalizedContext } = state;

  const systemPrompt = `You are CivicGuide India, a helpful, neutral, and high-fidelity AI assistant for Indian elections.
  
PERSONALIZED CONTEXT:
${personalizedContext}

CORE GUIDELINES:
1. Always be neutral and non-partisan. Do not favor any political party.
2. Provide information based on ECI (Election Commission of India) rules.
3. If asked about polling locations, mention checking the "Polling Booth" page.
4. Use the user's preferred language if indicated in the context.
5. Use the web_search tool to find real-time information, news, and official ECI announcements if your knowledge is outdated or if the user asks about current events.
6. If the information is time-sensitive, advise checking official ECI portals (voters.eci.gov.in).

Respond warmly and clearly. You are helping a fellow citizen navigate democracy.`;

  let currentMessages: BaseMessage[] = [
    new SystemMessage(systemPrompt),
    ...messages
  ];

  let iterations = 0;
  const MAX_ITERATIONS = 2; // Limit to 2 iterations for speed and quota safety

  // Helper to stream model generation to the onToken callback if present
  const runModelWithStreaming = async (
    messagesList: BaseMessage[],
    toolsList?: any[]
  ) => {
    const stream = await model.stream(messagesList, toolsList ? { tools: toolsList } : undefined);
    let finalChunk: any = null;

    for await (const chunk of stream) {
      if (!finalChunk) {
        finalChunk = chunk;
      } else {
        finalChunk = finalChunk.concat(chunk);
      }

      if (chunk.content && (!chunk.tool_call_chunks || chunk.tool_call_chunks.length === 0)) {
        if (config?.configurable?.onToken) {
          config.configurable.onToken(chunk.content.toString());
        }
      }
    }
    return finalChunk;
  };

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const response = await runModelWithStreaming(currentMessages, [searchTool]);

    if (response.tool_calls && response.tool_calls.length > 0) {
      currentMessages.push(response);
      for (const toolCall of response.tool_calls) {
        if (toolCall.name === "web_search") {
          const result = await searchTool.invoke(toolCall.args);
          currentMessages.push(result);
        }
      }
      // Continue the loop to generate the final response with the search context
    } else {
      // No tool calls, return final response
      return {
        messages: [response]
      };
    }
  }

  // Fallback if max iterations reached
  const finalResponse = await runModelWithStreaming(currentMessages);
  return {
    messages: [finalResponse],
    searchUsed: true
  };
}
