# CivicGuide — Agent Context File

> **Read this entire file before writing any code.** It contains everything you need to understand what has been built, what conventions to follow, and what comes next.

---

## ⚠️ Critical: Framework Version

This project uses **Next.js 16.2.4** — NOT Next.js 13/14/15 as in your training data.

**Breaking changes from older versions:**
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

> **INDIA PIVOT (2026-04-26):** This app is specifically for **Indian elections** — ECI, NVSP, Lok Sabha, Rajya Sabha, Vidhan Sabha, EVMs, VVPAT, NOTA, MCC. All US election references have been removed.
> **ICON RULE:** Use **Lucide React** icons everywhere. No emojis in UI. Store icon names as strings in `lib/constants.ts`, render via `<DynamicIcon name="Vote" />` from `components/shared/DynamicIcon.tsx`.
> **DEPLOYMENT:** Google Cloud Run. `output: 'standalone'` is set in next.config.ts. Dockerfile and .dockerignore are ready.
- `middleware.ts` is **deprecated** — use `proxy.ts` with `export function proxy(req)` instead of `export function middleware(req)`
- Always check `node_modules/next/dist/docs/` for current API docs before writing route handlers, layouts, or server actions
- Tailwind CSS v4 is used — config syntax differs from v3 (no `tailwind.config.js` with `content` array; uses CSS-first configuration via `@import "tailwindcss"` in globals.css)
- React 19.2.4 is in use — hooks and Suspense behavior may differ

---

## 📋 Project Overview

| Field | Value |
|---|---|
| **App Name** | CivicGuide |
| **Purpose** | AI-powered assistant helping users understand the election process, timelines, and voting steps |
| **Directory** | `/home/kenx1kaneki/Desktop/Codesstuff/electoral_assistant` |
| **Dev Server** | `http://localhost:3000` |
| **Status** | Phase 1 COMPLETE, Phase 2 IN PROGRESS |

### Evaluation Criteria (from problem statement)
The submission is graded on: **Code Quality · Security · Efficiency · Testing · Accessibility · Google Services**

---

## 🏗️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS (CSS-first, v4) | ^4 |
| AI | Google Gemini 1.5 Flash | via `@google/generative-ai ^0.24.1` |
| Civic Data | Google Civic Information API | REST, proxied via `/api/civic` |
| Maps | Google Maps JS API | via `@googlemaps/react-wrapper ^1.2.0` |
| Auth + DB | Firebase Auth + Firestore | firebase ^12.12.1 |
| Translation | Google Cloud Translation API | REST, proxied via `/api/translate` |
| Icons | Lucide React | ^1.11.0 |
| Validation | Zod | ^4.3.6 |
| Class merging | clsx + tailwind-merge | via `cn()` in `lib/utils.ts` |
| Unit Tests | Vitest + React Testing Library | vitest ^4.1.5 |
| E2E Tests | Playwright | ^1.59.1 |
| A11y Tests | @axe-core/playwright | ^4.11.2 |

---

## 📁 Project File Structure (current state)

