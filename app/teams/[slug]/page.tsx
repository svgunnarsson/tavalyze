import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlayerPortrait from "@/components/PlayerPortrait";
import { players } from "@/data/players";
import { clubSlug } from "@/lib/player-slugs";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Array.from(new Set(players.map((player) => player.club))).map((club) => ({
    slug: clubSlug(club),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const club = players.find((player) => clubSlug(player.club) === slug)?.club;

  if (!club) return { title: "Team not found" };

  return {
    title: `${club} Squad & Market Values`,
    description: `Explore the ${club} squad, Tavalyze player-value estimates and average age.`,
    alternates: { canonical: `/teams/${slug}` },
  };
}

export default async function TeamPage({ params }: Props) {
  const { slug } = await params;
  const teamPlayers = players
    .filter((player) => clubSlug(player.club) === slug)
    .sort((a, b) => b.marketValue - a.marketValue);

  if (teamPlayers.length === 0) notFound();

  const club = teamPlayers[0].club;
  const league = teamPlayers[0].league;
  const totalValue = teamPlayers.reduce(
    (total, player) => total + player.marketValue,
    0,
  );
  const averageAge =
    teamPlayers.reduce((total, player) => total + player.age, 0) /
    teamPlayers.length;
  const mostValuable = teamPlayers[0];
  const initials = club
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Link
            href="/teams"
            className="text-sm text-slate-500 transition hover:text-white"
          >
            ← All teams
          </Link>

          <div className="mt-8 grid gap-7 md:grid-cols-[150px_1fr] md:items-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-green-400/20 bg-green-400/10 text-4xl font-black text-green-300 shadow-2xl shadow-green-950/30">
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
                {league} · Club intelligence
              </p>
              <h1 className="mt-2 text-5xl font-black tracking-tight md:text-6xl">
                {club}
              </h1>
              <p className="mt-3 text-slate-400">
                Curated Tavalyze squad overview and transparent value estimates.
              </p>
            </div>
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Players", teamPlayers.length],
              ["Combined estimate", `€${totalValue}M`],
              ["Average age", averageAge.toFixed(1)],
              ["Highest estimate", mostValuable.name],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="mt-2 truncate text-2xl font-black">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Squad
            </p>
            <h2 className="mt-2 text-3xl font-black">Players by value</h2>
          </div>
          <p className="text-sm text-slate-500">
            Tavalyze estimates · not transfer fees
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamPlayers.map((player, index) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-green-400/35 hover:bg-white/[0.06]"
            >
              <div className="relative h-52 overflow-hidden rounded-2xl bg-black/20">
                <span className="absolute left-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 font-mono text-xs text-slate-400 backdrop-blur">
                  #{index + 1}
                </span>
                <PlayerPortrait
                  player={player}
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-contain p-3 transition duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-xl font-bold">{player.name}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {player.position} · {player.nationality}
              </p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-600">Estimated value</p>
                  <p className="mt-1 text-2xl font-black">
                    €{player.marketValue}M
                  </p>
                </div>
                <span className="text-sm text-slate-600 group-hover:text-green-300">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
