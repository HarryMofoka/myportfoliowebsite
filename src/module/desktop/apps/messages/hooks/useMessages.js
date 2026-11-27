import { useState, useEffect, useRef, useCallback } from "react";
import { INITIAL_CONVERSATIONS } from "../data/messagesData";

const useMessages = () => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("harry_portfolio_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return INITIAL_CONVERSATIONS.map((initial) => {
          const savedConv = parsed.find((c) => c.id === initial.id);
          if (savedConv) {
            return {
              ...initial,
              messages: savedConv.messages || initial.messages,
              unread: savedConv.unread !== undefined ? savedConv.unread : initial.unread,
            };
          }
          return initial;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CONVERSATIONS;
  });

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
        let replyText = "";

        if (chatId === "harry") {
          replyText =
            "Appreciate you stopping by! Check out Finder, Terminal, or my CV in the Dock to explore more of what I'm building.";
          if (
            userMsg.includes("project") ||
            userMsg.includes("build") ||
            userMsg.includes("work")
          ) {
            replyText =
              "Some of my flagship builds include Fold (zero-cloud local PDF workspace), Word (USDT P2P accountability app with 563 Vitest tests), TetherOS (offline-first AI second brain across 44 routes), SimpleTerms (AI contract explainer), and Kalm-LMS (172 Python challenges). Open Finder to explore them!";
          } else if (
            userMsg.includes("story") ||
            userMsg.includes("journey") ||
            userMsg.includes("education") ||
            userMsg.includes("about")
          ) {
            replyText =
              "I realized I wanted to build software around age 10 — sparked by gaming, a Samsung Galaxy Pocket Neo, and my first VB.NET two-number adder. My path took me through General Smuts High School, Sedibeng TVET College (paused due to financial constraints, never stopped building), and WeThinkCode_!";
          } else if (
            userMsg.includes("nexlink") ||
            userMsg.includes("startup") ||
            userMsg.includes("company")
          ) {
            replyText =
              "I co-founded Nexlink Solutions ZA in 2025 to build practical digital products in South Africa — including GlowLink (beauty marketplace), TapShare/Scanned (QR + NFC digital business cards), and AI ATS resume tools.";
          } else if (
            userMsg.includes("skill") ||
            userMsg.includes("tech") ||
            userMsg.includes("stack")
          ) {
            replyText =
              "My core stack spans TypeScript, JavaScript, Python, Java, React 19, Next.js, React Native / Expo, Node.js, Supabase, Prisma, Drizzle, and AI / local-first architectures. Type 'techstack' in Terminal for the full breakdown!";
          } else if (
            userMsg.includes("contact") ||
            userMsg.includes("mail") ||
            userMsg.includes("hire") ||
            userMsg.includes("cv") ||
            userMsg.includes("resume")
          ) {
            replyText =
              "You can reach me directly at mofokaharry@gmail.com, view my GitHub at github.com/HarryMofoka, or open my Resume app right here in the Dock!";
          } else if (
            userMsg.includes("hello") ||
            userMsg.includes("hi") ||
            userMsg.includes("hey") ||
            userMsg.includes("dumela")
          ) {
            replyText =
              "Dumela! Great to meet you. I'm Harry Koena Mofoka from Gauteng, South Africa — what would you like to know about my work or journey?";
          }
        } else if (chatId === "nexlink") {
          replyText =
            "Thanks for messaging Nexlink Solutions ZA! Reach our team at nexlinksolutionsza@gmail.com or visit nexlinksolutionsza.co.za.";
          if (
            userMsg.includes("project") ||
            userMsg.includes("product") ||
            userMsg.includes("service")
          ) {
            replyText =
              "Nexlink Solutions ZA builds web applications, mobile apps, business dashboards, and AI products — including GlowLink, TapShare/Scanned, and our AI ATS Resume Analyzer.";
          } else if (
            userMsg.includes("contact") ||
            userMsg.includes("quote") ||
            userMsg.includes("hire")
          ) {
            replyText =
              "Let's bring your digital product to life! Email us at nexlinksolutionsza@gmail.com or connect with co-founder Harry Mofoka at mofokaharry@gmail.com.";
          } else if (
            userMsg.includes("hello") ||
            userMsg.includes("hi") ||
            userMsg.includes("hey")
          ) {
            replyText =
              "Hello from Nexlink Solutions ZA! Ask us about our products, web/mobile development, or AI solutions.";
          }
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
  };
};

export default useMessages;
