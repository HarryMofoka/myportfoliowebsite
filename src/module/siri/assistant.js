import {
  dockApps,
  locations,
  projects,
  socials,
  techStack,
  OWNER_NAME,
  OWNER_MOTTO,
  OWNER_LOCATION,
  EMAIL,
  NEXLINK_EMAIL,
  NEXLINK_URL,
  PROJECT_1_URL,
  PROJECT_2_URL,
  PROJECT_3_URL,
  PROJECT_4_URL,
  PROJECT_5_URL,
  PROJECT_6_URL,
  PROJECT_7_URL,
  PROJECT_8_URL,
  GITHUB_PROFILE,
  LINKEDIN_URL,
  INSTAGRAM_URL,
  PORTFOLIO_URL,
} from "@constants";

const FALLBACK_PROJECT_LINKS = {
  fold: PROJECT_1_URL,
  word: PROJECT_2_URL,
  tetheros: PROJECT_3_URL,
  simpleterms: PROJECT_4_URL,
  littlestars: PROJECT_5_URL,
  tinyhabits: PROJECT_6_URL,
  veloriq: PROJECT_7_URL,
  bionex: PROJECT_8_URL,
};

const FALLBACK_SOCIAL_LINKS = {
  github: GITHUB_PROFILE,
  linkedin: LINKEDIN_URL,
  instagram: INSTAGRAM_URL,
  nexlink: NEXLINK_URL,
  portfolio: PORTFOLIO_URL,
};

const PROJECT_META = {
  1: {
    key: "fold",
    aliases: ["fold", "fold pdf", "foldpdf", "pdf editor", "pdf workspace", "local pdf"],
  },
  2: {
    key: "word",
    aliases: ["word", "word app", "usdt", "p2p payment", "peer to peer", "tether wdk"],
  },
  3: {
    key: "tetheros",
    aliases: ["tetheros", "tether os", "second brain", "accountability companion"],
  },
  4: {
    key: "simpleterms",
    aliases: ["simpleterms", "simple terms", "contract explainer", "legal ai"],
  },
  5: {
    key: "littlestars",
    aliases: ["little stars", "creche", "preschool", "ecd"],
  },
  6: {
    key: "tinyhabits",
    aliases: ["tinyhabits", "tiny habits", "habit tracker", "habit coach"],
  },
  7: {
    key: "veloriq",
    aliases: ["veloriq", "smartwatch", "3d watch", "three js"],
  },
  8: {
    key: "bionex",
    aliases: ["bionex", "bionex lims", "lims", "laboratory"],
  },
};

const APP_ALIASES = {
  finder: ["finder", "files", "file manager", "portfolio", "project folder", "projects folder"],
  launchpad: ["launchpad", "app launcher", "apps"],
  safari: ["safari", "browser", "internet", "web"],
  chrome: ["chrome", "google chrome"],
  photos: ["photos", "gallery", "pictures", "images"],
  contact: ["contact", "contacts", "email", "phone"],
  terminal: ["terminal", "shell", "bash", "skills terminal"],
  resume: ["resume", "cv", "curriculum vitae"],
  settings: ["settings", "system settings", "preferences", "system preferences"],
  calculator: ["calculator", "calc"],
  notes: ["notes", "note"],
  call: ["facetime", "call", "phone call"],
  messages: ["messages", "message", "imessage"],
  appletv: ["apple tv", "tv", "movies"],
  appstore: ["app store", "appstore"],
  calendar: ["calendar", "schedule"],
  weather: ["weather", "forecast"],
  vscode: ["vs code", "vscode", "code", "editor", "visual studio code"],
  postman: ["postman", "api client", "api"],
  map: ["map", "maps", "location"],
  font: ["font book", "fonts", "font"],
  telegram: ["telegram", "chat"],
  music: ["music", "jamendo", "song", "songs", "player"],
};

const OPEN_INTENTS = ["open", "launch", "show", "view", "start", "go to", "visit", "pull up"];
const CLOSE_INTENTS = ["close", "quit", "exit", "dismiss"];
const MINIMIZE_INTENTS = ["minimize", "hide"];
const MAXIMIZE_INTENTS = ["maximize", "fullscreen", "full screen", "make bigger"];
const RESTORE_INTENTS = ["restore", "unminimize", "bring back"];
const FOCUS_INTENTS = ["focus", "bring", "front", "switch to"];

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9%.\s:/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsTerm = (query, term) => {
  const phrase = normalizeText(term);
  if (!phrase) return false;

  if (!phrase.includes(" ") && phrase.length <= 4) {
    return new RegExp(`(^|\\s)${escapeRegex(phrase)}(\\s|$)`).test(query);
  }

  return query.includes(phrase);
};