```
electoral_assistant/
├── app/
│   ├── globals.css          ✅ DONE — Full civic design system
│   ├── layout.tsx           ✅ DONE — Root layout, SEO meta, Google Fonts, ARIA live regions
│   └── page.tsx             ✅ DONE — Full landing page (Hero, Features, Timeline preview, CTA)
│
├── components/
│   └── layout/
│       ├── Navbar.tsx       ✅ DONE — Responsive, accessible, scroll-aware
│       └── Footer.tsx       ✅ DONE — Semantic nav, official links, disclaimer
│
├── lib/
│   ├── utils.ts             ✅ DONE — cn(), truncate(), formatDate(), debounce(), sleep()
│   ├── constants.ts         ✅ DONE — Election timeline (8 stages), features, nav, questions
│   ├── gemini.ts            ✅ DONE — System prompt, sanitizeInput(), Zod schemas, model factory
│   └── firebase.ts          ✅ DONE — Singleton Firebase init (App, Auth, Firestore)
│
├── __tests__/
│   └── unit/
│       └── gemini.test.ts   ✅ DONE — 15/15 tests passing
│
├── proxy.ts                 ✅ DONE — Rate limiter (20 req/min on /api/chat)
├── next.config.ts           ✅ DONE — CSP headers, security headers, image domains
├── vitest.config.ts         ✅ DONE
├── vitest.setup.ts          ✅ DONE
├── playwright.config.ts     ✅ DONE — Chrome, Firefox, Mobile Chrome
├── .env.local               ✅ EXISTS — Empty placeholders (user fills API keys)
├── .env.example             ✅ DONE — Documented template
└── package.json             ✅ DONE — All scripts: dev, test, test:e2e, etc.

--- NOT YET BUILT ---

app/
├── assistant/page.tsx       ⏳ Phase 2 — AI Chat interface
├── timeline/page.tsx        ⏳ Phase 3 — Interactive election timeline
├── find-polling/page.tsx    ⏳ Phase 4 — Maps + Civic API polling locator
├── how-to-vote/page.tsx     ⏳ Phase 3 — Step-by-step voting guide
├── ballot/page.tsx          ⏳ Phase 5 — Ballot preview
├── (auth)/login/page.tsx    ⏳ Phase 5 — Firebase Google Sign-In
└── api/
    ├── chat/route.ts        ⏳ Phase 2 — Gemini streaming endpoint
    ├── civic/route.ts       ⏳ Phase 4 — Civic API proxy
    └── translate/route.ts   ⏳ Phase 5 — Translation proxy

components/
├── chat/
│   ├── ChatWindow.tsx       ⏳ Phase 2
│   ├── MessageBubble.tsx    ⏳ Phase 2
│   └── SuggestedQuestions.tsx ⏳ Phase 2
├── timeline/
│   ├── ElectionTimeline.tsx ⏳ Phase 3
│   └── TimelineStep.tsx     ⏳ Phase 3
├── map/
│   ├── PollingMap.tsx       ⏳ Phase 4
│   └── AddressSearch.tsx    ⏳ Phase 4
└── shared/
    ├── AIBadge.tsx          ⏳ Phase 2
    └── AccessibilityToolbar.tsx ⏳ Phase 5

hooks/
├── useChat.ts               ⏳ Phase 2
├── useCivicData.ts          ⏳ Phase 4
└── useGeolocation.ts        ⏳ Phase 4

__tests__/
├── unit/
│   ├── timeline.test.ts     ⏳ Phase 3
│   └── civic-api.test.ts    ⏳ Phase 4
└── e2e/
    ├── chat.spec.ts         ⏳ Phase 2
    ├── polling-locator.spec.ts ⏳ Phase 4
    └── accessibility.spec.ts ⏳ Phase 5
```

---

## ✅ Phase 1 — COMPLETED

Everything listed below is fully built and working.

### What was done
1. Next.js 16 scaffolded with TypeScript + Tailwind v4
2. All dependencies installed (see package.json)
3. Design system built in `app/globals.css`:
   - CSS custom property tokens (navy/blue/gold palette)
   - Glassmorphism utilities (`.glass-card`, `.glass-card-hover`)
   - Gradient text utilities (`.gradient-text`, `.gradient-text-gold`)
   - Button classes (`.btn-primary`, `.btn-gold`, `.btn-ghost`)
   - Input styles, badge/tag utilities
   - Micro-animations: `@keyframes float`, `pulseGlow`, `shimmer`, `gradientShift`
   - `prefers-reduced-motion` fully respected
   - Skip-nav link, `.sr-only`, `:focus-visible` rings
4. Root layout with SEO metadata, Open Graph, Google Fonts via `<link>` (NOT @import — Turbopack breaks with @import in CSS)
5. Landing page: Hero → Stats bar → 6-feature grid → Timeline preview → Polling CTA → Trust section → Footer
6. Navbar: scroll-aware backdrop, aria-current page, keyboard Escape closes menu, tabIndex management on hidden items
7. Footer: semantic `<nav>`, external links with `sr-only` "(opens in new tab)", AI disclaimer
8. `lib/gemini.ts`: `sanitizeInput()` strips script block content + remaining HTML tags + protocol injection
9. `proxy.ts` for rate limiting (renamed from middleware.ts per Next.js 16 convention)
10. Security headers in `next.config.ts`: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
11. **15/15 unit tests passing** — tests caught and fixed a real XSS security bug in sanitizeInput

### Issues fixed during Phase 1
- Tailwind v4 + Turbopack does NOT allow `@import url(...)` after `@import "tailwindcss"` — fonts moved to `<link>` in layout
- `optimizeCss: true` in next.config requires `critters` package — removed the option, `critters` installed but unused
- `middleware.ts` → must be `proxy.ts` with `export function proxy()` in Next.js 16

---

## ⏳ Phase 2 — NEXT (AI Chat Interface)

