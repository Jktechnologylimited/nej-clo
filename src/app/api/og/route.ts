import { renderSocialImage } from "@/lib/social-image";
import { getBranding } from "@/lib/branding";
import { getProductBySlug } from "@/lib/products";
import { getCollectionBySlug } from "@/lib/collections";
import { SITE_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const productSlug = query.get("product");
  const collectionSlug = query.get("collection");
  const [branding, product, collection] = await Promise.all([
    getBranding(),
    productSlug ? getProductBySlug(productSlug) : null,
    collectionSlug ? getCollectionBySlug(collectionSlug) : null,
  ]);
  if ((productSlug && !product) || (collectionSlug && !collection)) return new Response(null, { status: 404 });
  const title = product?.name || collection?.name || SITE_NAME;
  const image = product?.imageUrls?.[0] || collection?.imageUrl || branding?.logo;
  const png = await renderSocialImage(title, product?.colorway || "Independent streetwear. Limited drops.", image);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png", "Cache-Control": "no-cache, max-age=0" } });
}
