export const INITIAL_FILES = {
  "src/App.jsx": `import React from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import AboutMe from './components/AboutMe';

export default function Portfolio() {
  return (
    <div className="portfolio min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full py-4 border-b border-zinc-900 bg-[#0a0a0a]/80 backdrop-blur-md px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-sm tracking-tight text-white uppercase">Harry Koena Mofoka</span>
        </div>
        <nav className="flex gap-6 text-xs font-semibold text-zinc-400">
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#about" className="hover:text-white transition-colors">Story</a>
          <a href="#contact" className="hover:text-white transition-colors">Connect</a>
        </nav>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-24">
        <Hero />
        <Projects />
        <AboutMe />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900 text-center text-xs text-zinc-500">
        <p>© 2026 Harry Koena Mofoka · Nexlink Solutions ZA · Built in South Africa.</p>
      </footer>
    </div>
  );
}`,
  "src/components/Hero.jsx": `import React from 'react';

export default function Hero() {
  return (
    <section className="py-12 space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
        Software Developer · Product Builder · Co-founder
      </div>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
        A builder at heart, with heart, for the heart of it.
      </h1>
      <p className="text-base text-zinc-400 leading-relaxed max-w-2xl">
        I am <span className="text-white font-medium">Harry Koena Mofoka</span>, a self-taught
        software developer and co-founder of <span className="text-white font-medium">Nexlink Solutions ZA</span>.
        I build local-first, offline-ready, and AI-powered web and mobile products from Gauteng, South Africa.
      </p>
      <div className="flex flex-wrap gap-4 pt-2">
        <a
          href="https://github.com/HarryMofoka"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
        >
          Explore GitHub (41+ Repos)
        </a>
        <a
          href="mailto:mofokaharry@gmail.com"
          className="px-5 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-bold transition-all active:scale-95"
        >
          Send Email
        </a>
      </div>
    </section>
  );
}`,
  "src/components/Projects.jsx": `import React from 'react';

const SELECTED_PROJECTS = [
  {
    title: "FOLD",
    desc: "Privacy-first, zero-cloud local PDF workspace with client-side OCR, editing, and Tauri desktop packaging.",
    tech: ["React 19", "TypeScript", "pdf-lib", "Tesseract.js", "Tauri"],
    badge: "Local-First"
  },
  {
    title: "WORD",
    desc: "Self-custodial USDT peer-to-peer payment & bilateral accountability platform backed by 563 Vitest tests.",
    tech: ["TypeScript", "Tether WDK", "EIP-712", "Supabase RLS", "Vitest"],
    badge: "563 Tests"
  },
  {
    title: "TETHEROS",
    desc: "Offline-first personal second brain and AI accountability companion across 44 hardened Next.js routes.",
    tech: ["Next.js 16", "Prisma", "Supabase SSR", "Rate Limiting"],
    badge: "44 Routes"
  },
  {
    title: "SIMPLETERMS",
    desc: "Full-stack AI legal contract explainer that turns PDF/DOCX agreements into clear risk reports.",
    tech: ["React", "TypeScript", "Express", "Google Gemini"],
    badge: "AI-Native"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Selected Builds</h2>
        <p className="text-xs text-zinc-500 mt-1">Products shaped by curiosity, local-first architecture, and practical impact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SELECTED_PROJECTS.map((p, i) => (
          <div key={i} className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-zinc-700 transition-colors duration-300 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-extrabold text-white tracking-widest uppercase">{p.title}</h3>
              <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-emerald-400 px-2 py-0.5 rounded font-semibold">{p.badge}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed min-h-[40px]">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.tech.map((t, idx) => (
                <span key={idx} className="text-[9px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded border border-zinc-800/50">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}`,
  "src/components/AboutMe.jsx": `import React from 'react';

export default function AboutMe() {
  return (
    <section id="about" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-zinc-900">
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Learning Path</h3>
        <h4 className="text-sm font-bold text-white uppercase">WeThinkCode_ & Self-Taught</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          From my first VB.NET calculator at age 10 to Sedibeng TVET College (NCV L3 IT), WeThinkCode_ SEF & SE Prospect programmes, and Anthropic AI Fluency.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Venture</h3>
        <h4 className="text-sm font-bold text-white uppercase">Nexlink Solutions ZA</h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Co-founder & Software Developer (2025–Present) building GlowLink, TapShare/Scanned QR+NFC cards, and AI ATS resume tools.
        </p>
      </div>

      <div className="space-y-3" id="contact">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Connect</h3>
        <h4 className="text-sm font-bold text-white uppercase">Let's Build Together</h4>
        <div className="flex flex-col gap-2 pt-1">
          <a href="https://github.com/HarryMofoka" target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5">
            GitHub /HarryMofoka
          </a>
          <a href="https://www.linkedin.com/in/harry-mofoka" target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5">
            LinkedIn /in/harry-mofoka
          </a>
          <a href="https://www.instagram.com/kalm.harry/" target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5">
            Instagram @kalm.harry
          </a>
        </div>
      </div>
    </section>
  );
}`,
  "src/index.css": `:root {
  --primary: #10b981;
  --background: #0a0a0a;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, sans-serif;
  background-color: var(--background);
  color: #f3f3f3;
}`,
  "tailwind.config.js": `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        vscode: "#007acc"
      }
    }
  },
  plugins: [],
}`,
  "package.json": `{
  "name": "harry-mofoka-portfolio",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "react": "^19.2.0",
    "next": "^16.1.6",
    "tailwindcss": "^4.1.17",
    "lucide-react": "^0.556.0"
  }
}`,
  "jsconfig.json": `{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"]
    }
  }
}`,
  ".env": `GROQ_API_KEY=gsk_mock_key_local_dev
PORT=3000
NODE_ENV=development`,
  "README.md": `# Harry Koena Mofoka — macOS Portfolio

"A builder at heart, with heart, for the heart of it."

Personal interactive desktop & mobile portfolio built with Next.js 16, React 19, and Tailwind CSS — showcasing my software builds, Nexlink Solutions ZA products, engineering journey, and ATS-ready CV.

## Flagship Builds
- **Fold** — Privacy-first local PDF workspace (https://foldpdf.vercel.app)
- **Word** — Self-custodial USDT P2P payments & bilateral accountability (563 Vitest tests)
- **TetherOS** — Offline-first second brain & AI companion (44 Next.js routes)
- **SimpleTerms** — Full-stack AI legal contract explainer (Google Gemini)
- **Kalm-LMS** — 172 progressive Python challenges & 51 unittest suites

## Run Locally
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
};

export const extensionsList = [
  {
    name: "GitHub Copilot",
    desc: "Your AI pair programmer",
    publisher: "GitHub",
    version: "v1.254",
  },
  { name: "Prettier", desc: "Opinionated code formatter", publisher: "Prettier", version: "v10.2" },
  {
    name: "Tailwind CSS IntelliSense",
    desc: "Intelligent Tailwind CSS tooling",
    publisher: "Tailwind Labs",
    version: "v0.11",
  },
  {
    name: "GitLens",
    desc: "Supercharge Git within VS Code",
    publisher: "GitKraken",
    version: "v15.0",
  },
  {
    name: "ESLint",
    desc: "Integrates ESLint into VS Code",
    publisher: "Microsoft",
    version: "v2.4",
  },
  {
    name: "Python",
    desc: "IntelliSense, linting & unittest for Python",
    publisher: "Microsoft",
    version: "v2026.2",
  },
];
