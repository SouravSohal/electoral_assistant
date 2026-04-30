/**
 * lib/constants.ts
 * Application-wide constants — Indian Electoral System.
 * Icons use Lucide React icon names (rendered via <DynamicIcon name={...} />).
 */

// --- App Config ---
export const APP_NAME = "CivicGuide India";
export const APP_TAGLINE = "आपका AI चुनाव सहायक";
export const APP_TAGLINE_EN = "Your AI-Powered Election Assistant";
export const APP_DESCRIPTION =
  "Understand India's election process, find your polling booth, and learn how your vote shapes democracy — powered by AI and the Election Commission of India.";

// --- India Specific ---
export const ECI_PORTAL = "https://voters.eci.gov.in";
export const NVSP_PORTAL = "https://nvsp.in";
export const VOTER_HELPLINE = "1950";
export const ECI_RESULTS = "https://results.eci.gov.in";

// --- Supported Languages (Indian focus) ---
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇮🇳", native: "English" },
  { code: "hi", label: "Hindi", flag: "🇮🇳", native: "हिन्दी" },
  { code: "ta", label: "Tamil", flag: "🇮🇳", native: "தமிழ்" },
  { code: "te", label: "Telugu", flag: "🇮🇳", native: "తెలుగు" },
  { code: "bn", label: "Bengali", flag: "🇮🇳", native: "বাংলা" },
  { code: "mr", label: "Marathi", flag: "🇮🇳", native: "मराठी" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

// --- Indian Election Types ---
export const ELECTION_TYPES = [
  {
    id: "lok-sabha",
    title: "Lok Sabha",
    subtitle: "General Elections",
    description: "Elections to India's lower house of Parliament. 543 seats, held every 5 years.",
    icon: "Landmark",
  },
  {
    id: "rajya-sabha",
    title: "Rajya Sabha",
    subtitle: "Upper House",
    description: "Members elected by State Legislative Assemblies. 245 total seats, staggered elections.",
    icon: "Scale",
  },
  {
    id: "vidhan-sabha",
    title: "Vidhan Sabha",
    subtitle: "State Assembly Elections",
    description: "Elections to State Legislative Assemblies (MLAs). Held every 5 years per state.",
    icon: "Building2",
  },
  {
    id: "local-body",
    title: "Local Body",
    subtitle: "Panchayat & Municipal",
    description: "Elections for gram panchayats, municipal corporations, and other local governance bodies.",
    icon: "Home",
  },
] as const;

// --- Indian Election Timeline Stages ---
export interface TimelineStage {
  id: string;
  step: number;
  title: string;
  titleHi: string;
  description: string;
  icon: string; // Lucide icon name
  duration: string;
  keyDates: string[];
  tips: string[];
  officialLink?: string;
}

export const ELECTION_TIMELINE_STAGES: TimelineStage[] = [
  {
    id: "election-announcement",
    step: 1,
    title: "Election Announcement & MCC",
    titleHi: "चुनाव की घोषणा और आचार संहिता",
    description:
      "The Election Commission of India (ECI) announces the election schedule. The Model Code of Conduct (MCC) comes into effect immediately, restricting government actions and campaign activities.",
    icon: "Megaphone",
    duration: "4–6 weeks before first polling phase",
    keyDates: [
      "ECI press conference announcing schedule",
      "MCC effective from announcement date",
      "Last date for candidate nominations",
      "Scrutiny of nomination papers",
      "Withdrawal of candidature deadline",
    ],
    tips: [
      "Check voters.eci.gov.in for your constituency details",
      "Verify your name on the electoral roll immediately",
      "Download your e-EPIC from the NVSP portal",
      "MCC restricts new government schemes — report violations to ECI",
    ],
    officialLink: "https://www.eci.gov.in",
  },
  {
    id: "voter-registration",
    step: 2,
    title: "Voter Registration (EPIC)",
    titleHi: "मतदाता पंजीकरण (EPIC)",
    description:
      "Citizens aged 18+ must be registered on the Electoral Roll. Registration is done via Form 6 (new voters), Form 8 (correction/update), or Form 6B (overseas voters) on the NVSP portal or via your Booth Level Officer.",
    icon: "ClipboardList",
    duration: "Ongoing (rolls updated quarterly)",
    keyDates: [
      "Qualifying date for age 18: Jan 1, Apr 1, Jul 1, or Oct 1",
      "Summary revision of electoral rolls: Jan–Feb annually",
      "Special Summary Revision: Before general elections",
      "Deadline to apply before election varies by ECI notification",
    ],
    tips: [
      "Register online at voters.eci.gov.in using Form 6",
      "Use Form 8 to update address or correct details",
      "Check enrollment via voter search on NVSP portal",
      "Your EPIC or 11 alternative documents are valid polling booth ID",
      "Call Voter Helpline 1950 for assistance",
    ],
    officialLink: "https://voters.eci.gov.in",
  },
  {
    id: "nomination",
    step: 3,
    title: "Nomination & Candidate Filing",
    titleHi: "नामांकन और उम्मीदवारी",
    description:
      "Candidates file nomination papers with the Returning Officer. Papers are scrutinized for eligibility. The last date for withdrawal determines the final list of contestants.",
    icon: "FileSignature",
    duration: "~3 weeks after announcement",
    keyDates: [
      "Last date for filing nominations",
      "Date for scrutiny of nominations",
      "Last date for withdrawal of candidatures",
      "Final list of candidates published",
    ],
    tips: [
      "Candidates file Form 2A with the Returning Officer",
      "Security deposit: ₹25,000 for Lok Sabha, ₹12,500 for State Assembly",
      "Candidates must disclose criminal antecedents, assets & liabilities",
      "Check candidate affidavits on affidavit.eci.gov.in",
    ],
    officialLink: "https://affidavit.eci.gov.in",
  },
  {
    id: "campaign-period",
    step: 4,
    title: "Campaign Period",
    titleHi: "प्रचार अभियान",
    description:
      "Political parties and candidates campaign across constituencies under MCC governance. ECI deploys flying squads to monitor expenditure and violations. Campaign ends 48 hours before polling.",
    icon: "Mic2",
    duration: "2–4 weeks before polling",
    keyDates: [
      "Campaign begins after candidate list is finalized",
      "Expenditure limit: ₹95 lakh (Lok Sabha), ₹40 lakh (State)",
      "Election silence period: 48 hours before polling",
      "No exit polls until last phase polling ends",
    ],
    tips: [
      "Verify information from official party manifesto websites",
      "Use the cVIGIL app to report MCC violations",
      "Campaign expenditure is strictly monitored by ECI observers",
      "Paid news must be disclosed by candidates",
      "Report voter inducement to 1950",
    ],
    officialLink: "https://www.eci.gov.in/mcc",
  },
  {
    id: "silence-period",
    step: 5,
    title: "Election Silence Period",
    titleHi: "मतदान से पहले का मौन काल",
    description:
      "48 hours before polling, all public campaigning must stop. No rallies, public meetings, or campaign advertisements. This allows voters to make an independent, undisturbed decision.",
    icon: "VolumeX",
    duration: "48 hours before each polling phase",
    keyDates: [
      "Silence period begins exactly 48 hours before polling",
      "No political meetings or rallies allowed",
      "No social media campaign posts from candidates/parties",
      "Exit polls banned until all phases are complete",
    ],
    tips: [
      "Research your candidates before the silence period begins",
      "Check ECI's Candidate Information System for affidavits",
      "Know your polling booth location in advance",
      "Carry valid ID — EPIC or any of the 11 alternative documents",
    ],
    officialLink: "https://www.eci.gov.in",
  },
  {
    id: "polling-day",
    step: 6,
    title: "Polling Day",
    titleHi: "मतदान दिवस",
    description:
      "Voters cast ballots at designated polling booths using Electronic Voting Machines (EVMs). A VVPAT slip confirms your vote. India conducts phase-wise polling for Lok Sabha elections.",
    icon: "Vote",
    duration: "7 AM – 6 PM (varies by constituency)",
    keyDates: [
      "Polls open: 7 AM in most constituencies",
      "Polls close: 6 PM (some remote areas: 5 PM)",
      "Voters in queue at closing time must be allowed to vote",
      "Gazetted holiday for election day in your constituency",
    ],
    tips: [
      "Carry your EPIC or Aadhaar card as valid ID",
      "Check your booth number at voters.eci.gov.in before leaving",
      "Press the EVM button firmly — VVPAT slip will confirm your vote",
      "NOTA (None of the Above) is always available on the EVM",
      "Election ink on your left index finger prevents double voting",
      "Report malpractice to 1950 or cVIGIL app immediately",
    ],
    officialLink: "https://voters.eci.gov.in",
  },
  {
    id: "counting-day",
    step: 7,
    title: "Counting Day",
    titleHi: "मतगणना दिवस",
    description:
      "EVM results are counted at designated centers under strict security. Results are declared constituency by constituency. The ECI's official results portal provides real-time updates.",
    icon: "BarChart3",
    duration: "Counting begins at 8 AM (ECI announced date)",
    keyDates: [
      "Counting date announced by ECI with schedule",
      "Postal ballot counting precedes EVM counting",
      "Results declared constituency by constituency",
      "Candidates can request recount if margin is very close",
    ],
    tips: [
      "Follow live results on results.eci.gov.in",
      "Winning candidates must submit expenditure accounts within 30 days",
      "Unofficial trends are announced first; official results take time",
      "Candidates can request a recount for very close margins",
    ],
    officialLink: "https://results.eci.gov.in",
  },
  {
    id: "government-formation",
    step: 8,
    title: "Government Formation",
    titleHi: "सरकार का गठन",
    description:
      "After Lok Sabha results, the party or alliance with majority (272+ seats) is invited by the President to form government. The Prime Minister is sworn in, followed by the Council of Ministers.",
    icon: "Landmark",
    duration: "1–2 weeks after results",
    keyDates: [
      "President meets with leaders of winning parties",
      "Majority party/coalition leader claims PM post",
      "President invites PM-designate to form government",
      "Swearing-in ceremony at Rashtrapati Bhavan",
    ],
    tips: [
      "272 seats required for a simple majority in the 543-seat Lok Sabha",
      "President uses constitutional discretion if no clear majority",
      "Elected MPs take oath before Parliament's first session",
      "Speaker of Lok Sabha is elected in the first Parliament session",
    ],
    officialLink: "https://presidentofindia.gov.in",
  },
];

// --- How to Vote Steps ---
export const HOW_TO_VOTE_STEPS = [
  {
    id: "step-1-registration",
    step: 1,
    title: "Register to Vote",
    titleHi: "मतदाता पंजीकरण",
    description: "The first step to participating in democracy is ensuring your name is on the electoral roll.",
    icon: "ClipboardCheck",
    content: [
      "Check your eligibility: You must be an Indian citizen, 18+ years old, and a resident of your constituency.",
      "Apply online via Form 6 at voters.eci.gov.in or the Voter Helpline App.",
      "Submit documents: Photo, Proof of Age (Aadhaar/10th Marksheet), and Proof of Residence.",
      "Wait for verification by your Booth Level Officer (BLO).",
    ],
    officialLink: "https://voters.eci.gov.in",
    aiPrompt: "How do I register to vote in India and what documents are needed?",
  },
  {
    id: "step-2-verify",
    step: 2,
    title: "Verify Your Name",
    titleHi: "अपने नाम की पुष्टि करें",
    description: "Even if you have an EPIC card, your name must be in the current electoral roll to vote.",
    icon: "Search",
    content: [
      "Visit the ECI Electoral Search portal at voters.eci.gov.in.",
      "Search by Details (Name, DoB, State) or by EPIC Number.",
      "Confirm your Polling Station and Part Number.",
      "If your name is missing, file Form 6 immediately before the registration deadline.",
    ],
    officialLink: "https://voters.eci.gov.in/home/electoral-search",
    aiPrompt: "How can I check if my name is in the voter list for the 2026 elections?",
  },
  {
    id: "step-3-booth",
    step: 3,
    title: "Find Your Polling Booth",
    titleHi: "अपने मतदान केंद्र को खोजें",
    description: "Know exactly where to go on election day to avoid last-minute confusion.",
    icon: "MapPin",
    content: [
      "Use the 'Know Your Polling Station' tool on the ECI portal.",
      "Your Voter Information Slip (VIS) will also contain booth details and is usually distributed by BLOs.",
      "Booth locations are typically nearby schools, community centers, or government buildings.",
    ],
    officialLink: "https://voters.eci.gov.in/home/booth-search",
    aiPrompt: "How do I find my polling station for the Lok Sabha elections?",
  },
  {
    id: "step-4-id",
    step: 4,
    title: "Carry Valid ID",
    titleHi: "वैध पहचान पत्र साथ ले जाएं",
    description: "You must prove your identity at the polling station using one of the ECI-approved documents.",
    icon: "CreditCard",
    content: [
      "EPIC (Voter ID Card) is the primary document.",
      "If you don't have EPIC, use any of these 12 alternatives: Aadhaar Card, PAN Card, MNREGA Job Card, Passbook with photo, Health Insurance Smart Card, Driving License, Passport, Pension document, Service ID (Govt/PSU), Official ID (MPs/MLAs), Unique Disability ID (UDID).",
    ],
    officialLink: "https://www.eci.gov.in",
    aiPrompt: "Which IDs are accepted at the polling booth if I don't have a Voter ID card?",
  },
  {
    id: "step-5-polling",
    step: 5,
    title: "Inside the Polling Booth",
    titleHi: "मतदान केंद्र के भीतर",
    description: "Follow the 4-step official process inside the booth to cast your vote.",
    icon: "Vote",
    content: [
      "First Polling Officer: Checks your name in the voter list and ID document.",
      "Second Polling Officer: Marks your finger with indelible ink, gives a slip, and takes your signature/thumbprint.",
      "Third Polling Officer: Collects the slip and activates the EVM.",
      "Voting Compartment: Press the blue button on the EVM next to your candidate's name/symbol. Verify the VVPAT slip (visible for 7 seconds).",
    ],
    officialLink: "https://www.eci.gov.in",
    aiPrompt: "What is the step-by-step process inside an Indian polling booth?",
  },
  {
    id: "step-6-ink",
    step: 6,
    title: "Post-Vote: Proudly Wear the Ink",
    titleHi: "मतदान के बाद",
    description: "Your part in the democratic process is complete once you cast your vote.",
    icon: "Fingerprint",
    content: [
      "Ensure you have the indelible ink mark on your left forefinger.",
      "Photography and mobile phones are strictly prohibited inside the voting compartment.",
      "Collect any participation certificates if provided by your local booth.",
    ],
    officialLink: "https://www.eci.gov.in",
    aiPrompt: "Why is indelible ink used in Indian elections and what is its history?",
  },
] as const;

export const HOW_TO_VOTE_STEPS_METADATA = {
  title: "Step-by-Step Voting Guide",
  subtitle: "Everything you need to know from registration to the polling booth.",
  tagline: "Your vote is your voice. Make it count.",
};

// --- Suggested AI Chat Questions ---
export const SUGGESTED_QUESTIONS = [
  {
    id: "register-epic",
    text: "How do I register as a voter and get my EPIC card?",
    icon: "ClipboardList",
    category: "Registration",
  },
  {
    id: "lok-sabha",
    text: "What is the difference between Lok Sabha and Rajya Sabha?",
    icon: "Landmark",
    category: "How It Works",
  },
  {
    id: "evm-vvpat",
    text: "How do EVMs and VVPAT work in Indian elections?",
    icon: "Vote",
    category: "Polling Day",
  },
  {
    id: "voter-id",
    text: "Which documents are valid at the polling booth?",
    icon: "CreditCard",
    category: "Polling Day",
  },
  {
    id: "nota",
    text: "What is NOTA and when should I use it?",
    icon: "CircleSlash",
    category: "Voting Options",
  },
  {
    id: "mcc",
    text: "What is the Model Code of Conduct?",
    icon: "ScrollText",
    category: "Rules & Regulations",
  },
] as const;

// --- Navigation Items ---
export const NAV_ITEMS = [
  { href: "/", label: "Home", id: "nav-home" },
  { href: "/assistant", label: "AI Assistant", id: "nav-assistant" },
  { href: "/timeline", label: "Election Timeline", id: "nav-timeline" },
  { href: "/find-polling", label: "Find Polling Booth", id: "nav-polling" },
  { href: "/ballot", label: "Ballot Preview", id: "nav-ballot" },
  { href: "/how-to-vote", label: "How to Vote", id: "nav-how-to-vote" },
] as const;

// --- Feature Cards ---
export const FEATURES = [
  {
    id: "feature-ai-chat",
    icon: "BotMessageSquare",
    title: "AI Election Assistant",
    description:
      "Ask anything about Indian elections — voter registration, EVM, MCC, NOTA, or constituency rules — and get instant, non-partisan answers in your language.",
    color: "blue",
  },
  {
    id: "feature-timeline",
    icon: "CalendarRange",
    title: "Election Timeline",
    description:
      "Explore all 8 stages of India's election process — from ECI announcement and MCC to counting day and government formation.",
    color: "saffron",
  },
  {
    id: "feature-polling",
    icon: "MapPin",
    title: "Polling Booth Finder",
    description:
      "Find your polling booth, verify your voter details, and get directions — linked directly to ECI's official voter portal.",
    color: "blue",
  },
  {
    id: "feature-multilingual",
    icon: "Languages",
    title: "6 Indian Languages",
    description:
      "Available in English, Hindi, Tamil, Telugu, Bengali, and Marathi — so every voter can access information in their language.",
    color: "green",
  },
  {
    id: "feature-evm",
    icon: "Tablet",
    title: "Interactive EVM Preview",
    description:
      "Practice voting on a digital mockup of the Electronic Voting Machine (EVM) and learn how the VVPAT system confirms your vote.",
    color: "blue",
    href: "/ballot",
  },
  {
    id: "feature-accessible",
    icon: "Accessibility",
    title: "Fully Accessible",
    description:
      "WCAG 2.1 AA compliant — designed for screen readers, keyboard navigation, and all abilities.",
    color: "saffron",
  },
] as const;

// --- India Election Quick Stats ---
export const INDIA_STATS = [
  { value: "97", suffix: "Cr+", label: "Registered Voters", icon: "Users" },
  { value: "543", suffix: "", label: "Lok Sabha Seats", icon: "Landmark" },
  { value: "10.5", suffix: "L+", label: "Polling Booths", icon: "MapPin" },
  { value: "100", suffix: "%", label: "Non-Partisan AI", icon: "ShieldCheck" },
] as const;
