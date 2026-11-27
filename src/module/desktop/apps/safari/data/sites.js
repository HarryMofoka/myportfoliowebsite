import {
  PROJECT_1_URL,
  PROJECT_2_URL,
  PROJECT_3_URL,
  PROJECT_4_URL,
  PROJECT_5_URL,
  PROJECT_6_URL,
  PROJECT_7_URL,
  PROJECT_8_URL,
  AI_RESUME_ANALYZER_URL,
  NEXLINK_URL,
} from "@constants";

const getDomain = (url) => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return "";
  }
};

export const IFRAME_COMPATIBLE_SITES = [
  "openstreetmap.org",
  "wttr.in",
  "example.com",
  "example.org",
  getDomain(PROJECT_1_URL),
  getDomain(PROJECT_2_URL),
  getDomain(PROJECT_3_URL),
  getDomain(PROJECT_4_URL),
  getDomain(PROJECT_5_URL),
  getDomain(PROJECT_6_URL),
  getDomain(PROJECT_7_URL),
  getDomain(PROJECT_8_URL),
  getDomain(AI_RESUME_ANALYZER_URL),
  getDomain(NEXLINK_URL),
].filter(Boolean);
