# Logic Documentation: CivicGuide India

This document explains the core logic and architectural decisions driving the **CivicGuide India** platform.

---

## 📱 Responsiveness & Device-Agnostic Logic

The platform follows a **Modular Adaptation** strategy, ensuring that complex tools (AI, Maps, Simulators) are intuitive on mobile while remaining high-impact on desktop.

### 1. Mobile-First Grid Logic
We use Tailwind CSS's breakpoint system to manage layout transitions.
- **Desktop**: Side-by-side layouts (e.g., Map vs. Results) for maximum information density.
- **Mobile**: Vertical stacking with **Contextual Prioritization**.
  - *Example*: In the Polling Locator, the Map is moved to the top (`order-1`) on mobile to provide immediate geographical context, followed by the search interface.

### 2. Interaction Ergonomics
- **Touch Targets**: All buttons and interactive chips maintain a minimum touch target size and padding to accommodate finger-based navigation.
- **Avoidance of "Scroll Traps"**: We eliminated fixed screen heights (`h-screen`) in favor of dynamic containers (`min-h-screen`, `flex-1`). This prevents mobile browser address bars from obscuring critical UI elements like the AI chat input.
- **Expansion Logic**: The Election Timeline uses native `<details>` and `<summary>` elements for expandable steps, providing accessible and performant interactions without heavy JS overhead.

### 3. Typography Scaling
We implemented a fluid typography scale using custom CSS variables and Tailwind utilities:
- **Hero Headers**: Scaled dynamically from `text-3xl` on small mobiles to `text-6xl/text-display` on 2K monitors.
- **Body Text**: Adjusted leading and tracking for maximum legibility on narrow viewports.

---

## 🤖 AI Logic (Gemini 1.5 Flash)

### 1. Context Injection
The AI Assistant uses a pre-seeded system prompt focused on the **Indian Electoral System**. It is programmed to be:
- **Strictly Neutral**: No bias toward political parties.
- **Multilingual**: Capable of responding in English, Hindi, and regional languages.
- **Educational**: Focuses on ECI guidelines, NVSP portals, and voting procedures.

### 2. Security & Sanitization
Every user prompt passes through a `sanitizeInput()` utility that:
- Strips script tags and HTML.
- Prevents protocol injection.
- Validates against a Zod schema before hitting the Gemini API.

---

## 🗳️ EVM Simulation Logic
The **EVM Mockup** is built as a pure React state machine:
1. **Selection**: User taps a "Vote" button next to a candidate.
2. **Visual Feedback**: The red light glows, and the "BEEP" button (simulated) indicates completion.
3. **Reset**: State is cleared on close, ensuring no actual vote is "recorded" (simulating a clean ballot unit for each user).

---

## 📍 Polling Locator Logic
1. **Address Search**: Uses Google Places Autocomplete (via a server-side proxy for security).
2. **Civic Data Fetching**: Proxies the Google Civic Information API.
3. **Map Rendering**: Uses `@googlemaps/react-wrapper` with a custom-styled dark theme markers.
4. **Accessibility Fallback**: A high-contrast text list is *always* rendered beneath the map, ensuring WCAG compliance for users with visual impairments.
