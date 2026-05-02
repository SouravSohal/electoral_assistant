import { createAgentModel } from "../core/provider";
import { AgentStateType } from "../core/state";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = createAgentModel(0.1);

/**
 * Candidate Synthesis Agent Node.
 * Compiles the final CFE (Criminal, Financial, Educational) report.
 */
export async function candidateSynthesisNode(state: AgentStateType) {
  const { claim, researchResults, legalAnalysis } = state;

  const systemPrompt = `You are the Lead Editor for CivicGuide India's 'Know Your Candidate' series.
Your goal is to format the research and analysis into a clear, high-fidelity CFE Report for the public.

REPORT STRUCTURE:
1. Candidate Overview (Name, Party, Constituency)
2. Criminal Antecedents (Bullet points)
3. Financial Profile (Assets vs Liabilities in a clean list)
4. Educational Background
5. Official Source (MyNeta/ADR/ECI link if found in research)

Maintain a professional, non-partisan tone. Use bold headings and markdown for clarity.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`
      Candidate: ${claim}
      Research: ${researchResults.join("\n")}
      CFE Analysis: ${legalAnalysis}
      
      Compile the final high-fidelity CFE report.
    `)
  ]);

  return {
    messages: [response],
    report: response.content.toString(),
    verdict: "CANDIDATE_REPORT" // Static tag for candidate reports
  };
}