const hasAny = (query, phrases) => phrases.some((phrase) => containsTerm(query, phrase));

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const getPercentValue = (query) => {
  const match = query.match(/(\d{1,3})\s*(?:percent|%)?/);
  if (!match) return null;
  return clamp(Number(match[1]));
};

const makeResult = (response, options = {}) => ({
  response,
  listenAfter: Boolean(options.listenAfter),
});

const getProjectFolders = () => locations.work?.children ?? [];

const getProjectRecords = () =>
  projects.map((project) => {
    const meta = PROJECT_META[project.id] ?? { key: String(project.id), aliases: [] };
    const aliases = [project.title, ...meta.aliases];
    const folder = getProjectFolders().find((item) =>
      aliases.some((alias) => containsTerm(normalizeText(item.name), alias)),
    );
    const textFile = folder?.children?.find((item) => item.fileType === "txt");
    const imageFile = folder?.children?.find((item) => item.fileType === "img");
    const urlFile = folder?.children?.find((item) => item.fileType === "url");
    const githubFile = folder?.children?.find((item) => item.fileType === "fig");

    return {
      ...project,
      key: meta.key,
      aliases,
      folder,
      textFile,
      imageFile,
      link: project.link || urlFile?.href || FALLBACK_PROJECT_LINKS[meta.key],
      github: project.github || githubFile?.href || FALLBACK_SOCIAL_LINKS.github,
      description:
        textFile?.description?.join(" ") ||
        project.description ||
        "A featured build in Harry Mofoka's portfolio.",
    };
  });

const getProjectByQuery = (query) =>
  getProjectRecords().find((project) =>
    project.aliases.some((alias) => containsTerm(query, alias)),
  );

const getProjectSummary = (project) => {
  const firstSentence = project.description.split(/(?<=[.!?])\s+/)[0] || project.description;
  return `${project.title}: ${firstSentence}`;
};

const openWindowSafely = (actions, id, data) => {
  const targetId = id === "chrome" ? "safari" : id;
  actions.openWindow?.(targetId, data);
  return targetId;
};

const openUrl = (actions, url) => {
  if (!url) return false;
  actions.openWindow?.("safari", { url });
  return true;
};

const openFinderLocation = (actions, location) => {
  if (location) actions.setActiveLocation?.(location);
  actions.openWindow?.("finder");
};

const findProjectFile = (project, type) =>
  project.folder?.children?.find((item) => item.fileType === type);

const getAppTargets = () =>
  dockApps
    .filter((app) => app.canOpen !== false)
    .map((app) => ({
      id: app.id === "folder" ? "finder" : app.id,
      name: app.name,
      aliases: [app.name, app.id, ...(APP_ALIASES[app.id] ?? [])],
    }))
    .concat([
      { id: "resume", name: "Resume", aliases: APP_ALIASES.resume },
      { id: "chrome", name: "Google Chrome", aliases: APP_ALIASES.chrome },
    ]);

const getAppByQuery = (query) =>
  getAppTargets().find((app) => app.aliases.some((alias) => containsTerm(query, alias)));

const getSocialByQuery = (query) => {
  if (containsTerm(query, "github")) {
    return {
      name: "GitHub",
      url:
        socials.find((item) => item.text.toLowerCase().includes("github"))?.link ||
        FALLBACK_SOCIAL_LINKS.github,
    };
  }
  if (containsTerm(query, "linkedin")) {
    return {
      name: "LinkedIn",
      url:
        socials.find((item) => item.text.toLowerCase().includes("linkedin"))?.link ||
        FALLBACK_SOCIAL_LINKS.linkedin,
    };
  }
  if (containsTerm(query, "instagram") || containsTerm(query, "kalm.harry")) {
    return {
      name: "Instagram",
      url:
        socials.find((item) => item.text.toLowerCase().includes("instagram"))?.link ||
        FALLBACK_SOCIAL_LINKS.instagram,
    };
  }
  if (containsTerm(query, "nexlink")) {
    return {
      name: "Nexlink Solutions ZA",
      url: FALLBACK_SOCIAL_LINKS.nexlink,
    };
  }
  if (containsTerm(query, "portfolio website") || containsTerm(query, "website")) {
    return {
      name: "portfolio website",
      url:
        socials.find((item) => item.text.toLowerCase().includes("portfolio"))?.link ||
        FALLBACK_SOCIAL_LINKS.portfolio,
    };
  }
  return null;
};

