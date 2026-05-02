import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState, AgentStateType } from "./state";
import { researcherNode } from "../library/researcher";
import { analystNode } from "../library/analyst";
import { synthesisNode } from "../library/synthesis";
import { candidateAnalystNode } from "../library/candidate_analyst";
import { candidateSynthesisNode } from "../library/candidate_synthesis";

/**
 * Orchestrates the Multi-Agent Fact-Checking Graph.
 * Workflow: START -> Researcher -> Analyst -> Synthesis -> END
 */
export function createFactCheckGraph() {
  const workflow = new StateGraph(AgentState)
    .addNode("researcher", researcherNode)
    .addNode("analyst", analystNode)
    .addNode("synthesis", synthesisNode)
    .addEdge(START, "researcher")
    .addEdge("researcher", "analyst")
    .addEdge("analyst", "synthesis")
    .addEdge("synthesis", END);

  return workflow.compile();
}

/**
 * Orchestrates the Multi-Agent Candidate Research Graph.
 * Workflow: START -> Researcher -> CandidateAnalyst -> CandidateSynthesis -> END
 */
export function createCandidateGraph() {
  const workflow = new StateGraph(AgentState)
    .addNode("researcher", researcherNode)
    .addNode("analyst", candidateAnalystNode)
    .addNode("synthesis", candidateSynthesisNode)
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

/**
 * Entry point for executing the Candidate Research workflow.
 */
export async function runCandidateResearch(name: string) {
  const graph = createCandidateGraph();
  const initialState: Partial<AgentStateType> = {
    claim: name,
    messages: [],
    researchResults: [],
    legalAnalysis: "",
    verdict: "",
    report: ""
  };
  const finalState = await graph.invoke(initialState);
  return {
    report: finalState.report,
    state: finalState
  };
}
