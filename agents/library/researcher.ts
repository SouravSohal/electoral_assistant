import { createAgentModel } from "../core/provider";
import { getWebSearchTool } from "../tools/web-search";
import { AgentStateType } from "../core/state";
import { HumanMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";

const model = createAgentModel(0.2);
const searchTool = getWebSearchTool();

/**
 * Researcher Agent Node.
 * Responsible for finding evidence and news related to the claim.
 */
export async function researcherNode(state: AgentStateType) {
  const { claim } = state;
  let iterations = 0;
  const MAX_ITERATIONS = 3;
  let currentMessages: BaseMessage[] = [
    new SystemMessage(`You are the Lead Researcher for CivicGuide India. 
    Your goal is to find the most accurate, recent, and official information regarding election claims and candidate profiles.
    
    When searching for CANDIDATES or CONSTITUENCIES:
    1. Search for official ADR (Association for Democratic Reforms) summaries (myneta.info).
    2. Look for 'Criminal Antecedents', 'Assets', and 'Education' summaries in news or ECI affidavits.
    3. Identify the main contesting parties in the specified constituency.
    
    When searching for CLAIMS/RUMORS:
    1. Focus on Official Election Commission of India (ECI) press notes.
    2. Reputable news outlets (PIB, PTI, etc.).
    3. Official government portals (voters.eci.gov.in).
    
    Be exhaustive but concise.`),
    new HumanMessage(`Research this claim: ${claim}`)
  ];

  let researchResults: string[] = [];

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const response = await model.invoke(currentMessages, {
      tools: [searchTool]
    });

    currentMessages.push(response);

    if (response.tool_calls && response.tool_calls.length > 0) {
      for (const toolCall of response.tool_calls) {
        if (toolCall.name === "web_search") {
          const result = await searchTool.invoke(toolCall.args);
          currentMessages.push(result);
          researchResults.push(result.content.toString());
        }
      }
    } else {
      // No more tools needed, we have enough info
      researchResults.push(response.content.toString());
      break;
    }
  }

  return {
    messages: currentMessages,
    researchResults: researchResults
  };
}
