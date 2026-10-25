import sharp from "sharp";
const escape = (text: string) => text.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);

export async function renderSocialImage(title: string, subtitle: string, image?: string | null) {
  const overlays: sharp.OverlayOptions[] = [];
  // Only decode stored inline images; never fetch user-controlled remote URLs.
  if (image?.match(/^data:image\/(png|jpeg|webp);base64,/)) {
    try {
      const buffer = await sharp(Buffer.from(image.split(",")[1], "base64"), { limitInputPixels: 16_000_000 })
        .resize(440, 440, { fit: "contain", background: "#101010" }).png().toBuffer();
      overlays.push({ input: buffer, top: 70, left: 700 });
    } catch { /* Invalid legacy artwork falls back to the branded card. */ }
  }
  const text = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#101010"/><text x="64" y="110" font-family="sans-serif" font-size="24" fill="#b0b0b0">NEJ CLOTHING</text><text x="64" y="290" font-family="sans-serif" font-weight="bold" font-size="44" fill="white">${escape(title.slice(0, 24))}</text><text x="64" y="350" font-family="sans-serif" font-size="25" fill="#c7c7c7">${escape(subtitle)}</text><text x="64" y="552" font-family="sans-serif" font-size="23" fill="#c7c7c7">nej.com.ng</text></svg>`;
  return sharp(Buffer.from(text)).composite(overlays).png().toBuffer();
}
