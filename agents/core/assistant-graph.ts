import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { AssistantState, AssistantStateType } from "./assistant-state";
import { personalizerNode } from "../library/personalizer";
import { assistantNode } from "../library/assistant";

/**
 * Orchestrates the General Assistant Multi-Agent Graph.
 * Workflow: START -> Personalizer -> Assistant -> END
 */
export function createAssistantGraph() {
  const workflow = new StateGraph(AssistantState)
    .addNode("personalizer", personalizerNode)
    .addNode("assistant", assistantNode)

    .addEdge(START, "personalizer")
    .addEdge("personalizer", "assistant")
    .addEdge("assistant", END);

  // Short-term memory (within the session thread)
  const memory = new MemorySaver();

  return workflow.compile({ checkpointer: memory });
}

// Singleton instance for the application
const assistantGraph = createAssistantGraph();

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { UserProfile } from "@/lib/schemas";

/**
 * Entry point for the General Assistant.
 */
export async function runAssistant(
  userId: string | null, 
  userProfile: UserProfile | null | undefined, 
  rawMessages: { role: string; content?: string; parts?: { text: string }[] }[],
  threadId: string
) {
  // Convert raw messages to LangChain format
  const messages = rawMessages.map(msg => {
    if (msg.role === "user" || msg.role === "human") {
      return new HumanMessage(msg.parts?.[0]?.text || msg.content || "");
    }
    return new AIMessage(msg.parts?.[0]?.text || msg.content || "");
  });

  const initialState: Partial<AssistantStateType> = {
    userId,
    userProfile,
    messages,
    searchUsed: false,
    personalizedContext: ""
  };

  const finalState = await assistantGraph.invoke(initialState, {
    configurable: { thread_id: threadId }
  });
  
  const lastMessage = finalState.messages[finalState.messages.length - 1];
  
  return {
    response: lastMessage.content.toString(),
    state: finalState
  };
}
