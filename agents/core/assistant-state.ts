import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

/**
 * State for the General Assistant Multi-Agent system.
 */
export const AssistantState = Annotation.Root({
  ...MessagesAnnotation.spec,
  
  // User profile information (Location, Language, Interests)
  userProfile: Annotation<any>(),
  
  // User ID for long-term memory retrieval
  userId: Annotation<string | null>(),
  
  // Whether search was used in this turn
  searchUsed: Annotation<boolean>(),
  
  // Accumulated context for personalization
  personalizedContext: Annotation<string>(),
});

export type AssistantStateType = typeof AssistantState.State;
