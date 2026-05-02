# CivicGuide India 🇮🇳

**CivicGuide India** is an AI-powered assistant designed to make the Indian electoral process transparent, accessible, and easy to navigate. Built for the **Google Hack2Skill Prompt Wars**, it leverages the power of **Gemini 1.5 Flash** and **Google Cloud** to provide real-time, non-partisan electoral information to over 97 crore Indian voters.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-blue?logo=tailwind-css)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_1.5_Flash-4285F4?logo=google-gemini)
![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-green)

## 🌟 Key Features

-   **🤖 Agentic AI Assistant**: Chat with Gemini to understand MCC, NOTA, voting eligibility, and more.
-   **🗺️ Polling Booth Locator**: Find your nearest booth using Google Maps and Civic Information API.
-   **⏳ Interactive Election Timeline**: Track the 8 stages of the Indian election process (from MCC to Government Formation).
-   **🗳️ Digital Ballot Preview**: A mockup of the Electronic Voting Machine (EVM) to familiarize new voters.
-   **🌐 Multilingual Support**: Available in 6 languages (English, Hindi, Tamil, Telugu, Bengali, Marathi).
-   **♿ Accessibility First**: Fully compliant with WCAG 2.1 AA standards.

## 🚀 Getting Started

### Prerequisites

-   Node.js 20+
-   A Google Cloud Project with Gemini API, Civic Information API, and Maps JS API enabled.
-   A Firebase project for Auth and Firestore.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/SouravSohal/electoral_assistant.git
    cd electoral_assistant
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add your keys:
    ```env
    GEMINI_API_KEY=your_gemini_key
    GOOGLE_CIVIC_API_KEY=your_civic_key
    GOOGLE_MAPS_API_KEY=your_maps_key
    GOOGLE_TRANSLATE_API_KEY=your_translate_key
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
    # ... (see .env.example for full list)
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
-   **AI**: Google Gemini 1.5 Flash via `@google/generative-ai`.
-   **APIs**: Google Civic Information API, Google Maps JS API, Cloud Translation API.
-   **Backend**: Firebase (Auth, Firestore).
-   **Testing**: Vitest (Unit), Playwright (E2E).
-   **Deployment**: Google Cloud Run (Docker).

## 📊 Architecture

For a deep dive into the system design, data flow, and security measures, see [architecture.md](./architecture.md).

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests (Playwright)
npm run test:e2e
```

## 📜 Disclaimer

*CivicGuide India is an educational tool. All data is fetched from official sources (ECI/NVSP), but users should always verify critical information via [voters.eci.gov.in](https://voters.eci.gov.in).*

---
Built with ❤️ for India's Democracy.
