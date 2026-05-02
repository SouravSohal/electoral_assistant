import { DynamicTool } from "@langchain/core/tools";

/**
 * Web Search Tool powered by Tavily (Direct API).
 * Requires TAVILY_API_KEY in .env.local
 */
export function getWebSearchTool() {
  return new DynamicTool({
    name: "tavily_search",
    description: "Search the web for real-time election news and ECI updates.",
    func: async (query: string) => {
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) return "Search failed: TAVILY_API_KEY not set.";

      try {
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: apiKey,
            query: query,
            search_depth: "basic",
            max_results: 5,
          }),
        });
        const data = await response.json();
        return data.results.map((r: any) => `${r.title}: ${r.content} (${r.url})`).join("\n\n");
      } catch (err) {
        return `Search error: ${err}`;
      }
    }
  });
}
