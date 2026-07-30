import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";
import MarketValueForecast from "@/components/MarketValueForecast";
import ClubFitAnalysis from "@/components/ClubFitAnalysis";
import DataStatusPanel from "@/components/DataStatusPanel";
import ApiSeasonStats from "@/components/ApiSeasonStats";
import PlayerPortrait from "@/components/PlayerPortrait";
import { players } from "@/data/players";
import {
  ApiFootballError,
  getApiFootballPlayerSeason,
} from "@/lib/api-football";
import type { ApiFootballPlayerSeason } from "@/lib/api-football";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return players.map((player) => ({ id: player.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const player = players.find((item) => item.id === id);

  if (!player) {
    return { title: "Player not found" };
  }

  const description = `${player.name}: €${player.marketValue}M Tavalyze market-value estimate, ${player.position} profile, club context and transparent data coverage.`;

  return {
    title: `${player.name} — Market Value & Profile`,
    description,
    alternates: { canonical: `/players/${player.id}` },
    openGraph: {
      type: "profile",
      url: `/players/${player.id}`,
      title: `${player.name} on Tavalyze`,
      description,
      ...(player.image
        ? { images: [{ url: player.image, alt: player.name }] }
        : {}),
    },
  };
}

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;

  const player = players.find((item) => item.id === id);

  if (!player) {
    notFound();
  }

  const similarPlayers = (player.similarPlayerIds ?? [])
    .map((similarId) => players.find((item) => item.id === similarId))
    .filter((item) => item !== undefined);

  let apiSeasonProfile: ApiFootballPlayerSeason | null = null;

  if (player.apiFootballId && player.apiSeason) {
    try {
      const result = await getApiFootballPlayerSeason(
        player.apiFootballId,
        player.apiSeason,
      );
      apiSeasonProfile = result.response[0] ?? null;
    } catch (error) {
      if (!(error instanceof ApiFootballError)) {
        throw error;
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-14">
        <Link
          href="/players"
          className="mb-8 inline-flex text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to players
        </Link>

        <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:items-center">
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <PlayerPortrait
              player={player}
              sizes="340px"
              className="object-contain p-5"
              priority
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
              Player profile
            </p>

            <h1 className="mt-3 text-5xl font-bold md:text-6xl">
              {player.name}
            </h1>

            <p className="mt-4 text-xl text-gray-400">
              {player.position} · {player.club} · {player.league}
            </p>

            <div className="mt-8 inline-block rounded-3xl border border-green-500/30 bg-green-500/10 px-7 py-5">
              <p className="text-sm text-green-400">Market Value</p>
              <p className="mt-1 text-5xl font-bold">
                €{player.marketValue}M
              </p>
            </div>

            <div>
              <FavoriteButton playerId={player.id} playerName={player.name} />
            </div>

            <DataStatusPanel player={player} />
          </div>
        </div>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard label="Age" value={player.age} />
          <InfoCard label="Nationality" value={player.nationality} />
          <InfoCard
            label="Height"
            value={player.height ? `${player.height} cm` : "Coming soon"}
          />
          <InfoCard
            label="Preferred Foot"
            value={player.preferredFoot ?? "Coming soon"}
          />
          <InfoCard
            label="Shirt Number"
            value={
              player.shirtNumber !== undefined
                ? `#${player.shirtNumber}`
                : "Coming soon"
            }
          />
          <InfoCard label="Joined Club" value={player.joined ?? "Coming soon"} />
          <InfoCard
            label="Contract Until"
            value={player.contractUntil ?? "Coming soon"}
          />
          <InfoCard label="Position" value={player.position} />
        </section>

        {apiSeasonProfile && player.apiSeason ? (
          <ApiSeasonStats
            season={player.apiSeason}
            profile={apiSeasonProfile}
            preferredLeague={player.league}
          />
        ) : (
          <section className="mt-12 rounded-3xl border border-amber-400/20 bg-amber-400/5 p-7 md:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-300">
                  Demo data
                </p>
                <h2 className="mt-2 text-3xl font-bold">Player Statistics</h2>
                <p className="mt-2 text-sm text-gray-400">
                  This player is not connected to a verified statistics source yet.
                </p>
              </div>
              <span className="w-fit rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                Unverified
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Appearances"
                value={player.appearances ?? "—"}
              />
              <StatCard label="Goals" value={player.goals ?? "—"} />
              <StatCard label="Assists" value={player.assists ?? "—"} />
              <StatCard label="Minutes" value={player.minutes ?? "—"} />
            </div>
          </section>
        )}

        <MarketValueForecast
          playerName={player.name}
          currentValue={player.marketValue}
          age={player.age}
        />

        <ClubFitAnalysis player={player} />

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
            Tavalyze AI
          </p>

          <h2 className="mt-2 text-3xl font-bold">AI Player Analysis</h2>

          <p className="mt-5 max-w-3xl leading-8 text-gray-400">
            AI-powered scouting reports, strengths, weaknesses, player fit and
            future market-value predictions will appear here in a later
            Tavalyze version.
          </p>
        </section>

        <section className="mt-12 pb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
            Discover
          </p>

          <h2 className="mt-2 text-3xl font-bold">Similar Players</h2>

          {similarPlayers.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similarPlayers.map((similarPlayer) => (
                <Link
                  key={similarPlayer.id}
                  href={`/players/${similarPlayer.id}`}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/10"
                >
                  <div className="relative h-44 overflow-hidden rounded-2xl bg-black/20">
                    <PlayerPortrait
                      player={similarPlayer}
                      sizes="300px"
                      className="object-contain p-3"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {similarPlayer.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    {similarPlayer.position} · {similarPlayer.club}
                  </p>

                  <p className="mt-5 text-2xl font-bold">
                    €{similarPlayer.marketValue}M
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-gray-500">
              Similar players coming soon
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

type CardValue = string | number;

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: CardValue;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: CardValue;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
    </div>
  );
}
