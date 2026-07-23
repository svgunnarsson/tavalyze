import Image from "next/image";
import type { ApiFootballPlayerSeason } from "@/lib/api-football";

type Props = {
  season: number;
  profile: ApiFootballPlayerSeason;
  preferredLeague: string;
};

export default function ApiSeasonStats({
  season,
  profile,
  preferredLeague,
}: Props) {
  const statistics =
    profile.statistics.find((entry) => entry.league.name === preferredLeague) ??
    profile.statistics[0];

  if (!statistics) {
    return null;
  }

  const cards = [
    ["Appearances", statistics.games.appearences ?? "—"],
    ["Goals", statistics.goals.total ?? "—"],
    ["Assists", statistics.goals.assists ?? "—"],
    ["Minutes", statistics.games.minutes ?? "—"],
  ] as const;

  return (
    <section className="mt-12 rounded-3xl border border-sky-400/20 bg-sky-400/5 p-7 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
            Verified by API-Football
          </p>
          <h2 className="mt-2 text-3xl font-bold">Player Statistics</h2>
          <p className="mt-3 text-sm text-gray-400">
            API-Football · {statistics.league.name} · {season} season
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-sky-400/20 bg-black/20 px-4 py-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white/5">
            <Image
              src={statistics.team.logo}
              alt={`${statistics.team.name} logo`}
              fill
              sizes="48px"
              className="object-contain p-1"
            />
          </div>
          <div>
            <p className="font-semibold">{statistics.team.name}</p>
            <p className="text-sm text-gray-400">{statistics.league.name}</p>
          </div>
          <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300">
            Verified
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="mt-2 text-4xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-gray-500">
        The free API-Football plan currently provides historical season access
        through 2024. These figures are not labelled as current-season data.
      </p>
    </section>
  );
}
