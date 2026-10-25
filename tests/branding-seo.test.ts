import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { normalizeBranding } from "../src/lib/branding-normalize";
import { brandingSchema } from "../src/lib/branding-image";
import { pageMetadata, privateMetadata, siteUrl } from "../src/lib/seo";

const decode = (url: string) => Buffer.from(url.split(",")[1], "base64");

test("wide logo becomes a transparent square favicon without cropping", async () => {
  const bytes = await sharp({ create: { width: 200, height: 100, channels: 4, background: "#ff0000" } }).png().toBuffer();
  const branding = await normalizeBranding(`data:image/png;base64,${bytes.toString("base64")}`);
  assert.equal(brandingSchema.safeParse(branding).success, true);
  const logo = await sharp(decode(branding.logo)).metadata();
  assert.equal(logo.width, 200);
  assert.equal(logo.height, 100);
  const { data, info } = await sharp(decode(branding.favicon)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 64);
  assert.equal(info.height, 64);
  assert.equal(data[3], 0, "padding stays transparent");
  assert.equal(data[(32 * 64 + 32) * 4], 255, "center retains logo artwork");
  assert.equal(data[(32 * 64 + 32) * 4 + 3], 255);
});

test("corrupt, disguised, and oversized decoded images are rejected", async () => {
  await assert.rejects(normalizeBranding("data:image/png;base64,aGVsbG8="));
  const jpeg = await sharp({ create: { width: 4, height: 4, channels: 3, background: "red" } }).jpeg().toBuffer();
  await assert.rejects(normalizeBranding(`data:image/png;base64,${jpeg.toString("base64")}`));
  const huge = await sharp({ create: { width: 1024, height: 1024, channels: 3, background: "red" } }).png().toBuffer();
  await assert.rejects(normalizeBranding(`data:image/png;base64,${huge.toString("base64")}`));
});

test("branding schema rejects script content and excessive payloads", () => {
  assert.equal(brandingSchema.safeParse({ logo: "data:image/svg+xml,<script/>", favicon: "data:image/png;base64,AA==" }).success, false);
  assert.equal(brandingSchema.safeParse({ logo: "data:image/png;base64," + "A".repeat(1_500_001), favicon: "data:image/png;base64,AA==" }).success, false);
});

test("public metadata has absolute canonicals and fetchable social images", () => {
  const metadata = pageMetadata("Test hoodie", "A limited hoodie", "/product/test-hoodie", "/api/og?product=test-hoodie");
  const origin = siteUrl()!.origin;
  assert.equal(metadata.alternates?.canonical, `${origin}/product/test-hoodie`);
  const og = metadata.openGraph as { url: string; images: { url: string }[] };
  assert.equal(og.url, `${origin}/product/test-hoodie`);
  assert.equal(og.images[0].url, `${origin}/api/og?product=test-hoodie`);
  assert.equal((metadata.twitter as { card: string }).card, "summary_large_image");
  assert.deepEqual(privateMetadata.robots, { index: false, follow: false });
});

test("sharing cards render PNG artwork and escape catalog text", async () => {
  const { renderSocialImage } = await import("../src/lib/social-image");
  const logo = await sharp({ create: { width: 100, height: 100, channels: 3, background: "red" } }).png().toBuffer();
  const png = await renderSocialImage('NEJ <special> & "drop"', "Streetwear & culture", `data:image/png;base64,${logo.toString("base64")}`);
  const metadata = await sharp(png).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  assert.equal(metadata.format, "png");
  const pixel = await sharp(png).extract({ left: 920, top: 290, width: 1, height: 1 }).removeAlpha().raw().toBuffer();
  assert.equal(pixel[0], 255);
  assert.equal(pixel[1], 0);
  await renderSocialImage("Invalid legacy artwork", "Fallback", "data:image/png;base64,YmFk");
});

test("favicon URLs are crawlable and change whenever the artwork changes", async () => {
  const { faviconUrl } = await import("../src/lib/branding-url");
  assert.match(faviconUrl("first image"), /^\/api\/branding\/favicon\?v=[a-f0-9]+$/);
  assert.equal(faviconUrl("first image"), faviconUrl("first image"));
  assert.notEqual(faviconUrl("first image"), faviconUrl("second image"));
});
