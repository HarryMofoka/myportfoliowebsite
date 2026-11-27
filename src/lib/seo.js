import { OWNER_MOTTO, OWNER_NAME, TWITTER_URL } from "../constants/env";
import { absoluteSiteUrl } from "./site-url";

export { OWNER_NAME };
export const SITE_NAME = `${OWNER_NAME} | macOS Portfolio`;
export const SITE_DESCRIPTION = `Explore ${OWNER_NAME}'s interactive macOS-inspired portfolio — self-taught South African software developer, product builder, and co-founder of Nexlink Solutions ZA. ${OWNER_MOTTO}`;

const previewImage = absoluteSiteUrl("/og-image/og-image.png");
const twitterHandle = TWITTER_URL
  ? new URL(TWITTER_URL).pathname.split("/").filter(Boolean)[0]
  : undefined;

export function pageMetadata({ path = "/", title = SITE_NAME, description = SITE_DESCRIPTION }) {
  const socialTitle = title === SITE_NAME ? title : `${title} | ${OWNER_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: absoluteSiteUrl(path) },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      url: absoluteSiteUrl(path),
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      images: [
        {
          url: previewImage,
          width: 1440,
          height: 900,
          alt: `${OWNER_NAME}'s macOS portfolio desktop preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [previewImage],
      creator: twitterHandle ? `@${twitterHandle}` : undefined,
    },
  };
}
