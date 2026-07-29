"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { players, type Player } from "@/data/players";

type BattleMetric = {
  label: string;
  first: number;
  second: number;
  firstDisplay: string;
  secondDisplay: string;
  lowerWins?: boolean;
};

type LiveStats = {
  playerId: string;
  season: number;
  source: string;
  team: string;
  league: string;
  appearances: number;
  minutes: number;
  goals: number;
  assists: number;
  rating: number | null;
};

const maxMarketValue = Math.max(...players.map((player) => player.marketValue));

function playerIndex(player: Player) {
  const valueScore = (player.marketValue / maxMarketValue) * 65;
  const ageScore = Math.max(0, Math.min(25, ((32 - player.age) / 14) * 25));
  const connectedScore = player.apiFootballId ? 10 : 0;

  return Math.round(valueScore + ageScore + connectedScore);
}

export default function ComparePage() {
  const [firstPlayerId, setFirstPlayerId] = useState(players[0]?.id ?? "");
  const [secondPlayerId, setSecondPlayerId] = useState(players[1]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const [liveStats, setLiveStats] = useState<Record<string, LiveStats>>({});
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const first = params.get("first");
    const second = params.get("second");

    if (first && players.some((player) => player.id === first)) {
      // Restore a shared battle URL once the browser location is available.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstPlayerId(first);
    }
    if (second && players.some((player) => player.id === second)) {
      setSecondPlayerId(second);
    }
  }, []);

  const firstPlayer = useMemo(
    () => players.find((player) => player.id === firstPlayerId) ?? players[0],
    [firstPlayerId],
  );
  const secondPlayer = useMemo(
    () => players.find((player) => player.id === secondPlayerId) ?? players[1],
    [secondPlayerId],
  );

  useEffect(() => {
    if (!firstPlayer || !secondPlayer) return;
    const url = new URL(window.location.href);
    url.searchParams.set("first", firstPlayer.id);
    url.searchParams.set("second", secondPlayer.id);
    window.history.replaceState({}, "", url);
  }, [firstPlayer, secondPlayer]);

  useEffect(() => {
    if (!firstPlayer || !secondPlayer) return;

    const controller = new AbortController();

    async function loadStats() {
      setLoadingStats(true);

      try {
        const ids = [firstPlayer.id, secondPlayer.id];
        const results = await Promise.all(
          ids.map(async (id) => {
            const response = await fetch(
              `/api/football/player-stats?player=${encodeURIComponent(id)}`,
              { signal: controller.signal },
            );

            if (!response.ok) return null;
            return (await response.json()) as LiveStats;
          }),
        );

        setLiveStats((current) => {
          const next = { ...current };
          results.forEach((result) => {
            if (result) next[result.playerId] = result;
          });
          return next;
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Unable to load Battle Lab statistics.", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoadingStats(false);
      }
    }

    void loadStats();
    return () => controller.abort();
  }, [firstPlayer, secondPlayer]);

  if (!firstPlayer || !secondPlayer) return null;

  const firstIndex = playerIndex(firstPlayer);
  const secondIndex = playerIndex(secondPlayer);
  const firstLive = liveStats[firstPlayer.id];
  const secondLive = liveStats[secondPlayer.id];
  const winner =
    firstIndex === secondIndex
      ? null
      : firstIndex > secondIndex
        ? firstPlayer
        : secondPlayer;

  const metrics: BattleMetric[] = [
    {
      label: "Market value",
      first: firstPlayer.marketValue,
      second: secondPlayer.marketValue,
      firstDisplay: `€${firstPlayer.marketValue}M`,
      secondDisplay: `€${secondPlayer.marketValue}M`,
    },
    {
      label: "Age",
      first: firstPlayer.age,
      second: secondPlayer.age,
      firstDisplay: `${firstPlayer.age}`,
      secondDisplay: `${secondPlayer.age}`,
      lowerWins: true,
    },
    {
      label: "Tavalyze Index",
      first: firstIndex,
      second: secondIndex,
      firstDisplay: `${firstIndex}`,
      secondDisplay: `${secondIndex}`,
    },
    ...(firstLive && secondLive
      ? [
          {
            label: "Appearances",
            first: firstLive.appearances,
            second: secondLive.appearances,
            firstDisplay: `${firstLive.appearances}`,
            secondDisplay: `${secondLive.appearances}`,
          },
          {
            label: "Goals",
            first: firstLive.goals,
            second: secondLive.goals,
            firstDisplay: `${firstLive.goals}`,
            secondDisplay: `${secondLive.goals}`,
          },
          {
            label: "Assists",
            first: firstLive.assists,
            second: secondLive.assists,
            firstDisplay: `${firstLive.assists}`,
            secondDisplay: `${secondLive.assists}`,
          },
          {
            label: "Minutes",
            first: firstLive.minutes,
            second: secondLive.minutes,
            firstDisplay: firstLive.minutes.toLocaleString(),
            secondDisplay: secondLive.minutes.toLocaleString(),
          },
        ]
      : []),
  ];

  function swapPlayers() {
    setFirstPlayerId(secondPlayer.id);
    setSecondPlayerId(firstPlayer.id);
  }

  async function shareBattle() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050d18] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-28 h-96 w-96 rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute -right-40 top-28 h-96 w-96 rounded-full bg-green-500/10 blur-[110px]" />
        <div className="battle-grid absolute inset-0 opacity-20" />
      </div>

      <section className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <header className="text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
            Tavalyze Battle Lab
          </div>
          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            Who wins the{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-white to-green-300 bg-clip-text text-transparent">
              battle?
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 md:text-lg">
            Put any two stars head-to-head. Tavalyze weighs market value, age
            profile and verified data coverage to create an instant battle index.
          </p>
          <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-400">
            <span
              className={`h-2 w-2 rounded-full ${
                firstLive && secondLive
                  ? "bg-green-400"
                  : loadingStats
                    ? "animate-pulse bg-amber-300"
                    : "bg-slate-600"
              }`}
            />
            {firstLive && secondLive
              ? `Live 2024 stats · ${firstLive.source}`
              : loadingStats
                ? "Loading verified 2024 stats…"
                : "Profile comparison ready"}
          </div>
        </header>

        <div className="mt-10 grid items-end gap-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl md:grid-cols-[1fr_auto_1fr]">
          <PlayerSelect
            label="Challenger one"
            value={firstPlayer.id}
            excludedId={secondPlayer.id}
            onChange={setFirstPlayerId}
          />
          <button
            type="button"
            onClick={swapPlayers}
            aria-label="Swap players"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-2xl text-cyan-200 transition hover:rotate-180 hover:border-cyan-300 hover:bg-cyan-300/20"
          >
            ⇄
          </button>
          <PlayerSelect
            label="Challenger two"
            value={secondPlayer.id}
            excludedId={firstPlayer.id}
            onChange={setSecondPlayerId}
          />
        </div>

        <section className="relative mt-8 grid gap-4 md:grid-cols-[1fr_160px_1fr] md:items-stretch">
          <BattlePlayer player={firstPlayer} score={firstIndex} side="left" />
          <div className="relative z-10 flex items-center justify-center py-2">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#050d18] bg-gradient-to-br from-cyan-300 to-green-400 text-3xl font-black italic text-slate-950 shadow-[0_0_60px_rgba(34,211,238,0.35)] md:h-32 md:w-32 md:text-4xl">
              VS
            </div>
          </div>
          <BattlePlayer player={secondPlayer} score={secondIndex} side="right" />
        </section>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Battle verdict
              </p>
              <h2 className="mt-1 text-2xl font-black">
                {winner ? (
                  <>
                    <span className="text-green-300">{winner.name}</span> takes
                    the lead
                  </>
                ) : (
                  "This battle is level"
                )}
              </h2>
            </div>
            <button
              type="button"
              onClick={shareBattle}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold transition hover:border-green-300/40 hover:bg-green-300/10 hover:text-green-200"
            >
              {copied ? "Link copied ✓" : "Share this battle ↗"}
            </button>
          </div>

          <div className="space-y-1 p-4 md:p-6">
            {metrics.map((metric) => (
              <MetricBattle key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InsightCard
            eyebrow="Value leader"
            title={
              firstPlayer.marketValue >= secondPlayer.marketValue
                ? firstPlayer.name
                : secondPlayer.name
            }
            body={`The higher current Tavalyze estimate is €${Math.max(
              firstPlayer.marketValue,
              secondPlayer.marketValue,
            )}M.`}
          />
          <InsightCard
            eyebrow="Future upside"
            title={firstPlayer.age <= secondPlayer.age ? firstPlayer.name : secondPlayer.name}
            body="The younger age profile receives the stronger potential weighting in this battle."
          />
          <InsightCard
            eyebrow="Data confidence"
            title={
              firstLive && secondLive
                ? "Live stats verified"
                : "Mixed coverage"
            }
            body={
              firstLive && secondLive
                ? `${firstLive.season} season performance comes from API-Football. Market values remain clearly labelled Tavalyze estimates.`
                : "Player identities are linked to API-Football; verified performance is loading or unavailable."
            }
          />
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-slate-600">
          The Tavalyze Index is an experimental comparison score—not a transfer
          fee, professional scouting grade or prediction. It currently combines
          estimated value, age profile and verified data coverage.
        </p>
      </section>
    </main>
  );
}

function PlayerSelect({
  label,
  value,
  excludedId,
  onChange,
}: {
  label: string;
  value: string;
  excludedId: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#0d1929] px-5 py-4 font-bold text-white outline-none transition focus:border-cyan-400/60"
      >
        {players.map((player) => (
          <option key={player.id} value={player.id} disabled={player.id === excludedId}>
            {player.name} — {player.club}
          </option>
        ))}
      </select>
    </label>
  );
}

function BattlePlayer({
  player,
  score,
  side,
}: {
  player: Player;
  score: number;
  side: "left" | "right";
}) {
  const accent =
    side === "left"
      ? "border-cyan-400/25 from-cyan-400/15"
      : "border-green-400/25 from-green-400/15";

  return (
    <Link
      href={`/players/${player.id}`}
      className={`group relative overflow-hidden rounded-[2rem] border bg-gradient-to-b ${accent} to-transparent p-5 transition hover:-translate-y-1 hover:border-white/30 md:p-7`}
    >
      <div className="absolute right-5 top-5 z-10 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-center backdrop-blur">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Index
        </p>
        <p className="text-3xl font-black">{score}</p>
      </div>
      <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-b from-white/10 to-transparent md:h-96">
        <Image
          src={player.image}
          alt={player.name}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-contain p-3 transition duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#091321] to-transparent" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {player.position} · {player.nationality}
      </p>
      <h2 className="mt-2 text-3xl font-black md:text-4xl">{player.name}</h2>
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-slate-400">{player.club}</p>
        <p className="text-2xl font-black">€{player.marketValue}M</p>
      </div>
    </Link>
  );
}

function MetricBattle({ metric }: { metric: BattleMetric }) {
  const max = Math.max(metric.first, metric.second, 1);
  const firstWidth = (metric.first / max) * 100;
  const secondWidth = (metric.second / max) * 100;
  const firstWins = metric.lowerWins
    ? metric.first < metric.second
    : metric.first > metric.second;
  const secondWins = metric.lowerWins
    ? metric.second < metric.first
    : metric.second > metric.first;

  return (
    <div className="rounded-2xl px-3 py-4 transition hover:bg-white/[0.03] md:px-5">
      <div className="grid grid-cols-[72px_1fr_110px_1fr_72px] items-center gap-3 md:grid-cols-[110px_1fr_160px_1fr_110px]">
        <p className={`font-black ${firstWins ? "text-cyan-300" : "text-white"}`}>
          {metric.firstDisplay}
        </p>
        <div className="flex h-2 justify-end overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-200"
            style={{ width: `${firstWidth}%` }}
          />
        </div>
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 md:text-xs">
          {metric.label}
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-200 to-green-500"
            style={{ width: `${secondWidth}%` }}
          />
        </div>
        <p className={`text-right font-black ${secondWins ? "text-green-300" : "text-white"}`}>
          {metric.secondDisplay}
        </p>
      </div>
    </div>
  );
}

function InsightCard({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
    </div>
  );
}
