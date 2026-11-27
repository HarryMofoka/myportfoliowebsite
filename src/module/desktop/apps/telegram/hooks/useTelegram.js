import { useState, useEffect, useRef } from "react";
import { INITIAL_CHATS } from "../data/telegramData";

const useTelegram = () => {
  const [chats, setChats] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("harry_portfolio_telegram");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((savedChat) => {
            const initialChat = INITIAL_CHATS.find((c) => c.id === savedChat.id);
            if (initialChat) {
              return {
                ...initialChat,
                messages: savedChat.messages,
                status: savedChat.status || initialChat.status,
              };
            }
            return savedChat;
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_CHATS;
  });

  const [activeChatId, setActiveChatId] = useState("bot");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState("menu");

  const [userProfile, setUserProfile] = useState({
    name: "Harry Koena Mofoka",
    username: "@HarryMofoka",
    bio: "Software Developer · Product Builder · Co-founder at Nexlink Solutions ZA. A builder at heart, with heart, for the heart of it.",
    phone: "+27 •• ••• ••••",
  });

  const [newGroupName, setNewGroupName] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelBio, setNewChannelBio] = useState("");
  const [chatThemeColor, setChatThemeColor] = useState("blue");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("harry_portfolio_telegram", JSON.stringify(chats));
    }
  }, [chats]);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentNode;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [activeChat?.messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessageText = inputText;
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsgObj = {
      id: Date.now(),
      text: userMessageText,
      sender: "me",
      time: timeString,
      status: "sent",
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [...c.messages, userMsgObj] } : c,
      ),
    );
    setInputText("");

    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === userMsgObj.id ? { ...m, status: "read" } : m,
                ),
              }
            : c,
        ),
      );
    }, 800);

    if (activeChat.id === "bot") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        let reply = "I'm not sure how to process that command. Type `/help` to see what I can do!";
        const cmd = userMessageText.toLowerCase().trim();

        if (cmd.includes("/start")) {
          reply =
            "Dumela! I am Harry's Portfolio Assistant. Type `/projects`, `/skills`, `/story`, `/nexlink`, or `/contact` to explore.";
        } else if (cmd.includes("/project")) {
          reply =
            "Flagship Builds:\n1. **Fold**: Privacy-first zero-cloud PDF workspace (React 19, pdf-lib, Tesseract.js OCR, Tauri).\n2. **Word**: Self-custodial USDT P2P & accountability app (563 Vitest tests, EIP-712, Supabase RLS).\n3. **TetherOS**: Offline-first AI second brain across 44 hardened Next.js 16 routes.\n4. **SimpleTerms**: AI legal contract explainer powered by Google Gemini.\n5. **Kalm-LMS**: 172 Python mastery challenges & 51 unittest suites.";
        } else if (cmd.includes("/skill") || cmd.includes("/tech")) {
          reply =
            "Core Stack:\n• **Languages**: TypeScript, JavaScript, Python, Java, VB.NET, SQL\n• **Frontend & Mobile**: React 19, Next.js, React Native, Expo, Tailwind CSS, Three.js\n• **Backend & Data**: Node.js, Express, Supabase, PostgreSQL, Prisma, Drizzle ORM\n• **AI & Privacy**: Vercel AI SDK, Gemini API, Local-First & Offline-First";
        } else if (cmd.includes("/story") || cmd.includes("/journey")) {
          reply =
            "Harry's Journey:\n• Age ~10: Inspired by gaming & a Samsung Galaxy Pocket Neo -> first VB.NET two-number adder.\n• General Smuts HS (Matric) -> Sedibeng TVET College (NCV L3 IT, paused by finances, kept self-teaching).\n• WeThinkCode_ SEF, SE Prospect Programme & Generative AI + Anthropic AI Fluency.\n• Co-founded Nexlink Solutions ZA (2025 – Present).";
        } else if (cmd.includes("/nexlink")) {
          reply =
            "Nexlink Solutions ZA (2025 – Present):\n• Co-founded by Harry Koena Mofoka\n• Products: GlowLink beauty marketplace, TapShare/Scanned QR+NFC cards, AI ATS Resume tools\n• Web: nexlinksolutionsza.co.za | Email: nexlinksolutionsza@gmail.com";
        } else if (cmd.includes("/contact")) {
          reply =
            "Get in touch:\n• Email: mofokaharry@gmail.com\n• GitHub: github.com/HarryMofoka\n• LinkedIn: linkedin.com/in/harry-mofoka\n• Instagram: @kalm.harry\n• Location: Gauteng, South Africa";
        } else if (cmd.includes("/help")) {
          reply =
            "Available Commands:\n• `/start` - Start helper\n• `/projects` - Flagship builds\n• `/skills` - Technical stack\n• `/story` - Harry's journey\n• `/nexlink` - Nexlink Solutions ZA\n• `/contact` - Direct emails & socials";
        }

        setChats((prev) =>
          prev.map((c) =>
            c.id === "bot"
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: Date.now() + 1,
                      text: reply,
                      sender: "them",
                      time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      status: "read",
                    },
                  ],
                }
              : c,
          ),
        );
      }, 1500);
    } else if (activeChat.id === "harry" || activeChat.id === "nexlink") {
      const targetId = activeChat.id;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const normalized = userMessageText.toLowerCase();
        let reply =
          targetId === "harry"
            ? "Appreciate the message! I'll follow up as soon as I step back to my desk. Feel free to email mofokaharry@gmail.com anytime."
            : "Thanks for reaching out to Nexlink Solutions ZA! Email nexlinksolutionsza@gmail.com for web, mobile, or AI collaborations.";

        if (
          normalized.includes("hello") ||
          normalized.includes("hi") ||
          normalized.includes("hey") ||
          normalized.includes("dumela")
        ) {
          reply =
            targetId === "harry"
              ? "Dumela! Hope you're enjoying the macOS portfolio. What are you building lately?"
              : "Hello from Nexlink Solutions ZA! Let us know how we can help build your product.";
        } else if (
          normalized.includes("hiring") ||
          normalized.includes("job") ||
          normalized.includes("work") ||
          normalized.includes("collab")
        ) {
          reply =
            "Always open to meaningful engineering roles, product collaborations, and Nexlink Solutions ZA projects! Reach me at mofokaharry@gmail.com.";
        }

        setChats((prev) =>
          prev.map((c) =>
            c.id === targetId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: Date.now() + 2,
                      text: reply,
                      sender: "them",
                      time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      status: "read",
                    },
                  ],
                }
              : c,
          ),
        );
      }, 1800);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newChatObj = {
      id: `group_${Date.now()}`,
      name: newGroupName,
      type: "group",
      avatarColor: "bg-gradient-to-tr from-yellow-500 to-amber-600",
      initials: newGroupName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      status: "1 member",
      username: `@${newGroupName.toLowerCase().replace(/ /g, "_")}`,
      bio: "A custom group created by user.",
      phone: "None",
      messages: [
        {
          id: 1,
          text: `Group "${newGroupName}" has been successfully created.`,
          sender: "them",
          time: "Just now",
          status: "read",
          senderName: "System",
        },
      ],
    };
    setChats((prev) => [newChatObj, ...prev]);
    setActiveChatId(newChatObj.id);
    setNewGroupName("");
    setIsDrawerOpen(false);
  };

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return;
    const newChatObj = {
      id: `channel_${Date.now()}`,
      name: newChannelName,
      type: "channel",
      avatarColor: "bg-gradient-to-tr from-rose-500 to-red-600",
      initials: newChannelName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      status: "0 subscribers",
      username: `@${newChannelName.toLowerCase().replace(/ /g, "_")}`,
      bio: newChannelBio || "A custom broadcast channel created by user.",
      phone: "None",
      messages: [
        {
          id: 1,
          text: `Channel "${newChannelName}" broadcast stream created.`,
          sender: "channel",
          time: "Just now",
          status: "read",
        },
      ],
    };
    setChats((prev) => [newChatObj, ...prev]);
    setActiveChatId(newChatObj.id);
    setNewChannelName("");
    setNewChannelBio("");
    setIsDrawerOpen(false);
  };

  const openSavedMessages = () => {
    const hasSaved = chats.some((c) => c.id === "saved");
    if (!hasSaved) {
      const savedChat = {
        id: "saved",
        name: "Saved Messages",
        type: "user",
        avatarColor: "bg-gradient-to-tr from-blue-600 to-sky-700",
        initials: "🔖",
        status: "personal cloud storage",
        username: "@my_cloud",
        bio: "Forward messages here to save them. Send media files or notes to store them.",
        phone: "None",
        messages: [
          {
            id: 1,
            text: "Welcome to your personal cloud chat! Write ideas, copy logs, or save clips here.",
            sender: "them",
            time: "Just now",
            status: "read",
          },
        ],
      };
      setChats((prev) => [savedChat, ...prev]);
    }
    setActiveChatId("saved");
    setIsDrawerOpen(false);
  };

  const filteredChats = chats.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getThemeClass = (isMe) => {
    if (!isMe) {
      return nightMode
        ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80"
        : "bg-white text-gray-800 border border-zinc-200/50";
    }
    switch (chatThemeColor) {
      case "green":
        return "bg-emerald-500 text-white border border-emerald-600";
      case "purple":
        return "bg-purple-500 text-white border border-purple-600";
      case "orange":
        return "bg-orange-500 text-white border border-orange-600";
      case "blue":
      default:
        return nightMode
          ? "bg-sky-950 text-white border border-sky-900"
          : "bg-[#eef5fd] text-gray-900 border border-blue-100";
    }
  };

  return {
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    inputText,
    setInputText,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    isTyping,
    showProfileDrawer,
    setShowProfileDrawer,
    nightMode,
    setNightMode,
    isDrawerOpen,
    setIsDrawerOpen,
    drawerSection,
    setDrawerSection,
    userProfile,
    setUserProfile,
    newGroupName,
    setNewGroupName,
    newChannelName,
    setNewChannelName,
    newChannelBio,
    setNewChannelBio,
    chatThemeColor,
    setChatThemeColor,
    messagesEndRef,
    activeChat,
    handleSend,
    handleCreateGroup,
    handleCreateChannel,
    openSavedMessages,
    filteredChats,
    getThemeClass,
  };
};

export default useTelegram;
