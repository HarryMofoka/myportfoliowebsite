import {
  PROJECT_1_URL,
  PROJECT_1_GITHUB,
  PROJECT_2_URL,
  PROJECT_2_GITHUB,
  PROJECT_3_URL,
  PROJECT_3_GITHUB,
  PROJECT_4_URL,
  PROJECT_4_GITHUB,
  PROJECT_5_URL,
  PROJECT_5_GITHUB,
  PROJECT_6_URL,
  PROJECT_6_GITHUB,
  PROJECT_7_URL,
  PROJECT_7_GITHUB,
  PROJECT_8_URL,
  PROJECT_8_GITHUB,
  TAPSHARE_MOBILE_GITHUB,
  ANYRESUME_GITHUB,
  KALM_LMS_GITHUB,
  GLOWLINK_GITHUB,
  AI_RESUME_ANALYZER_URL,
} from "./env";

export const projects = [
  {
    id: 1,
    title: "Fold",
    description:
      "A privacy-first, zero-cloud local PDF workspace built with React 19, TypeScript, pdf-lib, Tesseract.js OCR, and Tauri — keeping your documents 100% on-device.",
    image: "/projects/desktop/fold.png",
    link: PROJECT_1_URL,
    github: PROJECT_1_GITHUB,
  },
  {
    id: 2,
    title: "Word",
    description:
      "A trust-first, self-custodial USDT peer-to-peer payment & bilateral accountability platform using Tether WDK, EIP-712 co-signing, Supabase RLS, 14 Edge Functions, and 563 automated Vitest tests.",
    image: "/projects/desktop/word.png",
    link: PROJECT_2_URL,
    github: PROJECT_2_GITHUB,
  },
  {
    id: 3,
    title: "TetherOS",
    description:
      "An offline-first personal second brain and AI accountability companion built with Next.js 16, TypeScript, Prisma, and Supabase SSR across 44 hardened routes.",
    image: "/projects/desktop/tetheros.png",
    link: PROJECT_3_URL,
    github: PROJECT_3_GITHUB,
  },
  {
    id: 4,
    title: "SimpleTerms",
    description:
      "Full-stack AI contract explainer powered by React, TypeScript, Express, and Google Gemini that transforms PDF/DOCX legal agreements into plain-English risk reports.",
    image: "/projects/desktop/simpleterms.png",
    link: PROJECT_4_URL,
    github: PROJECT_4_GITHUB,
  },
  {
    id: 5,
    title: "Little Stars Preschool",
    description:
      "Full-featured Early Childhood Development (ECD) creche website and LMS dashboard with Next.js 15, React 19, role-based onboarding, attendance, Recharts financial insights, and jsPDF exports.",
    image: "/projects/desktop/littlestars.png",
    link: PROJECT_5_URL,
    github: PROJECT_5_GITHUB,
  },
  {
    id: 6,
    title: "TinyHabits",
    description:
      "Adaptive habit-tracking coach that dynamically scales daily goals based on real performance and streaks using React, TypeScript, Tailwind CSS, and shadcn/ui.",
    image: "/projects/desktop/tinyhabits.png",
    link: PROJECT_6_URL,
    github: PROJECT_6_GITHUB,
  },
  {
    id: 7,
    title: "VeloriQ",
    description:
      "Interactive 3D luxury smartwatch configurator and scroll-driven e-commerce showcase powered by Three.js, React Three Fiber, GSAP, and Lenis.",
    image: "/projects/desktop/veloriq.png",
    link: PROJECT_7_URL,
    github: PROJECT_7_GITHUB,
  },
  {
    id: 8,
    title: "BioNex LIMS",
    description:
      "Laboratory Information Management System concept for streamlining reagent inventory, sample locations, and compliance tracking.",
    image: "/projects/desktop/bionex.png",
    link: PROJECT_8_URL,
    github: PROJECT_8_GITHUB,
  },
];

export const additionalExperiments = [
  {
    title: "TapShare / Scanned",
    description:
      "Offline-first QR & NFC digital business card (Next.js + Upstash Redis web & Expo React Native + NFC Manager vCard 3.0 mobile app).",
    github: TAPSHARE_MOBILE_GITHUB,
  },
  {
    title: "anyResume-AI & AI Resume Analyzer",
    description:
      "AI-powered ATS resume builder & analyzer using Next.js 16, Vercel AI SDK (Anthropic, Google, OpenAI), Drizzle ORM, and multi-format PDF/DOCX export.",
    link: AI_RESUME_ANALYZER_URL,
    github: ANYRESUME_GITHUB,
  },
  {
    title: "Kalm-LMS",
    description:
      "Zero-dependency progressive Python mastery curriculum with 172 hands-on challenges, 20 master systems projects, 20 legacy refactoring rescues, and 51 unittest suites.",
    github: KALM_LMS_GITHUB,
  },
  {
    title: "GlowLink (Nexlink Solutions ZA)",
    description:
      "South African beauty services marketplace connecting clients with beauty professionals, featuring discovery search, service categories, and ratings & reviews.",
    github: GLOWLINK_GITHUB,
  },
];
