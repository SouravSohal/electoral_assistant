# CivicGuide India 🇮🇳 — AI Electoral Assistant

**CivicGuide India** is a state-of-the-art, agentic AI platform designed to empower the 97 crore voters of India. Built for the **Google Hack2Skill Prompt Wars**, it provides verified, personalized, and highly accessible guidance on the Indian electoral process using a multi-agent orchestration layer.

---

## 🎯 1. Chosen Vertical: Civic & Voter Education

### The Problem
During Indian elections, citizens face three critical challenges:
1.  **Information Fragmentation**: Data about booths, registration, and candidates is spread across multiple portals.
2.  **Misinformation**: Viral "WhatsApp rumors" often mislead voters about their rights or polling dates.
3.  **Accessibility**: Technical and legal jargon makes the electoral process feel intimidating to many.

### Our Solution
A **"Cockpit for Citizens"** that acts as a personalized, agentic guide. Our persona is a **Verified Electoral Assistant** that is neutral, legally grounded, and context-aware.

---

## 🧠 2. Approach & Logic

Our core innovation is the **Multi-Agent Reasoning Graph**. Unlike basic chatbots that use single-shot prompts, CivicGuide uses **LangGraph** to coordinate a team of specialized AI agents.

### The Agentic Decision Loop
1.  **Intent Routing**: The system identifies if the user needs general info, a polling location, or a fact-check.
2.  **Personalization Node**: The system fetches the user's **Firebase Profile** (State, Constituency, Language) to tailor the response.
3.  **Collaborative Analysis**: For complex queries, agents "talk" to each other:
    -   **Researcher**: Fetches real-time facts via **Tavily Search**.
    -   **Analyst**: Cross-references facts with the **RPA 1951** via **Legal RAG**.
    -   **Synthesis**: Compiles the final report with a verified verdict.

### Logic Diagram (Mermaid)
```mermaid
graph TD
    User([User Input]) --> Router{Intent Router}
    
    Router -- General Assistant --> Personalizer[Personalizer Node]
    Router -- Fact-Check --> Researcher[Researcher Node]
    
    Personalizer --> Profile[(User Profile Firestore)]
    Personalizer --> Assistant[Response Agent]
    
    Researcher --> Search[Web Search Tool]
    Search --> Analyst[Legal Analyst Node]
    Analyst --> RAG[Legal RAG Tool]
    Analyst --> Synthesis[Synthesis Agent]
    
    Assistant --> Output([Personalized Response])
    Synthesis --> Output
```

---

## 🛠️ 3. How the Solution Works

### Step-by-Step Workflow
1.  **Onboarding**: Users sign in via **Google Auth** and create a voter profile (State, District, Interests).
2.  **Personalized Assistant**: Users chat with an AI that remembers their history (**Memory**) and knows their constituency.
3.  **Fact-Check Engine**: Users paste suspicious election news. The AI investigates live sources and cites official ECI rules.
4.  **Polling Finder**: Users search for their address. The app uses **Google Maps** and **ECI APIs** to show the exact booth on a map.
5.  **Interactive Timeline**: A visual tracker of the 8 stages of the election, from nomination to results.

---

## 🚀 4. Google Services Integration

| Service | Application |
| :--- | :--- |
| **Gemini 1.5 Flash** | Powers the core agentic reasoning, RAG, and fact-checking logic. |
| **Firebase Auth** | Provides secure, one-tap login for citizens. |
| **Firestore** | Stores persistent user profiles and long-term conversation memory. |
| **Google Maps API** | Provides visual polling booth locating and places autocomplete. |
| **Civic Info API** | Serves as the source of truth for official polling and candidate data. |
| **Cloud Translation** | Real-time localization into 6 major Indian languages. |
| **Cloud Run** | Scalable deployment to ensure the app handles the surge of election-day traffic. |

---

## 🛡️ 5. Security & Accessibility

-   **Safety First**: Multi-layer sanitization to prevent XSS and Prompt Injection.
-   **Strict Neutrality**: System prompts are hard-coded to maintain absolute non-partisanship.
-   **WCAG 2.1 AA**: Screen-reader support, high-contrast themes, and keyboard navigation.
-   **Privacy**: User data is encrypted and used only to personalize the electoral experience.

---

## 📋 6. Assumptions Made

1.  **Official Sources**: We assume the **ECI (Election Commission of India)** is the definitive source of truth for all data tools.
2.  **Internet Connectivity**: While lightweight, we assume a basic mobile data connection for real-time AI features.
3.  **Data Caching**: Per Google ToS, we cache Civic API data for a maximum of 1 hour to ensure fresh, accurate info.

---

## 🏁 7. Getting Started

```bash
# Clone the repo
git clone https://github.com/SouravSohal/electoral_assistant.git

# Install Dependencies
npm install --legacy-peer-deps

# Configure .env.local with GEMINI_API_KEY, FIREBASE_*, etc.

# Run Dev Server
npm run dev
```

Built for the **Google Hack2Skill Prompt Wars** | Helping India Vote, One Prompt at a Time.