**Goal:** Build the streaming Gemini AI chat assistant — the highest-priority feature for evaluators.

### Files to create

#### `app/api/chat/route.ts`
```typescript
// POST handler — server-side only, uses GEMINI_API_KEY from env
// 1. Import ChatRequestSchema from lib/gemini.ts
// 2. Parse + validate body with Zod
// 3. Sanitize the last user message with sanitizeInput()
// 4. Call createGeminiModel() from lib/gemini.ts
// 5. Use model.startChat({ history: messages.slice(0,-1) })
// 6. Call chat.sendMessageStream(lastMessage)
// 7. Return ReadableStream with text/event-stream content-type
// 8. Handle errors: return 400 for validation, 429 for rate limit, 500 for API errors
// Rate limiting is already handled by proxy.ts for /api/chat
```

#### `hooks/useChat.ts`
```typescript
// Client-side hook for chat state management
// State: messages[], isLoading, error
// sendMessage(text): POST to /api/chat, stream response via fetch ReadableStream
// Uses getReader() on response.body to consume SSE stream
// Appends streamed chunks to the last "model" message in real-time
```

#### `components/chat/ChatWindow.tsx` — `"use client"`
```tsx
// Full chat UI with:
// - Messages list (auto-scroll to bottom on new message)
// - Input bar at bottom (textarea, send button)
// - aria-live="polite" on message container for screen readers
// - Loading skeleton while streaming
// - AIBadge on every model response
```

#### `components/chat/MessageBubble.tsx`
```tsx
// Props: role ("user" | "model"), content (string), isStreaming (boolean)
// User: right-aligned, civic-blue background
// Model: left-aligned, glass-card background, with AIBadge
// Supports markdown-like rendering (bold, newlines → <br>)
```

#### `components/chat/SuggestedQuestions.tsx`
```tsx
// Shows SUGGESTED_QUESTIONS from lib/constants.ts as clickable chips
// Only visible when messages array is empty (fresh chat)
// Clicking a chip calls sendMessage(q.text)
```

#### `components/shared/AIBadge.tsx`
```tsx
// Small badge: "⚡ AI-Generated — Verify with official sources"
// Links to vote.gov in a new tab
// Always visible on model responses
```

#### `app/assistant/page.tsx`
```tsx
// Imports: Navbar, Footer, ChatWindow, SuggestedQuestions
// Reads ?q= query param to pre-populate initial message (from landing page chips)
// useEffect: if q param exists, call sendMessage(q) on mount
// Layout: full-height page, chat takes remaining viewport height
```

### Key rules for Phase 2
- The API route is **server-side** — GEMINI_API_KEY is never in client code
- Always use `createGeminiModel()` from `lib/gemini.ts` — don't re-instantiate the model
- Always validate request body with `ChatRequestSchema.parse()` before calling Gemini
- Always run `sanitizeInput()` on the user's last message before sending to the model
- Streaming: use `ReadableStream` + `controller.enqueue(chunk.text())` pattern
- The `useChat` hook should handle stream reading with `getReader()` and `read()` loop
- Add `data-testid="ai-response"` to model message bubbles for E2E tests
- Add `data-testid="chat-input"` to the textarea

---

## ⏳ Phase 3 — Interactive Timeline & Voting Guide

**Goal:** Visual interactive election timeline and step-by-step how-to-vote guide.

### Key data source
`ELECTION_TIMELINE_STAGES` in `lib/constants.ts` — 8 stages with id, step, title, description, icon, duration, keyDates[], tips[], officialLink

### Files to create
- `components/timeline/ElectionTimeline.tsx` — vertical stepper, expandable stages
- `components/timeline/TimelineStep.tsx` — individual stage card with `<details>`/`<summary>` for native expand/collapse (no JS needed for basic accessibility)
- `app/timeline/page.tsx` — full timeline page with Navbar + Footer
- `app/how-to-vote/page.tsx` — accordion guide: Register → ID → Voting Methods → Cast Vote → Post-Vote

### Key rules for Phase 3
- Each `TimelineStep` must have: icon, step number badge, title, description, keyDates list, tips list, link to officialLink
- "Ask AI about this step" button on each stage → opens `/assistant?q=Tell me more about ${stage.title}`
- Timeline connector lines between steps
- Animate steps in on scroll using Intersection Observer
- `prefers-reduced-motion`: skip animations, show all stages expanded by default

---

## ⏳ Phase 4 — Polling Place Finder (Maps + Civic API)