const getOnOffIntent = (query) => {
  const wantsOff = hasAny(query, ["turn off", "switch off", "disable", "deactivate", "off"]);
  const wantsOn = hasAny(query, ["turn on", "switch on", "enable", "activate", "on"]);
  if (wantsOff) return false;
  if (wantsOn) return true;
  return null;
};

const handleMusicCommand = (query, actions) => {
  if (hasAny(query, ["next song", "next track", "skip song", "skip track"])) {
    window.dispatchEvent(new CustomEvent("macos-portfolio-next-track"));
    return makeResult("Skipping to the next track.");
  }

  if (hasAny(query, ["previous song", "previous track", "last song", "back song"])) {
    window.dispatchEvent(new CustomEvent("macos-portfolio-prev-track"));
    return makeResult("Going back to the previous track.");
  }

  if (hasAny(query, ["unmute", "sound on"])) {
    actions.setMusicState?.({ isMuted: false });
    return makeResult("Sound is back on.");
  }

  if (hasAny(query, ["mute", "sound off"])) {
    actions.setMusicState?.({ isMuted: true });
    return makeResult("Muted.");
  }

  if (hasAny(query, ["volume", "sound"])) {
    const currentVolume = actions.music?.isMuted ? 0 : (actions.music?.volume ?? 72);
    let nextVolume = getPercentValue(query);

    if (nextVolume === null && hasAny(query, ["increase", "up", "louder", "raise"])) {
      nextVolume = clamp(currentVolume + 10);
    }
    if (nextVolume === null && hasAny(query, ["decrease", "down", "lower", "quieter"])) {
      nextVolume = clamp(currentVolume - 10);
    }

    if (nextVolume !== null) {
      actions.setMusicState?.({ volume: nextVolume, isMuted: nextVolume === 0 });
      actions.updateSystemSetting?.("soundLevel", nextVolume);
      return makeResult(`Volume set to ${nextVolume} percent.`);
    }
  }

  if (hasAny(query, ["play music", "resume music", "play song", "resume song"])) {
    actions.setMusicState?.({ isPlaying: true });
    return makeResult("Playing music.");
  }

  if (hasAny(query, ["pause music", "stop music", "pause song", "stop song"])) {
    actions.setMusicState?.({ isPlaying: false });
    return makeResult("Pausing playback.");
  }

  return null;
};

