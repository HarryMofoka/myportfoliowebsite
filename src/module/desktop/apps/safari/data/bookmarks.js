import {
  PROJECT_1_URL,
  PROJECT_2_URL,
  PROJECT_3_URL,
  PROJECT_4_URL,
  GITHUB_PROFILE,
} from "@constants";

export const DEFAULT_BOOKMARKS = [
  {
    id: 1,
    title: "Portfolio",
    url: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
    img: "/brands/portfolio.png",
  },
  {
    id: 2,
    title: "Fold",
    url: PROJECT_1_URL,
    img: "/projects/desktop/fold.png",
  },
  {
    id: 3,
    title: "Word",
    url: PROJECT_2_URL,
    img: "/projects/desktop/word.png",
  },
  {
    id: 4,
    title: "TetherOS",
    url: PROJECT_3_URL,
    img: "/projects/desktop/tetheros.png",
  },
  {
    id: 5,
    title: "SimpleTerms",
    url: PROJECT_4_URL,
    img: "/projects/desktop/simpleterms.png",
  },
  {
    id: 6,
    title: "GitHub",
    url: GITHUB_PROFILE,
    img: "/brands/github.webp",
  },
  {
    id: 7,
    title: "Wikipedia",
    url: "https://en.wikipedia.org",
    img: "https://en.wikipedia.org/favicon.ico",
  },
  {
    id: 8,
    title: "OpenStreetMap",
    url: "https://openstreetmap.org",
    img: "/brands/openstreetmap.webp",
  },
];
