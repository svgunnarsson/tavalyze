import Link from "next/link";
import PlayerPortrait from "@/components/PlayerPortrait";
import SearchBar from "@/components/SearchBar";
import { players } from "@/data/players";

const featured = players[0];
const connectedCount = players.filter((player) => player.apiFootballId).length;
const teamCount = new Set(players.map((player) => player.club)).size;

const features = [
  {
    number: "01",
    title: "Battle Lab",
    description:
      "Put two players head-to-head across value, age profile and verified performance coverage.",
    href: "/compare",
    accent: "from-sky-400/20 to-sky-400/0",
  },
  {
    number: "02",
    title: "Value rankings",
    description:
      "Scan Tavalyze estimates with transparent source labels and player-level context.",
    href: "/market-values",
    accent: "from-green-400/20 to-green-400/0",
  },
  {
    number: "03",
    title: "Club intelligence",
    description:
      "Explore squads, aggregate values and prototype club-fit analysis in one place.",
    href: "/teams",
    accent: "from-purple-400/20 to-purple-400/0",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] text-white">
      <section className="relative border-b border-white/10">
        <div className="battle-grid absolute inset-0 opacity-70" />
        <div className="absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-green-500/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-300">
              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_14px_#4ade80]" />
              Football intelligence, built transparently
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              See the player.
              <br />
              <span className="value-shine">Understand the value.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              Tavalyze brings player comparisons, market-value estimates and
              football data into one fast, explainable experience.
            </p>

            <SearchBar className="mt-9 max-w-2xl" />

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/compare"
                className="rounded-xl bg-green-500 px-5 py-3 font-bold text-black transition hover:-translate-y-0.5 hover:bg-green-400"
              >
                Enter Battle Lab
              </Link>
              <Link
                href="/players"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Explore players
              </Link>
            </div>

            <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                [players.length, "Curated players"],
                [teamCount, "Clubs"],
                [connectedCount, "API-linked profiles"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                >
                  <dt className="text-xs text-slate-500">{label}</dt>
                  <dd className="mt-1 text-2xl font-black">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="surface-glow relative rounded-[2rem] border border-white/10 bg-[#0b1828]/90 p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                  Featured intelligence
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Tavalyze estimate · 2024 profile
                </p>
              </div>
              <span className="rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
                API linked
              </span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_1.05fr] sm:items-end">
              <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-400/10 to-black/20">
                <div className="absolute inset-x-8 bottom-3 h-8 rounded-full bg-sky-400/15 blur-xl" />
                <PlayerPortrait
                  player={featured}
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-contain object-bottom p-3"
                  priority
                />
              </div>

              <div className="pb-2">
                <p className="text-sm text-slate-400">
                  {featured.position} · {featured.club}
                </p>
                <h2 className="mt-2 text-3xl font-black">{featured.name}</h2>
                <p className="mt-6 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Estimated market value
                </p>
                <p className="mt-1 text-5xl font-black text-green-400">
                  €{featured.marketValue}M
                </p>
                <Link
                  href={`/players/${featured.id}`}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-green-300"
                >
                  Open full profile <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
              Explore the platform
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              More than a list of numbers.
            </h2>
          </div>
          <p className="max-w-lg leading-7 text-slate-400">
            Every estimate is separated from verified facts so you can explore
            confidently without mistaking a model output for a confirmed fee.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${feature.accent} p-7 transition hover:-translate-y-1 hover:border-white/20`}
            >
              <p className="font-mono text-sm text-slate-500">{feature.number}</p>
              <h3 className="mt-12 text-2xl font-black">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>
              <p className="mt-7 text-sm font-bold text-white transition group-hover:text-green-300">
                Explore feature →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Trending
            </p>
            <h2 className="mt-2 text-3xl font-black">Players to watch</h2>
          </div>
          <Link href="/players" className="text-sm text-slate-400 hover:text-white">
            View all →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {players.slice(0, 5).map((player, index) => (
            <Link
              href={`/players/${player.id}`}
              key={player.id}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/[0.06]"
            >
              <div className="relative h-44 overflow-hidden rounded-2xl bg-black/20">
                <span className="absolute left-3 top-3 z-10 font-mono text-xs text-slate-500">
                  #{String(index + 1).padStart(2, "0")}
                </span>
                <PlayerPortrait
                  player={player}
                  sizes="(max-width: 640px) 100vw, 20vw"
                  className="object-contain p-3 transition duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 font-bold">{player.name}</h3>
              <p className="mt-1 truncate text-sm text-slate-500">
                {player.position} · {player.club}
              </p>
              <p className="mt-5 text-2xl font-black">€{player.marketValue}M</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