const handleSettingsCommand = (query, actions) => {
  const setSetting = (key, value, response) => {
    actions.updateSystemSetting?.(key, value);
    return makeResult(response);
  };

  const switchIntent = getOnOffIntent(query);
  const hasSwitchIntent =
    switchIntent !== null || containsTerm(query, "toggle") || containsTerm(query, "switch");

  if (containsTerm(query, "brightness")) {
    const currentBrightness = actions.systemSettings?.brightness ?? 100;
    let nextBrightness = getPercentValue(query);

    if (nextBrightness === null && hasAny(query, ["increase", "up", "brighter", "raise"])) {
      nextBrightness = clamp(currentBrightness + 10);
    }
    if (nextBrightness === null && hasAny(query, ["decrease", "down", "lower", "dim"])) {
      nextBrightness = clamp(currentBrightness - 10);
    }

    if (nextBrightness !== null) {
      return setSetting(
        "brightness",
        nextBrightness,
        `Brightness set to ${nextBrightness} percent.`,
      );
    }
  }

  if (hasSwitchIntent && (containsTerm(query, "wifi") || containsTerm(query, "wi fi"))) {
    const next = switchIntent ?? !actions.systemSettings?.wifi;
    actions.updateSystemSetting?.("wifi", next);
    actions.updateSystemSetting?.("activeWifiNetwork", next ? "Home Network" : "");
    return makeResult(`Wi-Fi turned ${next ? "on" : "off"}.`);
  }

  if (hasSwitchIntent && containsTerm(query, "bluetooth")) {
    const next = switchIntent ?? !actions.systemSettings?.bluetooth;
    return setSetting("bluetooth", next, `Bluetooth turned ${next ? "on" : "off"}.`);
  }

  if (containsTerm(query, "dark mode") || containsTerm(query, "dark theme")) {
    const next = containsTerm(query, "toggle")
      ? !actions.systemSettings?.darkMode
      : (switchIntent ?? true);
    return setSetting("darkMode", next, `Dark mode turned ${next ? "on" : "off"}.`);
  }

  if (containsTerm(query, "light mode") || containsTerm(query, "light theme")) {
    return setSetting("darkMode", false, "Light mode is on.");
  }

  if (hasSwitchIntent && (containsTerm(query, "focus") || containsTerm(query, "do not disturb"))) {
    const next = switchIntent ?? !actions.systemSettings?.focusMode;
    return setSetting("focusMode", next, `Focus mode turned ${next ? "on" : "off"}.`);
  }

  if (hasSwitchIntent && containsTerm(query, "night light")) {
    const next = switchIntent ?? !actions.systemSettings?.nightLight;
    return setSetting("nightLight", next, `Night Light turned ${next ? "on" : "off"}.`);
  }

  if (hasSwitchIntent && containsTerm(query, "firewall")) {
    const next = switchIntent ?? !actions.systemSettings?.firewall;
    return setSetting("firewall", next, `Firewall turned ${next ? "on" : "off"}.`);
  }

  if (hasSwitchIntent && containsTerm(query, "battery percentage")) {
    const next = switchIntent ?? !actions.systemSettings?.showBatteryPercentage;
    return setSetting(
      "showBatteryPercentage",
      next,
      `Battery percentage is ${next ? "visible" : "hidden"}.`,
    );
  }

  if (hasSwitchIntent && containsTerm(query, "low power")) {
    const next = switchIntent ?? actions.systemSettings?.lowPowerMode !== "Always";
    return setSetting(
      "lowPowerMode",
      next ? "Always" : "Never",
      `Low Power Mode turned ${next ? "on" : "off"}.`,
    );
  }

  return null;
};

const handleProjectCommand = (query, actions) => {
  // Additional notable GitHub builds
  if (hasAny(query, ["tapshare", "scanned", "nfc", "business card"])) {
    return makeResult(
      "TapShare / Scanned is Harry's offline-first QR and NFC digital business card built with Next.js, Upstash Redis, and Expo React Native with NFC Manager vCard 3.0 support.",
      { listenAfter: true },
    );
  }
  if (hasAny(query, ["kalm lms", "kalm-lms", "python course", "172 challenges"])) {
    return makeResult(
      "Kalm-LMS is Harry's zero-dependency progressive Python curriculum with 172 hands-on challenges, 20 master systems projects, 20 legacy refactoring rescues, and 51 automated unittest suites.",
      { listenAfter: true },
    );
  }
  if (hasAny(query, ["anyresume", "ats resume", "resume builder", "resume analyzer"])) {
    return makeResult(
      "anyResume-AI and AI Resume Analyzer are Harry's AI-powered ATS resume tools built with Next.js 16, Vercel AI SDK across Anthropic, OpenAI, and Google, Drizzle ORM, and PDF/DOCX export.",
      { listenAfter: true },
    );
  }
  if (hasAny(query, ["glowlink", "glow link", "beauty marketplace"])) {
    return makeResult(
      "GlowLink is a South African beauty services marketplace built at Nexlink Solutions ZA, connecting clients with beauty providers with discovery search, categories, and reviews.",
      { listenAfter: true },
    );
  }

  const project = getProjectByQuery(query);

  if (!project) {
    if (
      hasAny(query, [
        "show projects",
        "open projects",
        "view projects",
        "my projects",
        "project folder",
        "projects folder",
        "work folder",
      ])
    ) {
      openFinderLocation(actions, locations.work);
      return makeResult("Opening Harry's Projects folder in Finder.");
    }

    if (hasAny(query, ["list projects", "what projects", "which projects", "all projects"])) {
      const names = getProjectRecords()
        .map((item) => item.title)
        .join(", ");
      return makeResult(
        `Harry's flagship builds include ${names}, plus TapShare, Kalm-LMS, anyResume-AI, and GlowLink.`,
        { listenAfter: true },
      );
    }

    return null;
  }

  if (hasAny(query, ["github", "repo", "repository", "source code", "codebase"])) {
    openUrl(actions, project.github);
    return makeResult(`Opening the GitHub repository for ${project.title}.`);
  }

  if (hasAny(query, ["folder", "files", "finder"])) {
    openFinderLocation(actions, project.folder ?? locations.work);
    return makeResult(`Opening the ${project.title} project folder.`);
  }

  if (hasAny(query, ["screenshot", "image", "preview", "picture", "photo"])) {
    const imageFile = findProjectFile(project, "img");
    if (imageFile) {
      actions.openWindow?.("imgfile", imageFile);
      return makeResult(`Opening the ${project.title} preview image.`);
    }
  }

  if (hasAny(query, ["details", "brief", "read", "text file", "project file"])) {
    const textFile = findProjectFile(project, "txt");
    if (textFile) {
      actions.openWindow?.("txtfile", textFile);
      return makeResult(`Opening the ${project.title} project brief.`);
    }
  }

  if (hasAny(query, ["tell me", "explain", "what is", "about", "describe"])) {
    return makeResult(getProjectSummary(project), { listenAfter: true });
  }

  if (hasAny(query, [...OPEN_INTENTS, "live", "demo", "website", "site", "app"])) {
    openUrl(actions, project.link);
    return makeResult(`Opening ${project.title} in Safari.`);
  }

  return makeResult(getProjectSummary(project), { listenAfter: true });
};

