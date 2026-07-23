import Link from "next/link";
import { notFound } from "next/navigation";
import { players } from "@/data/players";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;

  const teamPlayers = players.filter(
    (player) => player.club.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (teamPlayers.length === 0) {
    notFound();
  }

  const club = teamPlayers[0].club;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-bold">{club}</h1>

        <p className="mt-2 text-gray-400">
          {teamPlayers.length} Players
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamPlayers.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-green-500"
            >
              <h2 className="text-xl font-semibold">{player.name}</h2>

              <p className="mt-2 text-gray-400">
                {player.position} • {player.nationality}
              </p>

              <p className="mt-6 text-3xl font-bold">
                €{player.marketValue}M
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}