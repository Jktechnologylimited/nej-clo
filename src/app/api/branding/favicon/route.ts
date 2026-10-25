import { getBranding } from "@/lib/branding";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const branding = await getBranding();
  if (!branding) return Response.redirect(new URL("/default-favicon.ico", request.url), 307);
  const image = Buffer.from(branding.favicon.split(",")[1], "base64");
  return new Response(image, {
    headers: { "Content-Type": "image/png", "Cache-Control": "no-cache, max-age=0" },
  });
}
