import { useState, useEffect } from "react";

const defaultFolders = [
  { id: "all", name: "All Notes" },
  { id: "notes", name: "Notes" },
  { id: "quick", name: "Quick Notes" },
];

const defaultNotes = [
  {
    id: "1",
    folderId: "notes",
    title: "Builder's Manifesto",
    preview:
      "A builder at heart, with heart, for the heart of it — from a Galaxy Pocket Neo and VB.NET at age 10 to shipping real software.",
    body: "<div><strong>Builder's Manifesto</strong></div><div><br></div><div><em>&ldquo;A builder at heart, with heart, for the heart of it.&rdquo;</em></div><div><br></div><div>My fascination with building started with architecture and civil engineering before gaming and the Samsung Galaxy Pocket Neo pulled me into the digital world around age 10.</div><div><br></div><div>My first real coding project was a Visual Basic .NET Windows app that summed two numbers. Since then, I've never stopped wanting to turn imagination into working products.</div>",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    folderId: "notes",
    title: "Nexlink Solutions ZA — Product Lab",
    preview:
      "Co-founded in 2025 in South Africa to build practical web, mobile, and AI-powered digital products.",
    body: "<div><strong>Nexlink Solutions ZA — Product Lab</strong></div><div><br></div><div>Co-founder &amp; Software Developer (2025 – Present)</div><div><br></div><ul><li><strong>GlowLink</strong> — South African beauty marketplace connecting clients and service providers</li><li><strong>TapShare / Scanned</strong> — Offline-first QR &amp; NFC vCard 3.0 digital business card experience (Next.js + Expo React Native)</li><li><strong>AI ATS Resume Builder &amp; Analyzer</strong> — Accessible AI tooling to help job seekers craft stronger resumes</li></ul>",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    folderId: "quick",
    title: "GitHub Engineering Notes",
    preview:
      "41+ public repositories exploring privacy-first, offline-first, AI-native, and rigorously tested software.",
    body: "<div><strong>GitHub Engineering Notes</strong></div><div><br></div><ul><li><strong>Fold</strong> (foldpdf.vercel.app) — Zero-cloud local PDF workspace using React 19, pdf-lib, Tesseract.js OCR &amp; Tauri</li><li><strong>Word</strong> — Self-custodial USDT P2P accountability platform with EIP-712 co-signing, Supabase RLS, 14 Edge Functions &amp; 563 Vitest tests</li><li><strong>TetherOS</strong> — Offline-first AI second brain across 44 hardened Next.js 16 routes with rate limiting &amp; security headers</li><li><strong>Kalm-LMS</strong> — 172 progressive Python mastery challenges &amp; 51 automated unittest suites</li></ul>",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    folderId: "notes",
    title: "Education & Resilience",
    preview:
      "General Smuts HS, Sedibeng TVET College, WeThinkCode_, Anthropic AI Fluency, and continuous self-learning.",
    body: "<div><strong>Education &amp; Resilience</strong></div><div><br></div><ul><li><strong>General Smuts High School (2017–2021)</strong> — Matric qualification</li><li><strong>Sedibeng TVET College (2022–2025)</strong> — NCV Level 3 IT studies (paused due to financial constraints, but never stopped building)</li><li><strong>WeThinkCode_</strong> — Social Employment Fund (Digital Inclusion &amp; Work Readiness), Software Engineer Prospect Programme &amp; Generative AI course</li><li><strong>Anthropic</strong> — AI Fluency for Students</li></ul><div><br></div><div>Still in the process of becoming the developer I imagined being at age 10.</div>",
    updatedAt: new Date().toISOString(),
  },
];

export default function useNotes() {
  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem("harry_portfolio_note_folders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultFolders;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("harry_portfolio_notes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultNotes;
  });

  const [activeFolderId, setActiveFolderId] = useState("all");
  const [activeNoteId, setActiveNoteId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("harry_portfolio_note_folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem("harry_portfolio_notes", JSON.stringify(notes));
  }, [notes]);

  const stripHtml = (html) => {
    if (!html) return "";
    const clean = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Decode common entities
    return clean
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  };

  const parseNoteTitleAndBody = (html) => {
    if (!html) return { title: "New Note", preview: "No additional text" };

    // Replace common block tags with newlines to split correctly
    let text = html
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]*>/g, ""); // Strip all tags

    // Decode entities
    text = text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const title = lines[0] || "New Note";
    const preview = lines.slice(1).join(" ").trim() || "No additional text";
    return { title, preview };
  };

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleUpdateNote = (field, value) => {
    if (!activeNote) return;

    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === activeNote.id) {
          const updated = {
            ...note,
            [field]: value,
            updatedAt: new Date().toISOString(),
          };
          if (field === "body") {
            const { title, preview } = parseNoteTitleAndBody(value);
            updated.title = title;
            updated.preview = preview;
          }
          return updated;
        }
        return note;
      });
    });
  };

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now().toString(),
      folderId: activeFolderId === "all" ? "notes" : activeFolderId,
      title: "New Note",
      preview: "Start writing...",
      body: "<div><strong>New Note</strong></div><div>Start writing...</div>",
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) {
      const remainingFiltered = newNotes.filter(
        (n) => activeFolderId === "all" || n.folderId === activeFolderId,
      );
      setActiveNoteId(remainingFiltered[0]?.id || "");
    }
  };

  const handleCreateFolder = (name) => {
    if (!name.trim()) return;
    const newFolder = {
      id: Date.now().toString(),
      name: name.trim(),
    };
    setFolders((prev) => [...prev, newFolder]);
    setActiveFolderId(newFolder.id);
  };

  const handleDeleteFolder = (folderId) => {
    if (folderId === "all" || folderId === "notes" || folderId === "quick") return;
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    // Move notes in deleted folder to general "notes"
    setNotes((prev) =>
      prev.map((n) => (n.folderId === folderId ? { ...n, folderId: "notes" } : n)),
    );
    setActiveFolderId("all");
  };

  const getFilteredNotes = () => {
    let result = notes;
    if (activeFolderId !== "all") {
      result = notes.filter((n) => n.folderId === activeFolderId);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          stripHtml(note.body).toLowerCase().includes(query),
      );
    }
    return result;
  };

  const filteredNotes = getFilteredNotes();

  const formatDate = (isoStr) => {
    const date = new Date(isoStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Get counts for sidebar folder listing
  const getFolderCount = (folderId) => {
    if (folderId === "all") return notes.length;
    return notes.filter((n) => n.folderId === folderId).length;
  };

  return {
    notes,
    folders,
    activeFolderId,
    activeNote,
    activeNoteId,
    searchQuery,
    isSidebarOpen,
    setActiveFolderId,
    setActiveNoteId,
    setSearchQuery,
    setIsSidebarOpen,
    handleUpdateNote,
    handleCreateNote,
    handleDeleteNote,
    handleCreateFolder,
    handleDeleteFolder,
    filteredNotes,
    formatDate,
    getFolderCount,
    stripHtml,
  };
}
