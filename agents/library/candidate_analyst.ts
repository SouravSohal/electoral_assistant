import { createAgentModel } from "../core/provider";
import { AgentStateType } from "../core/state";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = createAgentModel(0.1);

/**
 * Candidate Analyst Agent Node.
 * Responsible for extracting CFE (Criminal, Financial, Educational) data from research.
 */
export async function candidateAnalystNode(state: AgentStateType) {
  const { claim, researchResults } = state;

  const systemPrompt = `You are the Lead Candidate Analyst for CivicGuide India. 
Your goal is to extract specific "Criminal, Financial, and Educational" (CFE) data from the provided research about a candidate.

DATA TO EXTRACT:
1. CRIMINAL: List any pending cases or convictions. If none, state "No pending criminal cases reported".
2. FINANCIAL: Total Movable Assets, Immovable Assets, and Liabilities (in Rupees).
3. EDUCATIONAL: Highest qualification and the institution.

Provide a structured analysis. Be extremely neutral and factual. Do not add commentary.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`
      Candidate Name: ${claim}
      Research Data: ${researchResults.join("\n")}
      
      Analyze the candidate's CFE profile.
    `)
  ]);

  return {
    messages: [response],
    legalAnalysis: response.content.toString() // Reusing legalAnalysis field for CFE extraction
  };
}
