/**
 * __tests__/unit/gemini.test.ts
 * Unit tests for the Gemini AI library utilities.
 */
import { describe, it, expect } from "vitest";
import { sanitizeInput, buildSystemPrompt, ChatRequestSchema } from "@/lib/gemini";

describe("sanitizeInput()", () => {
  it("passes through normal text unchanged", () => {
    const input = "How do I register to vote?";
    expect(sanitizeInput(input)).toBe(input);
  });

  it("strips HTML tags from input", () => {
    expect(sanitizeInput("<b>Hello</b> world")).toBe("Hello world");
  });

  it("strips script tags", () => {
    expect(sanitizeInput("<script>alert('xss')</script>Hello")).toBe("Hello");
  });

  it("removes javascript: protocol injection", () => {
    const result = sanitizeInput("javascript:alert(1) hello");
    expect(result).not.toContain("javascript:");
  });

  it("normalizes excess whitespace", () => {
    expect(sanitizeInput("Hello   world")).toBe("Hello world");
  });

  it("trims leading/trailing whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });
});

describe("buildSystemPrompt()", () => {
  it("returns a non-empty string", () => {
    const prompt = buildSystemPrompt();
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(100);
  });

  it("contains neutrality instruction", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.toLowerCase()).toContain("neutral");
  });

  it("mentions voter registration", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.toLowerCase()).toContain("voter registration");
  });

  it("prohibits endorsing candidates", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.toLowerCase()).toContain("never");
    expect(prompt.toLowerCase()).toContain("endorse");
  });
});

describe("ChatRequestSchema validation", () => {
  it("validates a correct message", () => {
    const result = ChatRequestSchema.safeParse({
      messages: [
        { role: "user", parts: [{ text: "How do I register to vote?" }] },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty messages array", () => {
    const result = ChatRequestSchema.safeParse({ messages: [] });
    expect(result.success).toBe(false);
  });

  it("rejects message text over 2000 chars", () => {
    const result = ChatRequestSchema.safeParse({
      messages: [
        {
          role: "user",
          parts: [{ text: "x".repeat(2001) }],
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid role", () => {
    const result = ChatRequestSchema.safeParse({
      messages: [{ role: "admin", parts: [{ text: "hello" }] }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 50 messages", () => {
    const messages = Array.from({ length: 51 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "model",
      parts: [{ text: "hello" }],
    }));
    const result = ChatRequestSchema.safeParse({ messages });
    expect(result.success).toBe(false);
  });
});
