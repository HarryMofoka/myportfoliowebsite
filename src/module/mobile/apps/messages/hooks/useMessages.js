import { useState, useEffect, useRef, useCallback } from "react";
import { INITIAL_CONVERSATIONS } from "../data";

const useMessages = () => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("harry_portfolio_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((c) => c.messages && c.messages.length > 0)
        ) {
          return parsed.map((c) => {
            const match = INITIAL_CONVERSATIONS.find((init) => init.id === c.id);
            if (match) {
              return {
                ...c,
                name: match.name,
                avatar: match.avatar,
                initials: match.initials,
              };
            }
            return c;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CONVERSATIONS;
  });

  const [pinnedChats, setPinnedChats] = useState(() => {
    const saved = localStorage.getItem("harry_portfolio_pinned_messages");
    return saved ? JSON.parse(saved) : ["harry"];
  });

  const [activeCategory, setActiveCategory] = useState("all"); // "all", "unread", "muted"
  const [activeChatId, setActiveChatId] = useState("harry");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [mutedChats, setMutedChats] = useState({});
  const [callState, setCallState] = useState({
    isOpen: false,
    type: "audio",
    status: "ringing",
    micMuted: false,
    cameraOff: false,
  });
  const [callDuration, setCallDuration] = useState(0);
  const messagesEndRef = useRef(null);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  useEffect(() => {
    localStorage.setItem("harry_portfolio_messages", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("harry_portfolio_pinned_messages", JSON.stringify(pinnedChats));
  }, [pinnedChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isTyping]);

  useEffect(() => {
    if (activeChat?.unread) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeChat.id ? { ...c, unread: false } : c)),
      );
    }
  }, [activeChat]);

  const ringtoneRef = useRef(null);

  useEffect(() => {
    if (callState.isOpen && callState.status === "ringing") {
      if (!ringtoneRef.current) {
        ringtoneRef.current = new Audio("/system/audio/ringback.mp3");
        ringtoneRef.current.loop = true;
      }
      ringtoneRef.current
        .play()
        .catch((e) => console.error("Ringtone playback blocked/failed:", e));
    } else {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
    }
    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
      }
    };
  }, [callState.isOpen, callState.status]);

  useEffect(() => {
    let ringTimer;
    if (callState.isOpen && callState.status === "ringing") {
      ringTimer = setTimeout(() => {
        setCallState((prev) => ({ ...prev, status: "connected" }));
      }, 6000);
    }
    return () => clearTimeout(ringTimer);
  }, [callState.isOpen, callState.status]);

  useEffect(() => {
    let callTimer;
    if (callState.isOpen && callState.status === "connected") {
      callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(callTimer);
  }, [callState.isOpen, callState.status]);

  const triggerCall = useCallback((type) => {
    setCallState({ isOpen: true, type, status: "ringing", micMuted: false, cameraOff: false });
  }, []);

  const endCall = useCallback(() => {
    setCallState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const togglePinChat = useCallback((id) => {
    setPinnedChats((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  }, []);

  const addReaction = useCallback(
    (messageId, reaction) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeChat.id) {
            return {
              ...c,
              messages: c.messages.map((m) => {
                if (m.id === messageId) {
                  const currentReactions = m.reactions || [];
                  const nextReactions = currentReactions.includes(reaction)
                    ? currentReactions.filter((r) => r !== reaction)
                    : [...currentReactions, reaction];
                  return { ...m, reactions: nextReactions };
                }
                return m;
              }),
            };
          }
          return c;
        }),
      );
    },
    [activeChat],
  );

  const sendAttachment = useCallback(
    (type, value) => {
      const newMessage = {
        id: Date.now(),
        text: type === "photo" ? "📷 Sent a photo" : `🎨 Sticker: ${value}`,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        attachment: { type, value },
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChat.id ? { ...c, messages: [...c.messages, newMessage] } : c,
        ),
      );

      // Harry chatbot reply triggers
      if (activeChat.id === "harry") {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const replyMessage = {
            id: Date.now() + 1,
            text: type === "photo" ? "Clean shot! Thanks for sharing." : "Appreciate that sticker!",
            sender: "them",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setConversations((prev) =>
            prev.map((c) =>
              c.id === "harry" ? { ...c, messages: [...c.messages, replyMessage] } : c,
            ),
          );
        }, 1200);
      }
    },
    [activeChat],
  );

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [...c.messages, newMessage] } : c,
      ),
    );

    const userMsg = inputText.toLowerCase();
    setInputText("");

    const chatId = activeChat.id;
    if (chatId === "harry" || chatId === "nexlink") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        let replyText =
          "Appreciate you stopping by! Explore Finder, Terminal, or my CV in the Dock.";
        if (chatId === "harry") {
          if (
            userMsg.includes("project") ||
            userMsg.includes("build") ||
            userMsg.includes("work")
          ) {
            replyText =
              "Flagship builds include Fold (local-first PDF workspace), Word (USDT P2P accountability with 563 tests), TetherOS (44-route AI second brain), SimpleTerms (AI contract explainer), and Kalm-LMS (172 Python challenges).";
          } else if (
            userMsg.includes("story") ||
            userMsg.includes("journey") ||
            userMsg.includes("education")
          ) {
            replyText =
              "Started coding around age 10 with VB.NET after gaming on a Samsung Galaxy Pocket Neo. Studied at General Smuts HS, Sedibeng TVET College, and WeThinkCode_, and co-founded Nexlink Solutions ZA in 2025.";
          } else if (userMsg.includes("nexlink")) {
            replyText =
              "Nexlink Solutions ZA is our South African software venture building GlowLink, TapShare/Scanned QR+NFC cards, and AI ATS resume tools.";
          } else if (
            userMsg.includes("skill") ||
            userMsg.includes("tech") ||
            userMsg.includes("stack")
          ) {
            replyText =
              "TypeScript, JavaScript, Python, Java, React 19, Next.js, React Native / Expo, Node.js, Supabase, Prisma, Drizzle, and local-first AI architectures.";
          } else if (
            userMsg.includes("contact") ||
            userMsg.includes("mail") ||
            userMsg.includes("hire")
          ) {
            replyText =
              "Email me directly at mofokaharry@gmail.com or browse github.com/HarryMofoka!";
          } else if (
            userMsg.includes("hello") ||
            userMsg.includes("hi") ||
            userMsg.includes("hey") ||
            userMsg.includes("dumela")
          ) {
            replyText =
              "Dumela! Hope you're enjoying my macOS portfolio. Ask me about my builds, journey, or Nexlink!";
          }
        } else {
          replyText =
            "Thanks for messaging Nexlink Solutions ZA! Reach us at nexlinksolutionsza@gmail.com or visit nexlinksolutionsza.co.za.";
        }

        const replyMessage = {
          id: Date.now() + 1,
          text: replyText,
          sender: "them",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, replyMessage] } : c,
          ),
        );
      }, 1200);
    }
  }, [inputText, activeChat]);

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return {
    conversations,
    activeChat,
    activeChatId,
    setActiveChatId,
    inputText,
    setInputText,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    isTyping,
    showInfo,
    setShowInfo,
    mutedChats,
    setMutedChats,
    callState,
    callDuration,
    messagesEndRef,
    triggerCall,
    endCall,
    handleSend,
    filteredConversations,
    formatCallTime,
    setCallState,
    pinnedChats,
    togglePinChat,
    activeCategory,
    setActiveCategory,
    addReaction,
    sendAttachment,
  };
};

export default useMessages;