const handleLocationCommand = (query, actions) => {
  if (hasAny(query, ["about portfolio", "portfolio info", "about this portfolio"])) {
    return makeResult(
      `This is ${OWNER_NAME}'s interactive macOS-inspired portfolio built with Next.js 16 and React 19, showcasing his flagship builds, Nexlink Solutions ZA products, story, and ATS-ready CV.`,
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["who am i", "tell me about myself"])) {
    return makeResult(
      `I can't identify visitors, but I can tell you all about ${OWNER_NAME}, his builds, and his journey in South Africa.`,
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["motto", "quote", "philosophy"])) {
    return makeResult(`Harry's builder motto is: "${OWNER_MOTTO}"`, { listenAfter: true });
  }

  if (
    hasAny(query, ["story", "journey", "background", "how did harry start", "vb net", "pocket neo"])
  ) {
    return makeResult(
      "Harry wanted to build software from around age 10 after gaming and getting a Samsung Galaxy Pocket Neo. His first code was a Visual Basic .NET app that added two numbers, leading him through General Smuts High School, Sedibeng TVET College, WeThinkCode_, and co-founding Nexlink Solutions ZA.",
      { listenAfter: true },
    );
  }

  if (
    hasAny(query, [
      "education",
      "school",
      "college",
      "wethinkcode",
      "sedibeng",
      "tvet",
      "general smuts",
      "anthropic",
    ])
  ) {
    return makeResult(
      "Harry matriculated from General Smuts High School, studied NCV Level 3 IT at Sedibeng TVET College before financial constraints paused his studies, and continued through WeThinkCode_'s Social Employment Fund, SE Prospect Programme, and Generative AI course, plus Anthropic's AI Fluency for Students.",
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["nexlink", "startup", "company", "venture"]) && !hasAny(query, OPEN_INTENTS)) {
    return makeResult(
      `Harry co-founded Nexlink Solutions ZA in 2025 to build web apps, mobile tools, business dashboards, and AI products in South Africa — including GlowLink, TapShare/Scanned, and AI ATS Resume tools. Reach them at ${NEXLINK_EMAIL}.`,
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["skill", "tech stack", "languages", "frameworks", "stack"])) {
    const summary = techStack
      .slice(0, 3)
      .map((g) => `${g.category}: ${g.items.slice(0, 5).join(", ")}`)
      .join(". ");
    return makeResult(
      `Harry's stack spans ${summary}. Open Terminal and type 'techstack' for more!`,
      {
        listenAfter: true,
      },
    );
  }

  if (
    hasAny(query, ["contact", "email", "hire", "reach harry", "get in touch"]) &&
    !hasAny(query, OPEN_INTENTS)
  ) {
    return makeResult(
      `You can reach Harry Koena Mofoka at ${EMAIL}, connect on LinkedIn at linkedin.com/in/harry-mofoka, or browse his 41+ repositories at github.com/HarryMofoka.`,
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["where is harry", "location", "south africa", "gauteng", "based"])) {
    return makeResult(`Harry Koena Mofoka is based in ${OWNER_LOCATION}.`, { listenAfter: true });
  }

  if (
    hasAny(query, ["tell me about me", "tell about me", "about me", "say about me"]) &&
    !hasAny(query, OPEN_INTENTS)
  ) {
    return makeResult(
      `On this portfolio, About Me introduces ${OWNER_NAME} — a self-taught South African software developer, product builder, and co-founder of Nexlink Solutions ZA.`,
      { listenAfter: true },
    );
  }

  // Informational queries about Harry
  if (
    hasAny(query, [
      "tell me about harry",
      "tell me about mofoka",
      "tell me about harry mofoka",
      "tell me about harry koena mofoka",
      "who is harry",
      "who is mofoka",
      "who is harry mofoka",
      "who is harry koena mofoka",
      "say about harry",
    ]) ||
    query === "harry" ||
    query === "mofoka" ||
    query === "harry mofoka" ||
    query === "harry koena mofoka" ||
    ((containsTerm(query, "harry") || containsTerm(query, "mofoka")) &&
      !hasAny(query, OPEN_INTENTS))
  ) {
    return makeResult(
      `${OWNER_NAME} is a self-taught software developer, product builder, and co-founder of Nexlink Solutions ZA from ${OWNER_LOCATION}. "${OWNER_MOTTO}"`,
      { listenAfter: true },
    );
  }

  // Open CV / Resume directly
  if (
    hasAny(query, ["open resume", "open cv", "show resume", "show cv", "view resume", "view cv"])
  ) {
    openWindowSafely(actions, "resume");
    return makeResult("Opening Harry Mofoka's CV.");
  }

  // Open queries for the About Me section
  if (
    query === "about" ||
    hasAny(query, [
      "open about me",
      "open about",
      "about me",
      "about harry",
      "about mofoka",
      "developer profile",
    ])
  ) {
    openFinderLocation(actions, locations.about);
    return makeResult("Opening Harry's About Me folder in Finder.");
  }

  if (hasAny(query, ["resume folder", "cv folder"])) {
    openFinderLocation(actions, locations.resume);
    return makeResult("Opening the Resume folder.");
  }

  if (hasAny(query, ["trash", "archive"])) {
    openFinderLocation(actions, locations.trash);
    return makeResult("Opening Archive.");
  }

  return null;
};

