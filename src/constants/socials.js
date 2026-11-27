import { GITHUB_PROFILE, INSTAGRAM_URL, LINKEDIN_URL, NEXLINK_URL, PORTFOLIO_URL } from "./env";

export const socials = [
  {
    id: 1,
    text: "GitHub",
    icon: "/system/icons/social/github.svg",
    bg: "#18181b",
    link: GITHUB_PROFILE,
    img: "/brands/github.webp",
  },
  {
    id: 2,
    text: "LinkedIn",
    icon: "/system/icons/social/linkedin.svg",
    bg: "#0a66c2",
    link: LINKEDIN_URL,
    img: "/brands/linkedin.webp",
  },
  {
    id: 3,
    text: "Portfolio",
    icon: "/system/icons/social/atom.svg",
    bg: "#2563eb",
    link: PORTFOLIO_URL,
    img: "/brands/portfolio.png",
  },
  {
    id: 4,
    text: "Nexlink ZA",
    icon: "/system/icons/social/atom.svg",
    bg: "#0f766e",
    link: NEXLINK_URL,
    img: "/brands/nexlink-badge.jpg",
  },
  {
    id: 5,
    text: "Instagram",
    icon: "/system/icons/social/atom.svg",
    bg: "#e1306c",
    link: INSTAGRAM_URL,
    img: "/brands/portfolio.png",
  },
];
