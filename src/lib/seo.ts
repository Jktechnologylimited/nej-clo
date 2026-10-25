import type { Metadata } from "next";

export const SITE_NAME = "Nej Clothing";
export const SITE_DESCRIPTION = "Independent streetwear. Discover limited-run clothing, fresh drops, and curated collections from NEJ.";

export function siteUrl(): URL {
  const url = new URL(process.env.SITE_URL || "https://www.nej.com.ng");
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("SITE_URL must be an HTTP(S) website URL.");
  return new URL(url.origin);
}

export function pageMetadata(title: string, description: string, path: string, imagePath = "/api/og"): Metadata {
  const base = siteUrl();
  const url = base ? new URL(path, base).href : undefined;
  const images = base ? [{ url: new URL(imagePath, base).href, width: 1200, height: 630, alt: title }] : undefined;
  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: { title: `${title} | ${SITE_NAME}`, description, siteName: SITE_NAME, type: "website", url, ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description, ...(images ? { images } : {}) },
  };
}

export const privateMetadata: Metadata = { robots: { index: false, follow: false } };
