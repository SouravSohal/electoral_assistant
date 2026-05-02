import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState, AgentStateType } from "./state";
import { researcherNode } from "../library/researcher";
import { analystNode } from "../library/analyst";
import { synthesisNode } from "../library/synthesis";

/**
 * Orchestrates the Multi-Agent Fact-Checking Graph.
 * Workflow: START -> Researcher -> Analyst -> Synthesis -> END
 */
export function createFactCheckGraph() {
  const workflow = new StateGraph(AgentState)
    // Add nodes
    .addNode("researcher", researcherNode)
    .addNode("analyst", analystNode)
    .addNode("synthesis", synthesisNode)

    // Build edges
    .addEdge(START, "researcher")
    .addEdge("researcher", "analyst")
    .addEdge("analyst", "synthesis")
    .addEdge("synthesis", END);

  return workflow.compile();
}

/**
 * Entry point for executing the Fact-Check workflow.
 */
export async function runFactCheck(claim: string) {
  const graph = createFactCheckGraph();
  
  const initialState: Partial<AgentStateType> = {
    claim: claim,
    messages: [],
    researchResults: [],
    legalAnalysis: "",
    verdict: "",
    report: ""
  };

  const finalState = await graph.invoke(initialState);
  
  return {
    report: finalState.report,
    verdict: finalState.verdict,
    state: finalState
  };
}
