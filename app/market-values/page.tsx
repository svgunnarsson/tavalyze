 import Image from "next/image";
import Link from "next/link";
import { players } from "@/data/players";

export default function MarketValuesPage() {
  const rankedPlayers = [...players].sort(
  (a, b) => b.marketValue - a.marketValue
);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
            Premier League
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Market Value Rankings
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            The most valuable players currently included in Tavalyze V1.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="hidden grid-cols-[70px_1fr_170px_150px] border-b border-white/10 px-6 py-4 text-sm text-gray-500 md:grid">
            <span>Rank</span>
            <span>Player</span>
            <span>Club</span>
            <span className="text-right">Market Value</span>
          </div>

          {rankedPlayers.map((player, index) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="group grid gap-4 border-b border-white/10 px-5 py-5 transition last:border-b-0 hover:bg-white/5 md:grid-cols-[70px_1fr_170px_150px] md:items-center md:px-6"
            >
              <div>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                    index === 0
                      ? "bg-yellow-400 text-black"
                      : index === 1
                        ? "bg-gray-300 text-black"
                        : index === 2
                          ? "bg-amber-700 text-white"
                          : "bg-black/20 text-gray-400"
                  }`}
                >
                  {index + 1}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-black/20">
                  <Image
                    src={player.image}
                    alt={player.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>

                <div>
                  <h2 className="font-bold transition group-hover:text-green-400">
                    {player.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {player.position} · Age {player.age}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                {player.club}
              </p>

              <div className="md:text-right">
                <p className="text-xs text-gray-500 md:hidden">
                  Market Value
                </p>

                <p className="text-2xl font-bold">
                  €{player.marketValue}M
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
