import Link from "next/link";
import { players } from "@/data/players";
import { clubSlug } from "@/lib/player-slugs";

export default function TeamsPage() {
  const teams = Array.from(new Set(players.map((player) => player.club)))
    .map((club) => {
      const squad = players.filter((player) => player.club === club);

      const totalValue = squad.reduce(
        (total, player) => total + player.marketValue,
        0
      );

      const averageAge =
        squad.reduce((total, player) => total + player.age, 0) / squad.length;

      return {
        club,
        league: squad[0].league,
        slug: clubSlug(club),
        squadSize: squad.length,
        totalValue,
        averageAge,
      };
    })
    .sort(
      (a, b) =>
        a.league.localeCompare(b.league) ||
        b.totalValue - a.totalValue ||
        a.club.localeCompare(b.club),
    );

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
          Global club directory
        </p>

        <h1 className="mt-2 text-5xl font-bold">Teams</h1>

        <p className="mt-3 text-gray-400">
          Explore {teams.length} clubs across five major European leagues.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link
              key={team.club}
              href={`/teams/${team.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/10"
            >
              <div className="flex h-28 items-center justify-center rounded-2xl bg-black/20 text-4xl font-bold text-green-500">
                {team.club
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 3)}
              </div>

              <h2 className="mt-6 text-2xl font-bold">{team.club}</h2>
              <p className="mt-1 text-sm font-semibold text-sky-300">
                {team.league}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Players</p>
                  <p className="mt-1 text-xl font-bold">{team.squadSize}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Squad Value</p>
                  <p className="mt-1 text-xl font-bold">
                    €{team.totalValue}M
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Average Age</p>
                  <p className="mt-1 text-xl font-bold">
                    {team.averageAge.toFixed(1)}
                  </p>
                </div>
              </div>

              <p className="mt-7 text-sm text-gray-500 transition group-hover:text-green-400">
                View team →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
