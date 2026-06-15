import { describe, it, expect } from "vitest";
import { AIEngine } from "@/lib/ai-engine";

describe("AIEngine.getNormalizedCacheKey()", () => {
  const modelName = "gemini-2.5-flash";

  it("normalizes a string query correctly (trimmed and lowercased)", () => {
    const key1 = AIEngine.getNormalizedCacheKey(modelName, "  How to Register?  ");
    const key2 = AIEngine.getNormalizedCacheKey(modelName, "how to register?");
    expect(key1).toBe(`${modelName}:how to register?`);
    expect(key1).toBe(key2);
  });

  it("normalizes standard Gemini contents array correctly", () => {
    const req1 = {
      contents: [
        { role: "user", parts: [{ text: "  What is EVM?  " }] }
      ]
    };
    const req2 = [
      { role: "user", parts: [{ text: "what is evm?" }] }
    ];
    const key1 = AIEngine.getNormalizedCacheKey(modelName, req1);
    const key2 = AIEngine.getNormalizedCacheKey(modelName, req2);
    expect(key1).toBe(`${modelName}:user:what is evm?`);
    expect(key1).toBe(key2);
  });

  it("handles empty or missing parts text gracefully", () => {
    const req = {
      contents: [
        { role: "user", parts: [] }
      ]
    };
    const key = AIEngine.getNormalizedCacheKey(modelName, req);
    expect(key).toBe(`${modelName}:user:`);
  });

  it("handles non-text parts like inlineData and functionCall without crashing", () => {
    const req = {
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: "xyz" } },
            { functionCall: { name: "get_weather", args: {} } }
          ]
        }
      ]
    };
    const key = AIEngine.getNormalizedCacheKey(modelName, req);
    expect(key).toBe(`${modelName}:user:[media] call:get_weather`);
  });

  it("falls back to JSON.stringify for unexpected structures", () => {
    const req = { unexpectedKey: "test" };
    const key = AIEngine.getNormalizedCacheKey(modelName, req);
    expect(key).toBe(`${modelName}:${JSON.stringify(req)}`);
  });
});
