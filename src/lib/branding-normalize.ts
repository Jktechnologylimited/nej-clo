import sharp from "sharp";
import type { Branding } from "./branding-image";

/** Decode and re-encode the upload; derive both assets from the same pixels. */
export async function normalizeBranding(logo: string): Promise<Branding> {
  const bytes = Buffer.from(logo.split(",")[1], "base64");
  const image = sharp(bytes, { limitInputPixels: 512 * 512, failOn: "warning" });
  const metadata = await image.metadata();
  if (metadata.format !== "png") throw new Error("Expected a PNG image.");
  const [logoBytes, faviconBytes] = await Promise.all([
    image.clone().resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true }).png().toBuffer(),
    image.clone().resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
  ]);
  return {
    logo: `data:image/png;base64,${logoBytes.toString("base64")}`,
    favicon: `data:image/png;base64,${faviconBytes.toString("base64")}`,
  };
}
