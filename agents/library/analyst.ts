import { createAgentModel } from "../core/provider";
import { AgentStateType } from "../core/state";
import { getLegalRAGTool } from "../tools/legal-rag";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = createAgentModel(0);

/**
 * Analyst Agent Node.
 * Cross-references research findings with legal frameworks.
 */
export async function analystNode(state: AgentStateType) {
  const { claim, researchResults } = state;
  const ragTool = getLegalRAGTool();
  
  // Perform RAG lookup
  const legalContext = await ragTool.invoke(claim);
  
  const systemPrompt = `You are a Legal & Electoral Policy Analyst for CivicGuide India.
Your task is to analyze research findings against the "Representation of the People Act (1951)" and ECI's "Model Code of Conduct".

Guidelines:
1. Identify if the claim violates specific legal sections.
2. Determine if the claim describes a legitimate electoral procedure.
3. Highlight any procedural inconsistencies.

Use the provided research to support your analysis.`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`
      Research Findings: ${researchResults.join("\n\n")}
      Legal Ground Truth (from RAG): ${legalContext}
      
      Analyze this claim in legal context: ${claim}
    `)
  ]);

  return {
    messages: [response],
    legalAnalysis: response.content.toString()
  };
}
