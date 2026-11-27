const OWNER_NAME = "Harry Koena Mofoka";
const SITE_NAME = `${OWNER_NAME} - macOS Portfolio`;
const SITE_DESCRIPTION =
  "Interactive macOS-inspired developer portfolio for Harry Koena Mofoka with desktop apps, mobile views, projects, CV viewer, and Siri assistant.";

export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: "Harry Mofoka",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["portfolio", "developer", "productivity"],
    icons: [
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    screenshots: [
      {
        src: "/readme/desktop.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "Harry Mofoka Desktop portfolio experience",
      },
      {
        src: "/readme/mobile.png",
        sizes: "441x789",
        type: "image/png",
        form_factor: "narrow",
        label: "Harry Mofoka Mobile portfolio experience",
      },
    ],
  };
}
