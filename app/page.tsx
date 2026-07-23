import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { players } from "@/data/players";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
            Premier League MVP · Demo data
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
            Football market values, <span className="text-green-500">made smarter.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
            Tavalyze helps fans explore Premier League players, market values,
            transfers and future football intelligence tools.
          </p>

          <SearchBar className="mt-8 max-w-xl" />

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold">20</p>
              <p className="mt-1 text-sm text-gray-400">Teams</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold">550+</p>
              <p className="mt-1 text-sm text-gray-400">Players</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-bold">V1</p>
              <p className="mt-1 text-sm text-gray-400">MVP</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8">
          <div className="mb-6 flex h-72 items-center justify-center rounded-3xl border border-dashed border-white/20 bg-black/20 text-gray-500">
            Haaland image placeholder
          </div>

          <p className="text-sm font-semibold uppercase text-green-500">Featured Player</p>
          <h2 className="mt-3 text-4xl font-bold">Erling Haaland</h2>
          <p className="mt-2 text-gray-400">ST · Manchester City · Norway</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">Market Value</p>
            <p className="mt-2 text-5xl font-bold">€180M</p>
            <p className="mt-2 text-sm text-gray-500">
              Demo value — real data will be connected later
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-gray-400">Age</p>
              <p className="mt-2 text-2xl font-bold">24</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-gray-400">Position</p>
              <p className="mt-2 text-2xl font-bold">ST</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-gray-400">League</p>
              <p className="mt-2 text-2xl font-bold">EPL</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-green-500">
              Trending
            </p>
            <h2 className="mt-2 text-3xl font-bold">Trending Players</h2>
          </div>

          <p className="text-sm text-gray-500">Click any player to view profile</p>
        </div>

        <div className="grid gap-5 md:grid-cols-5">
          {players.slice(0, 5).map((player) => (
            <Link
              href={`/players/${player.id}`}
              key={player.id}
              className="group block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/10"
            >
              <div className="relative mb-5 h-40 overflow-hidden rounded-2xl bg-black/20">
  <Image
    src={player.image}
    alt={player.name}
    fill
    sizes="(max-width: 768px) 100vw, 20vw"
    className="object-contain p-2"
  />
</div>
              <h3 className="font-semibold">{player.name}</h3>

              <p className="mt-1 text-sm text-gray-400">
                {player.position} · {player.club}
              </p>

              <div className="mt-6">
                <p className="text-sm text-gray-400">Market Value</p>
                <p className="mt-1 text-2xl font-bold">€{player.marketValue}M</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>Age {player.age}</span>
                <span>View Profile →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase text-green-500">
            Coming soon
          </p>

          <h2 className="mt-3 text-3xl font-bold">Future Tavalyze features</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="font-semibold">Player Pages</h3>
              <p className="mt-2 text-sm text-gray-400">
                Full profiles for every Premier League player.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="font-semibold">Market History</h3>
              <p className="mt-2 text-sm text-gray-400">
                Track how values change over time.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="font-semibold">Transfer Tools</h3>
              <p className="mt-2 text-sm text-gray-400">
                Explore transfer probability and club fit.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="font-semibold">AI Reports</h3>
              <p className="mt-2 text-sm text-gray-400">
                AI-powered scouting reports later.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm text-gray-500">
          <p>© 2026 Tavalyze</p>
          <p>AI Football Intelligence</p>
        </div>
      </footer>
    </main>
  );
}
