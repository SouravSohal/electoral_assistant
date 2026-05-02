import { createAgentModel } from "../core/provider";
import { getWebSearchTool } from "../tools/web-search";
import { AgentStateType } from "../core/state";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = createAgentModel(0.2);
const searchTool = getWebSearchTool();

/**
 * Researcher Agent Node.
 * Responsible for finding evidence and news related to the claim.
 */
export async function researcherNode(state: AgentStateType) {
  const { claim } = state;
  
const systemPrompt = `You are the Lead Researcher for CivicGuide India. 
Your goal is to find the most accurate, recent, and official information regarding election claims and candidate profiles.

When searching for CANDIDATES or CONSTITUENCIES:
1. Search for official ADR (Association for Democratic Reforms) summaries (myneta.info).
2. Look for 'Criminal Antecedents', 'Assets', and 'Education' summaries in news or ECI affidavits.
3. Identify the main contesting parties in the specified constituency.

When searching for CLAIMS/RUMORS:
1. Focus on Official Election Commission of India (ECI) press notes.
2. Reputable news outlets (PIB, PTI, etc.).
3. Official government portals (voters.eci.gov.in).

Be exhaustive but concise. Identify if the claim matches current news or if it has already been flagged as a rumor.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`Research this claim: ${claim}`)
  ], {
    tools: [searchTool]
  });

  // For simplicity in this initial setup, we extract text. 
  // In a full implementation, we'd handle tool calls properly.
  return {
    messages: [response],
    researchResults: [response.content.toString()]
  };
}