**Goal:** Address-based polling location finder using Google Civic Information API + Google Maps.

### Files to create
- `app/api/civic/route.ts` — GET proxy: validates address with Zod, calls Civic API, caches 1hr (`next: { revalidate: 3600 }`)
- `app/api/translate/route.ts` — POST proxy: translates text via Cloud Translation API
- `components/map/AddressSearch.tsx` — Google Places Autocomplete input (ARIA compliant)
- `components/map/PollingMap.tsx` — `@googlemaps/react-wrapper` map with accessible markers
- `app/find-polling/page.tsx` — address search + map + text list (both always rendered)
- `hooks/useCivicData.ts` — fetches from `/api/civic`, manages loading/error states
- `hooks/useGeolocation.ts` — browser geolocation API for "use my location" button

### Key rules for Phase 4
- Maps API key goes in `GOOGLE_MAPS_API_KEY` (server env, NOT `NEXT_PUBLIC_`)
- Pass the key via a server component or API route — never hardcode in client
- ALWAYS render a text-list (`data-testid="polling-list"`) alongside the map (`data-testid="polling-map"`) — accessibility requirement
- Map markers must have ARIA labels: `aria-label="Polling place: [name], [address]"`
- "Get Directions" links: `target="_blank" rel="noopener noreferrer"`
- Civic API caching: max 3600 seconds (1hr). Do NOT cache longer — per Google ToS
- Handle Civic API 404 gracefully: show "No data found for this address" with link to vote.gov

---

## ⏳ Phase 5 — Auth, Multilingual, A11y Audit & Deploy

**Goal:** Firebase Auth, Google Translate, accessibility audit, production deploy.

### Files to create
- `app/(auth)/login/page.tsx` — Google Sign-In button via Firebase Auth
- `components/layout/LanguageSwitcher.tsx` — dropdown, 6 languages from `SUPPORTED_LANGUAGES` in constants.ts
- `app/api/translate/route.ts` — Cloud Translation API proxy
- `__tests__/e2e/accessibility.spec.ts` — axe-core on every page
- `__tests__/e2e/chat.spec.ts` — full chat flow E2E
- `__tests__/e2e/polling-locator.spec.ts` — address search to map E2E

### Key rules for Phase 5
- `SUPPORTED_LANGUAGES` is already defined in `lib/constants.ts`: en, es, fr, hi, zh, ar
- Language choice stored in `localStorage` key `"civic-lang"` + Firebase user profile
- Update `<html lang="...">` attribute dynamically on language switch
- Run `npx playwright install` before E2E tests if browsers aren't installed
- axe-core violations must be ZERO before considering any page done

---

## 🔑 Environment Variables

File: `.env.local` (exists, keys are empty — user must fill them)

```
GEMINI_API_KEY=                          # Server-side only — Gemini AI
GOOGLE_CIVIC_API_KEY=                    # Server-side only — Civic Info API
GOOGLE_MAPS_API_KEY=                     # Server-side only — Maps JS API
GOOGLE_TRANSLATE_API_KEY=                # Server-side only — Translation API
NEXT_PUBLIC_FIREBASE_API_KEY=            # Client-safe — Firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=        # Client-safe — Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=         # Client-safe — Firebase
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=     # Client-safe — Firebase
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID= # Client-safe — Firebase
NEXT_PUBLIC_FIREBASE_APP_ID=             # Client-safe — Firebase
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**RULE:** Any key without `NEXT_PUBLIC_` prefix is server-side ONLY. Never import it in a client component (`"use client"`). Always access from API routes or Server Components.

---

## 🎨 Design System Reference

All design tokens are CSS custom properties defined in `app/globals.css`.

### Color Palette
```css
--civic-navy: hsl(222, 65%, 12%)       /* Page background */
--civic-navy-light: hsl(222, 55%, 18%) /* Card backgrounds */
--civic-blue: hsl(215, 85%, 52%)       /* Primary interactive */
--civic-blue-light: hsl(212, 90%, 65%) /* Hover / AI text */
--civic-gold: hsl(43, 92%, 58%)        /* CTA / Accent */
--civic-white: hsl(210, 20%, 98%)      /* Primary text */
--civic-gray-300: hsl(220, 15%, 78%)   /* Secondary text */
--civic-gray-500: hsl(220, 12%, 55%)   /* Muted text */
```

### Key Utility Classes (defined in globals.css — use these, don't invent ad-hoc styles)
- `.glass-card` — glassmorphism card
- `.glass-card-hover` — adds hover lift + border glow
- `.gradient-text` — blue-to-gold gradient text fill
- `.gradient-text-gold` — gold gradient text fill
- `.btn-primary` — blue pill button
- `.btn-gold` — gold pill button (main CTA style)
- `.btn-ghost` — transparent bordered pill button
- `.input-base` — dark input field with focus glow
- `.badge`, `.badge-blue`, `.badge-gold`, `.badge-success` — label badges
- `.skeleton` — shimmer loading placeholder
- `.animated-gradient-bg` — animated background for hero sections
- `.section-padding` — `padding: 5rem 1.5rem`
- `.container-max` — `max-width: 1200px; margin: 0 auto`
- `.sr-only` — screen-reader only (visually hidden)
- `.text-display`, `.text-headline`, `.text-subheadline` — typography scale

### Fonts
- **Display / Headings:** `"Outfit"` — use `font-family: var(--font-display)`
- **Body / UI:** `"Inter"` — use `font-family: var(--font-sans)`
- Loaded via `<link>` in `app/layout.tsx` (NOT CSS @import — breaks Turbopack)

---

## 🧪 Testing Reference

### Run unit tests
```bash
npm run test          # Run all unit tests once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Run E2E tests
```bash
npm run test:e2e      # Run all Playwright tests
npm run test:e2e:ui   # Playwright UI mode
```