const handleWindowCommand = (query, actions) => {
  if (hasAny(query, ["close all windows", "quit all apps", "clear desktop"])) {
    actions.closeAllWindows?.();
    return makeResult("Closing all open windows.");
  }

  const app = getAppByQuery(query);
  if (!app) return null;

  if (hasAny(query, CLOSE_INTENTS)) {
    actions.closeWindow?.(app.id);
    return makeResult(`Closing ${app.name}.`);
  }

  if (hasAny(query, MINIMIZE_INTENTS)) {
    actions.minimizeWindow?.(app.id);
    return makeResult(`Minimizing ${app.name}.`);
  }

  if (hasAny(query, RESTORE_INTENTS)) {
    actions.unminimizeWindow?.(app.id);
    return makeResult(`Restoring ${app.name}.`);
  }

  if (hasAny(query, MAXIMIZE_INTENTS)) {
    actions.toggleMaximize?.(app.id);
    return makeResult(`Toggling fullscreen for ${app.name}.`);
  }

  if (hasAny(query, FOCUS_INTENTS)) {
    actions.focusWindow?.(app.id);
    return makeResult(`Bringing ${app.name} to the front.`);
  }

  if (hasAny(query, OPEN_INTENTS)) {
    const openedId = openWindowSafely(actions, app.id);
    if (app.id === "chrome" && openedId === "safari") {
      return makeResult("Google Chrome is not available, so I opened Safari instead.");
    }
    return makeResult(`Opening ${app.name}.`);
  }

  return null;
};

const handleSocialCommand = (query, actions) => {
  const social = getSocialByQuery(query);
  if (!social || !hasAny(query, OPEN_INTENTS)) return null;
  openUrl(actions, social.url);
  return makeResult(`Opening ${social.name} in Safari.`);
};

