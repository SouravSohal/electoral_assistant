import { DynamicTool } from "@langchain/core/tools";
import * as fs from "fs";
import * as path from "path";

/**
 * RAG tool for Legal Documents.
 * Searches the 'data/legal' directory for ground-truth election laws.
 */
export function getLegalRAGTool() {
  const legalDataPath = path.join(process.cwd(), "data/legal/rpa_1951.txt");
  let legalContent = "";
  
  try {
    legalContent = fs.readFileSync(legalDataPath, "utf-8");
  } catch (err) {
    console.warn("Legal data file not found, using empty context.");
  }

  return new DynamicTool({
    name: "legal_rag",
    description: "Search for specific sections in the Representation of the People Act and ECI Manuals.",
    func: async (query: string) => {
      // Simple keyword-based retrieval for small-scale RAG
      const relevantSections = legalContent.split("\n\n").filter(section => {
        const keywords = query.toLowerCase().split(" ");
        return keywords.some(k => section.toLowerCase().includes(k));
      }).slice(0, 3).join("\n\n");

      return relevantSections || "No specific legal sections found for this query. Refer to general ECI guidelines.";
    }
  });
}