### Unit test location
`__tests__/unit/*.test.ts` — Vitest + React Testing Library + jsdom

### E2E test location
`__tests__/e2e/*.spec.ts` — Playwright

### Current test status
- `__tests__/unit/gemini.test.ts` — **15/15 PASSING** ✅

### Test IDs to maintain (for E2E selectors)
```
data-testid="ai-response"      # Model message bubbles in ChatWindow
data-testid="chat-input"       # Textarea in ChatWindow  
data-testid="polling-map"      # Google Map container
data-testid="polling-list"     # Text list of polling places
```

---

## ♿ Accessibility Rules (WCAG 2.1 AA — non-negotiable)

1. **Every image** needs `alt` text; decorative images get `aria-hidden="true"`
2. **Icon-only buttons** need `aria-label`; icons inside labeled buttons get `aria-hidden="true"`
3. **External links** need `<span className="sr-only">(opens in new tab)</span>`
4. **Loading states** must use `aria-live="polite"` regions — update text content, not render/destroy
5. **Forms** need `<label htmlFor>` on every input — never use `placeholder` as the only label
6. **Tab order** must be logical — no `tabIndex > 0`
7. **Focus rings** — never use `outline: none` without a replacement; rely on `:focus-visible` from globals.css
8. **Color** — never use color as the only way to convey info
9. **Keyboard** — all interactive elements reachable and operable via keyboard
10. **Headings** — one `<h1>` per page, logical hierarchy (no skipping h2→h4)
11. `aria-current="page"` on active nav links (Navbar already implements this)
12. `role="status"` or `role="alert"` for dynamic status messages

---

## 🔐 Security Rules (always follow)

1. **Never** put `GEMINI_API_KEY`, `GOOGLE_CIVIC_API_KEY`, `GOOGLE_MAPS_API_KEY`, or `GOOGLE_TRANSLATE_API_KEY` in any client component or `NEXT_PUBLIC_` variable
2. **Always** validate API route request bodies with `ChatRequestSchema.parse()` or a dedicated Zod schema — throw 400 on failure
3. **Always** run `sanitizeInput()` from `lib/gemini.ts` on any user text before passing to Gemini
4. **Never** trust user-supplied IDs or query params — validate with Zod before use
5. Rate limiting is in `proxy.ts` for `/api/chat` — do not remove or bypass it
6. External links: always `rel="noopener noreferrer"` on `target="_blank"`
7. `Content-Security-Policy` is set in `next.config.ts` — if you add new external domains (fonts, scripts), update the CSP

---

## 📝 Code Quality Rules

1. **TypeScript strict mode** — no `any` types; use proper interfaces
2. **Use `cn()` from `lib/utils.ts`** for conditional class merging (never template literals for Tailwind)
3. **Server Components by default** — only add `"use client"` when you need browser APIs, event handlers, or hooks
4. **Data from `lib/constants.ts`** — all election content (timeline stages, suggested questions, nav items, features) lives there. Do not hardcode strings in components.
5. **Component naming** — PascalCase files, one component per file
6. **API routes** — always return typed `Response.json()` with explicit HTTP status codes
7. **No console.log in production code** — use proper error handling and return meaningful error responses

