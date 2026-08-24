import type { MetadataRoute } from "next";
import { players } from "@/data/players";
import { predictions } from "@/data/predictions";
import { clubSlug } from "@/lib/player-slugs";

const baseUrl = "https://www.tavalyze.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/players",
    "/teams",
    "/market-values",
    "/transfers",
    "/compare",
    "/predictions",
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
    ...predictions.map((prediction) => ({
      url: `${baseUrl}/predictions/${prediction.id}`,
      lastModified: new Date(prediction.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...Array.from(new Set(players.map((player) => player.club))).map((club) => ({
      url: `${baseUrl}/teams/${clubSlug(club)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
  ];
}
