import type { MetadataRoute } from "next";
import { players } from "@/data/players";

const baseUrl = "https://www.tavalyze.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/players",
    "/teams",
    "/market-values",
    "/transfers",
    "/compare",
    "/favorites",
    "/methodology",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
      priority: route === "" ? 1 : 0.8,
    })),
    ...players.map((player) => ({
      url: `${baseUrl}/players/${player.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
