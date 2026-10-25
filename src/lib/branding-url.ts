import { createHash } from "node:crypto";

export function faviconUrl(favicon: string): string {
  const version = createHash("sha256").update(favicon).digest("hex").slice(0, 20);
  return `/api/branding/favicon?v=${version}`;
}
