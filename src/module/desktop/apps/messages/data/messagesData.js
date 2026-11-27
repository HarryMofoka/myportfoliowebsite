import { GITHUB_PROFILE, NEXLINK_GITHUB, EMAIL, NEXLINK_EMAIL } from "@constants";

export const INITIAL_CONVERSATIONS = [
  {
    id: "harry",
    name: "Harry Mofoka",
    avatar: "/contacts/avatars/harry.jpg",
    avatarColor: "bg-gradient-to-tr from-emerald-500 to-teal-600",
    initials: "HM",
    unread: true,
    email: EMAIL,
    github: GITHUB_PROFILE,
    messages: [
      {
        id: 1,
        text: "Dumela! Welcome to my macOS portfolio.",
        sender: "them",
        time: "10:00 AM",
      },
      {
        id: 2,
        text: "I'm Harry Koena Mofoka — a builder at heart, with heart, for the heart of it.",
        sender: "them",
        time: "10:01 AM",
      },
      {
        id: 3,
        text: "Ask me about 'projects', 'story', 'skills', 'nexlink', or 'contact'!",
        sender: "them",
        time: "10:01 AM",
      },
    ],
  },
  {
    id: "nexlink",
    name: "Nexlink Solutions ZA",
    avatar: "/brands/nexlink-badge.jpg",
    avatarColor: "bg-gradient-to-tr from-zinc-700 to-zinc-900",
    initials: "NX",
    unread: false,
    email: NEXLINK_EMAIL,
    github: NEXLINK_GITHUB,
    messages: [
      {
        id: 1,
        text: "Welcome to Nexlink Solutions ZA — Harry's South African software & product studio.",
        sender: "them",
        time: "Yesterday",
      },
      {
        id: 2,
        text: "We craft web applications, mobile tools, business dashboards, and AI-powered products like GlowLink, TapShare/Scanned, and AI ATS Resume tools.",
        sender: "them",
        time: "Yesterday",
      },
    ],
  },
];
