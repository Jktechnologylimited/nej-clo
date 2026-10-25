import { z } from "zod";

// Canvas exports PNG so logos retain transparency. Keep payloads bounded.
const png = z.string().max(1_500_000).regex(/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/);
export const brandingSchema = z.object({
  logo: png,
  favicon: png.max(50_000),
}).strict();
export type Branding = z.infer<typeof brandingSchema>;

export async function prepareBranding(file: File): Promise<Branding> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("Choose a PNG, JPEG, or WebP image.");
  }
  if (file.size > 10 * 1024 * 1024) throw new Error("Choose an image smaller than 10 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    function render(size: number, square: boolean) {
      const scale = Math.min(1, size / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = square ? size : width;
      canvas.height = square ? size : height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser cannot process images.");
      context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      return canvas.toDataURL("image/png");
    }
    return brandingSchema.parse({ logo: render(512, false), favicon: render(64, true) });
  } finally {
    URL.revokeObjectURL(url);
  }
}
