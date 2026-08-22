import type { Metadata } from "next";
import BattleLab from "@/components/BattleLab";
import { players } from "@/data/players";

type ComparePageProps = {
  searchParams: Promise<{
    first?: string | string[];
    second?: string | string[];
  }>;
};

function resolvePlayer(value: string | string[] | undefined, fallbackIndex: number) {
  const id = typeof value === "string" ? value : undefined;
  return players.find((player) => player.id === id) ?? players[fallbackIndex];
}

export async function generateMetadata({
  searchParams,
}: ComparePageProps): Promise<Metadata> {
  const query = await searchParams;
  const first = resolvePlayer(query.first, 0);
  const second = resolvePlayer(query.second, 1);
  const title = `${first.name} vs ${second.name} — Football Player Comparison`;
  const description = `Who wins? Compare ${first.name} and ${second.name} across market value, age, Tavalyze Index and available verified statistics.`;
  const canonical = `/compare?first=${first.id}&second=${second.id}`;
  const image = `/api/og/battle?first=${first.id}&second=${second.id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const query = await searchParams;
  const first = resolvePlayer(query.first, 0);
  let second = resolvePlayer(query.second, 1);

  if (first.id === second.id) {
    second = players.find((player) => player.id !== first.id) ?? players[1];
  }

  return (
    <BattleLab initialFirstId={first.id} initialSecondId={second.id} />
  );
}
