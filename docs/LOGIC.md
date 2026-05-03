# AI Reasoning & Logic — CivicGuide India

This document explains the "Intelligence Layer" of the platform—how we use **Prompt Engineering** and **Agentic Workflows** to deliver high-quality electoral education.

---

## 🤖 1. The Agentic Reasoning Loop
The "Researcher Agent" is designed to handle open-ended questions about candidates or election dates.

### The Self-Correction Loop:
1. **Tool Identification**: AI analyzes the query and selects the `google_search` tool.
2. **Execution**: The search tool returns raw snippets from official sources.
3. **Synthesis**: The AI attempts to answer the user's question.
4. **Validation (Internal)**: If the info is incomplete, the AI **automatically re-runs** the loop (up to 3 iterations) with a refined search query.
5. **Final Output**: A cited, neutral response.

---

## 🎯 2. Prompt Engineering Strategy

### System Prompt (The Persona)
The persona is "CivicGuide India"—warm, encouraging, and authoritative. It is strictly constrained by:
- **Neutrality**: "NEVER endorse or oppose any political party."
- **Factuality**: "Cite ECI resources whenever possible."
- **Locality**: Personalizes advice based on the user's `Voter Category` (e.g., First-Time Voter vs. Senior Citizen).

### Fact-Check Mode
A specialized logic branch that uses **Evidence-Based Reasoning**:
- **Step 1**: Identify claims in "WhatsApp Forwards."
- **Step 2**: Search official rulebooks (MCC, Representation of the People Act).
- **Step 3**: Deliver a structured verdict (VERDICT, SUMMARY, ANALYSIS, ACTION).

---

## ⚡ 3. Efficiency Logic: Semantic Caching
To optimize cost and speed, we implement a **Semantic Cache**:
- **Key Generation**: We hash the JSON representation of the AI request.
- **Cache Policy**: 30-minute TTL (Time to Live).
- **Memory Safety**: LRU (Least Recently Used) eviction policy caps the cache at 100 items, preventing memory leaks in production.

---

## 🛡️ 4. Safety Guardrails
- **Input Sanitization**: Multi-regex pipeline blocks script injection and malicious protocols.
- **Output Validation**: AI-generated text is rendered as escaped Markdown to prevent XSS.
- **Throttling**: A mandatory 2-second gap between AI requests protects the API quota from automated abuse.
