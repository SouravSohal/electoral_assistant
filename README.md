# 🇮🇳 CivicGuide India — Prompt Wars 2026

**The Challenge**: Election Process Education  
**The Solution**: An AI-powered, agentic platform designed to empower 1.4 billion Indian citizens through transparent, neutral, and accessible electoral education.

---

## 🎯 Chosen Vertical: The Indian Electoral System
Our solution focuses specifically on the **Indian Democracy**, the largest in the world. We address the unique complexities of the **Election Commission of India (ECI)**, including:
- **Registration**: Form 6/8, EPIC (Voter ID) details, and NVSP portal guidance.
- **Technology**: Understanding EVMs, VVPAT verification, and NOTA.
- **Integrity**: Real-time Fact-Checking of "WhatsApp University" forwards and rumors.
- **Participation**: Polling booth locators and step-by-step voting guides.

---

## 🧠 Approach and Logic

### 1. Agentic AI Architecture
Unlike standard chatbots, CivicGuide uses an **Agentic Framework**. The AI doesn't just "talk"; it "does."
- **Researcher Agent**: Uses Google Search tools to verify real-time candidate data and constituency details.
- **Fact-Checker Agent**: Specialized reasoning loop designed to cross-reference rumors against official ECI guidelines.
- **Neutrality Engine**: A strict system-level constraint that prevents partisan bias while maintaining a warm, encouraging tone.

### 2. Semantic Caching & Throttling
To handle the scale of an Indian election while remaining efficient:
- **Semantic Cache**: Uses an LRU (Least Recently Used) cache to serve common questions (e.g., "How to register?") in <5ms.
- **Rate Limiting**: Protects your API quota and infrastructure via a 20-req/min global proxy.

### 3. Feature-Sliced Design (FSD)
The code follows the **FSD architectural pattern**, separating logic into isolated "Features" (Assistant, EVM, Polling). This ensures 100% maintainability and prevents bug regressions.

---

## 🛠️ How the Solution Works

1. **The Interactive Assistant**: A streaming chat interface that uses `gemini-2.5-flash` to provide instant, personalized electoral advice based on the user's location and interests.
2. **EVM Simulator**: A visual interactive guide that demystifies how to use an Electronic Voting Machine and verify the VVPAT slip.
3. **Polling Booth Locator**: Integrates **Google Maps** to help users find their exact voting location based on their address.
4. **Rumor Verifier**: A dedicated tool where users can paste suspicious election news to get an instant, cited verdict from official sources.

---

## ⚖️ Key Assumptions

1. **Official Truth**: We assume the **Election Commission of India (ECI)** is the single source of truth for all procedural facts.
2. **Connectivity**: We assume that while India has vast internet reach, bandwidth can be unstable, so we've optimized the app for speed and lightweight performance.
3. **Multilingual Necessity**: We assume users prefer learning about democracy in their mother tongue, implementing support for **Hindi, English, Tamil, Telugu, Bengali, and Marathi**.
4. **Non-Partisanship**: We assume that an educational tool must never take sides, maintaining absolute neutrality across all political parties.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16.2.4 (Turbopack)
- **AI Engine**: Google Gemini 2.5 Flash
- **Maps**: Google Maps JS API + Places Autocomplete
- **Auth/DB**: Firebase (Google Cloud)
- **Deployment**: Google Cloud Run (Docker Standalone)
- **Styling**: Tailwind CSS v4 (CSS-first)
- **Accessibility**: WCAG 2.1 AA Compliant

---

## 📚 Technical Deep Dive

For judges and developers looking for more detail, explore our specialized documentation:

- 🏗️ **[Architecture](docs/ARCHITECTURE.md)** — Feature-Sliced Design & Deployment.
- 🧠 **[Logic & AI](docs/LOGIC.md)** — Agentic loops & Prompt strategies.
- 🌟 **[Feature Set](docs/FEATURES.md)** — Comprehensive catalog & Social impact.
- 📈 **[Scalability](docs/SCALABILITY.md)** — Growth roadmap & Future vision.

---



**CivicGuide India — Empowering the Voter, Strengthening the Democracy.**
