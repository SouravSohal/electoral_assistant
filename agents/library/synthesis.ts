import { createAgentModel } from "../core/provider";
import { AgentStateType } from "../core/state";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = createAgentModel(0.1);

/**
 * Synthesis Agent Node.
 * Compiles the final report and determines the verdict.
 */
export async function synthesisNode(state: AgentStateType) {
  const { claim, researchResults, legalAnalysis } = state;
  
  const systemPrompt = `You are the Final Fact-Check Editor for CivicGuide India.
Your goal is to synthesize the research and legal analysis into a clear, high-fidelity report for the public.

You MUST start your response with a VERDICT: [True / False / Misleading].

Report Structure:
1. Verdict (Bold and Clear)
2. Executive Summary
3. Evidence & Research Findings
4. Legal Context
5. Final Recommendation for Citizens

Maintain a neutral, authoritative tone. Ensure no bias toward any political party.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`
      Claim: ${claim}
      Research: ${researchResults.join("\n")}
      Legal Analysis: ${legalAnalysis}
      
      Synthesize the final report.
    `)
  ]);

  // Basic verdict extraction
  const verdictMatch = response.content.toString().match(/VERDICT:\s*(\w+)/i);
  const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : "UNKNOWN";

  return {
    messages: [response],
    report: response.content.toString(),
    verdict: verdict
  };
}
