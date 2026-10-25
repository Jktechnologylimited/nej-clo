import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/checkout", "/cart", "/search", "/api/admin", "/api/auth", "/api/checkout"] },
    sitemap: new URL("/sitemap.xml", siteUrl()).href,
  };
}