const handleUtilityQuestion = (query) => {
  if (hasAny(query, ["what can you do", "help me", "siri help", "commands"])) {
    return makeResult(
      "I can open apps, show Harry's CV or project folders, launch Fold, Word, TetherOS, or SimpleTerms, tell you Harry's story and skills, control music, and adjust system settings.",
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["who are you", "what are you"])) {
    return makeResult(
      `I'm ${OWNER_NAME}'s portfolio assistant. I can show visitors his builds, open his CV and apps, and share his journey.`,
      { listenAfter: true },
    );
  }

  if (hasAny(query, ["what time is it", "current time", "tell me the time"])) {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return makeResult(`It is ${time}.`, { listenAfter: true });
  }

  if (hasAny(query, ["what date is it", "current date", "today's date", "todays date"])) {
    const date = new Date().toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return makeResult(`Today is ${date}.`, { listenAfter: true });
  }

  return null;
};

const handleWebCommand = (query, rawText, actions) => {
  const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);
  if (urlMatch && hasAny(query, OPEN_INTENTS)) {
    openUrl(actions, urlMatch[0]);
    return makeResult("Opening that link in Safari.");
  }

  if (hasAny(query, ["search for", "google", "look up"])) {
    const searchText = normalizeText(rawText)
      .replace(/^(search for|google|look up)\s+/, "")
      .trim();
    if (searchText) {
      openUrl(actions, `https://www.google.com/search?q=${encodeURIComponent(searchText)}`);
      return makeResult(`Searching the web for ${searchText}.`);
    }
  }

  return null;
};

export const executeSiriCommand = (text, actions = {}) => {
  const query = normalizeText(text);
  if (!query) return null;

  if (hasAny(query, ["close siri", "bye siri", "goodbye siri", "dismiss siri"])) {
    setTimeout(() => actions.setSiriOpen?.(false), 900);
    return makeResult("Goodbye.");
  }

  return (
    handleUtilityQuestion(query) ||
    handleMusicCommand(query, actions) ||
    handleSettingsCommand(query, actions) ||
    handleProjectCommand(query, actions) ||
    handleLocationCommand(query, actions) ||
    handleSocialCommand(query, actions) ||
    handleWindowCommand(query, actions) ||
    handleWebCommand(query, text, actions)
  );
};

export const getSiriSystemPrompt = (query = "") => {
  const question = normalizeText(query);
  const isPortfolioQuestion =
    /project|portfolio|work|build|create|harry|mofoka|nexlink|developer|story|education/.test(
      question,
    );
  const matchedProjects = isPortfolioQuestion
    ? getProjectRecords()
    : getProjectRecords().filter((project) =>
        project.aliases.some((alias) => containsTerm(question, alias)),
      );
  const projectDetails = matchedProjects
    .map(
      (project) =>
        `${project.title}: ${project.description.split(/(?<=[.!?])\s+/)[0].slice(0, 120)}`,
    )
    .join("; ");
  const skillDetails = /skill|stack|technology|technologies|expertise/.test(question)
    ? techStack.map((group) => `${group.category}: ${group.items.join(", ")}`).join("; ")
    : "";
  const contactDetails = /contact|email|reach|hire|collaborat/.test(question)
    ? ` Visitors can contact Harry at ${EMAIL} or Nexlink Solutions ZA at ${NEXLINK_EMAIL}.`
    : "";

  return `You are ${OWNER_NAME}'s portfolio assistant for site visitors. You are not Harry, and the visitor is not assumed to be Harry. Speak about his work in third person. Answer visitors naturally in English, usually in one or two short sentences. For claims about Harry, use only the portfolio facts provided here; say when a detail is unknown. You may answer general questions too. Never claim to control the visitor's real device or to have completed an action. Local app commands are handled separately. Harry Koena Mofoka is a self-taught South African software developer, product builder, and co-founder of Nexlink Solutions ZA based in ${OWNER_LOCATION} ("${OWNER_MOTTO}"). He started coding around age 10 in VB.NET, attended General Smuts High School, studied NCV Level 3 IT at Sedibeng TVET College (paused due to financial constraints), and trained through WeThinkCode_ and Anthropic AI Fluency.${projectDetails ? ` His builds include: ${projectDetails}.` : ""}${skillDetails ? ` His skills: ${skillDetails}.` : ""}${contactDetails}`;
};
