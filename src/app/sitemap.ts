import { MetadataRoute } from "next";
import { SITE } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${SITE.domain}`;
  const routes = [
    "",
    "/domestic-cleaning",
    "/deep-cleaning",
    "/end-of-tenancy-cleaning",
    "/office-cleaning",
    "/pricing",
    "/about",
    "/areas-we-cover",
    "/faq",
    "/contact",
    "/book-online",
  ];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
