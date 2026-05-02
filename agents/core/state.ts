import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

/**
 * Shared state for the Multi-Agent system.
 * Extends the default MessagesAnnotation to include custom fields for fact-checking.
 */
export const AgentState = Annotation.Root({
  ...MessagesAnnotation.spec,
  
  // The specific claim or rumor being verified
  claim: Annotation<string>(),
  
  // Research findings from the search agent
  researchResults: Annotation<string[]>(),
  
  // Legal/Policy analysis findings
  legalAnalysis: Annotation<string>(),
  
  // Final verdict (True, False, Misleading)
  verdict: Annotation<string>(),
  
  // Final synthesized report
  report: Annotation<string>(),
});

export type AgentStateType = typeof AgentState.State;
