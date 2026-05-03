# System Architecture — CivicGuide India

CivicGuide India is built on a modern, distributed architecture designed for **high availability, strict security, and modular scalability.**

---

## 🏗️ 1. Frontend Architecture: Feature-Sliced Design (FSD)
The application follows the **FSD Pattern**, which organizes the codebase by business domain rather than technical type.

### Layers:
- **`app/`**: Next.js App Router (Routing, Layouts, Metadata).
- **`features/`**: Domain-specific logic (e.g., `assistant`, `evm`, `polling`).
  - Contains its own `components`, `hooks`, and `api` proxies.
- **`components/`**: Shared UI library (Atomic design using Tailwind v4).
- **`lib/`**: Core infrastructure (AI Engine, Database, Shared Schemas).

---

## 🧩 2. AI Engine: The Singleton Proxy Pattern
To ensure the AI is both efficient and testable, we use a **Singleton Proxy** architecture:
- **Centralized Engine**: `lib/ai-engine.ts` handles all model instantiation.
- **Semantic Proxy**: Intercepts all AI calls to inject **Caching** and **Throttling** logic without polluting the business logic.
- **Provider Pattern**: Agents use a separate provider to ensure they remain decoupled from the main chat UI.

---

## 🔒 3. Security Model: Defense in Depth
- **Edge Security**: `proxy.ts` middleware enforces global rate limiting and security headers.
- **Data Sanitization**: Multi-stage sanitization pipeline for user inputs (Regex + HTML Stripping + Script Protocol Blocking).
- **Network Isolation**: All Google API keys are stored in server-side environment variables, never reaching the client.
- **CSP**: Strict Content Security Policy prevents unauthorized script execution.

---

## ☁️ 4. Deployment Architecture: Google Cloud Run
- **Containerization**: Optimized Docker image using Next.js `standalone` mode.
- **Auto-Scaling**: Horizontal scaling from 0 to 1000+ instances based on request volume.
- **Global Distribution**: Deployed to `asia-south1` (Mumbai) to minimize latency for Indian users.

---

## 📊 5. Data Flow
1. **User Request** → Next.js Route Handler.
2. **Validation** → Zod Schema Check.
3. **Cache Check** → `AIEngine` checks In-Memory Semantic Cache.
4. **AI Execution** → Gemini 2.5 generates response/calls tools.
5. **Streaming** → `ReadableStream` sends chunks back to UI.
6. **Persistence** → Optional Firestore sync for user profiles.
