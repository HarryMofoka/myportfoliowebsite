import { useState, useEffect } from "react";
import useWindowsStore from "@store/window";
import {
  GITHUB_USERNAME,
  GITHUB_PROFILE,
  OWNER_NAME,
  OWNER_AVATAR,
  OWNER_LOCATION,
  EMAIL,
  PROJECT_1_GITHUB,
  PROJECT_2_GITHUB,
  PROJECT_3_GITHUB,
} from "@constants";

const FALLBACK_GITHUB_DATA = {
  profile: {
    name: OWNER_NAME,
    login: GITHUB_USERNAME,
    avatar_url: OWNER_AVATAR,
    html_url: GITHUB_PROFILE,
    email: EMAIL,
    bio: "Software Developer · Product Builder · Co-founder at Nexlink Solutions ZA. A builder at heart, with heart, for the heart of it.",
    location: OWNER_LOCATION,
    public_repos: 41,
    followers: 19,
  },
  repos: [
    {
      id: "fold",
      name: "Fold",
      description: "Privacy-first zero-cloud local PDF workspace with OCR & Tauri desktop support.",
      html_url: PROJECT_1_GITHUB,
    },
    {
      id: "word",
      name: "Word",
      description:
        "Self-custodial USDT P2P payment & bilateral accountability platform (563 Vitest tests).",
      html_url: PROJECT_2_GITHUB,
    },
    {
      id: "tetheros",
      name: "TetherOS",
      description: "Offline-first personal second brain & AI accountability companion (44 routes).",
      html_url: PROJECT_3_GITHUB,
    },
  ],
};

const useSettings = () => {
  const githubApiBase =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GITHUB_API_URL) ||
    "https://api.github.com";
  const { windows } = useWindowsStore();
  const windowData = windows.settings?.data;

  const [activeTab, setActiveTab] = useState(() => windowData?.tab || "Apple ID");
  const [githubData, setGithubData] = useState(FALLBACK_GITHUB_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (windowData?.tab) {
      setActiveTab((prev) => (prev !== windowData.tab ? windowData.tab : prev));
    }
  }, [windowData]);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const [mobileView, setMobileView] = useState("main");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${githubApiBase}/users/${GITHUB_USERNAME}`).then((res) => res.json()),
      fetch(`${githubApiBase}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=3`).then((res) =>
        res.json(),
      ),
    ])
      .then(([profile, repos]) => {
        const validProfile =
          profile && !profile.message && profile.login
            ? {
                ...FALLBACK_GITHUB_DATA.profile,
                ...profile,
                email: profile.email || EMAIL,
                location: profile.location || OWNER_LOCATION,
              }
            : FALLBACK_GITHUB_DATA.profile;
        const validRepos =
          Array.isArray(repos) && repos.length > 0 ? repos : FALLBACK_GITHUB_DATA.repos;
        setGithubData({ profile: validProfile, repos: validRepos });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching GitHub details:", err);
        setGithubData(FALLBACK_GITHUB_DATA);
        setIsLoading(false);
      });
  }, [githubApiBase]);

  return {
    activeTab,
    setActiveTab,
    githubData,
    isLoading,
    isMobile,
    mobileView,
    setMobileView,
  };
};

export default useSettings;