---

## 🚀 Running the Project

```bash
# Start dev server
npm run dev
# → http://localhost:3000

# Run unit tests
npm run test

# Lint
npm run lint
```

Dev server was last confirmed working at `http://localhost:3000` with HTTP 200 on `/`.

---

## 📊 Phase Completion Status

| Phase | Goal | Status |
|---|---|---|
| **Phase 1** | Scaffold, design system, core libs, landing page | ✅ COMPLETE |
| **Phase 2** | Streaming AI Chat (Gemini) | ✅ COMPLETE |
| **Phase 3** | Interactive Timeline + How-to-Vote | ⏳ NOT STARTED |
| **Phase 4** | Polling Booth Finder (ECI Portal + Maps) | ⏳ NOT STARTED |
| **Phase 5** | Auth, Multilingual, A11y Audit, Cloud Run Deploy | ⏳ NOT STARTED |

**Start with Phase 3** — Interactive Election Timeline page.

---

## 🔄 Changes Since Last Session (2026-04-26)

### India Pivot
- `lib/constants.ts` — fully rewritten for Indian elections (ECI, NVSP, Lok Sabha, Rajya Sabha, EPIC, EVM, VVPAT, NOTA, MCC, 8 Indian election stages)
- `lib/gemini.ts` — system prompt rewritten for Indian electoral context; multilingual (Hindi, Tamil, Telugu, Bengali, Marathi); strict neutrality for Indian parties (BJP, Congress, AAP, etc.)
- `app/page.tsx` — fully rewritten landing page: Indian theme, Hindi hero headline, saffron/tricolor accents, ECI/NVSP official links
- `app/globals.css` — `--civic-gold` replaced with `--civic-saffron` (hsl 28); tricolor divider; gradient-border-card with CSS mask; hero orbs; fadeInUp animations

### Icon System
- **No more emojis** — all icons use Lucide React
- `components/shared/DynamicIcon.tsx` — renders any Lucide icon by string name
- `lib/constants.ts` icon fields are now Lucide icon names (e.g., `"Vote"`, `"ClipboardList"`, `"Megaphone"`)

### Phase 2 — Completed
- `app/api/chat/route.ts` — Gemini streaming POST endpoint
- `hooks/useChat.ts` — streaming hook with AbortController and error handling
- `components/chat/ChatWindow.tsx` — full chat UI with aria-live, auto-scroll
- `components/chat/MessageBubble.tsx` — user/model bubbles with streaming cursor
- `components/chat/SuggestedQuestions.tsx` — DynamicIcon chips for quick questions
- `components/shared/AIBadge.tsx` — Lucide Zap icon + ECI verification link
- `app/assistant/page.tsx` + `AssistantClient.tsx` — ?q= param prefill

### Cloud Run Prep
- `next.config.ts` — `output: 'standalone'` added
- `Dockerfile` — multi-stage (deps/builder/runner), non-root user, PORT=8080
- `.dockerignore` — excludes node_modules, .next, tests, env files

### Tests
- **15/15 unit tests passing** ✅ (gemini.test.ts)

---

## 🚀 Cloud Run Deployment Steps (when ready)

```bash
# 1. Build and push to Artifact Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/civicguide-india .

# 2. Deploy to Cloud Run
gcloud run deploy civicguide-india \
  --image gcr.io/PROJECT_ID/civicguide-india \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=...,GOOGLE_CIVIC_API_KEY=... \
  --port 8080
```

**Region:** Use `asia-south1` (Mumbai) for lowest latency for Indian users.
**Secrets:** Inject `GEMINI_API_KEY` etc. via Cloud Run env vars or Secret Manager — never bake into image.

---

## 🎨 Updated Design Tokens

```css
--civic-saffron: hsl(28, 100%, 55%)     /* Indian accent — was --civic-gold */
--civic-saffron-light: hsl(32, 100%, 70%)
--civic-saffron-dark: hsl(24, 95%, 42%)
--civic-green: hsl(135, 60%, 38%)       /* Indian tricolor green */
--civic-green-light: hsl(135, 55%, 55%)
```

New utility classes: `.btn-saffron`, `.badge-saffron`, `.badge-green`, `.gradient-text-saffron`, `.gradient-text-tricolor`, `.tricolor-bar`, `.gradient-border-card`, `.stat-box`, `.bubble-user`, `.bubble-ai`, `.hero-orb`, `.animate-fade-in-up`
