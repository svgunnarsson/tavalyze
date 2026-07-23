"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { players, type Player } from "@/data/players";

type Metric = {
  label: string;
  first: string | number | undefined;
  second: string | number | undefined;
  higherWins?: boolean;
};

export default function ComparePage() {
  const [firstPlayerId, setFirstPlayerId] = useState(
    players[0]?.id ?? "",
  );
  const [secondPlayerId, setSecondPlayerId] = useState(
    players[1]?.id ?? "",
  );

  const firstPlayer = useMemo(
    () => players.find((player) => player.id === firstPlayerId) ?? players[0],
    [firstPlayerId],
  );
  const secondPlayer = useMemo(
    () => players.find((player) => player.id === secondPlayerId) ?? players[1],
    [secondPlayerId],
  );

  if (!firstPlayer || !secondPlayer) {
    return null;
  }

  const metrics: Metric[] = [
    {
      label: "Market value",
      first: `€${firstPlayer.marketValue}M`,
      second: `€${secondPlayer.marketValue}M`,
      higherWins: true,
    },
    { label: "Age", first: firstPlayer.age, second: secondPlayer.age },
    {
      label: "Height",
      first: firstPlayer.height ? `${firstPlayer.height} cm` : undefined,
      second: secondPlayer.height ? `${secondPlayer.height} cm` : undefined,
    },
    {
      label: "Preferred foot",
      first: firstPlayer.preferredFoot,
      second: secondPlayer.preferredFoot,
    },
    {
      label: "Appearances",
      first: firstPlayer.appearances,
      second: secondPlayer.appearances,
      higherWins: true,
    },
    {
      label: "Goals",
      first: firstPlayer.goals,
      second: secondPlayer.goals,
      higherWins: true,
    },
    {
      label: "Assists",
      first: firstPlayer.assists,
      second: secondPlayer.assists,
      higherWins: true,
    },
    {
      label: "Minutes",
      first: firstPlayer.minutes,
      second: secondPlayer.minutes,
      higherWins: true,
    },
  ];

  function swapPlayers() {
    setFirstPlayerId(secondPlayer.id);
    setSecondPlayerId(firstPlayer.id);
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
            Head to head
          </p>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            Compare Players
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Select any two Tavalyze players and compare their profiles side by
            side.
          </p>
        </div>

        <div className="mt-10 grid items-end gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-[1fr_auto_1fr]">
          <PlayerSelect
            label="First player"
            value={firstPlayer.id}
            excludedId={secondPlayer.id}
            onChange={setFirstPlayerId}
          />

          <button
            type="button"
            onClick={swapPlayers}
            aria-label="Swap players"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-xl text-gray-300 transition hover:border-green-500/50 hover:text-green-400"
          >
            ⇄
          </button>

          <PlayerSelect
            label="Second player"
            value={secondPlayer.id}
            excludedId={firstPlayer.id}
            onChange={setSecondPlayerId}
          />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <PlayerHeader player={firstPlayer} />
          <PlayerHeader player={secondPlayer} />
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 bg-black/20 px-5 py-4 text-sm text-gray-400 md:px-8">
            <span className="truncate font-semibold text-white">
              {firstPlayer.name}
            </span>
            <span className="px-4 text-center">Metric</span>
            <span className="truncate text-right font-semibold text-white">
              {secondPlayer.name}
            </span>
          </div>

          {metrics.map((metric) => {
            const firstWins =
              metric.higherWins &&
              typeof metric.first === "number" &&
              typeof metric.second === "number" &&
              metric.first > metric.second;
            const secondWins =
              metric.higherWins &&
              typeof metric.first === "number" &&
              typeof metric.second === "number" &&
              metric.second > metric.first;

            return (
              <div
                key={metric.label}
                className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 px-5 py-5 last:border-b-0 md:px-8"
              >
                <MetricValue value={metric.first} highlighted={firstWins} />
                <p className="w-28 px-2 text-center text-xs font-medium uppercase tracking-wide text-gray-500 md:w-40 md:text-sm">
                  {metric.label}
                </p>
                <MetricValue
                  value={metric.second}
                  highlighted={secondWins}
                  alignRight
                />
              </div>
            );
          })}
        </section>

        <p className="mt-5 text-center text-sm text-gray-500">
          Missing statistics are shown as “Not added yet” and will be populated
          when verified data is connected.
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
      <span className="mb-2 block text-sm text-gray-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#111c2d] px-5 py-4 font-semibold text-white outline-none transition focus:border-green-500/50"
      >
        {players.map((player) => (
          <option
            key={player.id}
            value={player.id}
            disabled={player.id === excludedId}
          >
            {player.name} — {player.club}
          </option>
        ))}
      </select>
    </label>
  );
}

function PlayerHeader({ player }: { player: Player }) {
  return (
    <Link
      href={`/players/${player.id}`}
      className="group rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 transition hover:border-green-500/40"
    >
      <div className="relative h-64 overflow-hidden rounded-2xl bg-black/20">
        <Image
          src={player.image}
          alt={player.name}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-contain p-4 transition duration-300 group-hover:scale-105"
          priority
        />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-500">
        {player.position} · {player.nationality}
      </p>
      <h2 className="mt-2 text-3xl font-bold">{player.name}</h2>
      <p className="mt-2 text-gray-400">{player.club}</p>
      <p className="mt-5 text-4xl font-bold">€{player.marketValue}M</p>
    </Link>
  );
}

function MetricValue({
  value,
  highlighted = false,
  alignRight = false,
}: {
  value: string | number | undefined;
  highlighted?: boolean;
  alignRight?: boolean;
}) {
  return (
    <p
      className={`${alignRight ? "text-right" : "text-left"} text-base font-bold md:text-xl ${
        highlighted ? "text-green-400" : value === undefined ? "text-gray-600" : "text-white"
      }`}
    >
      {value ?? "Not added yet"}
    </p>
  );
}
