import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prajalinks.id";
  const routes = ["", "/menu", "/tentang-kami", "/galeri", "/reservasi", "/kontak", "/cek-status"];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "" || r === "/menu" ? "daily" : "weekly",
    priority: r === "" ? 1 : 0.8,
  }));
}
