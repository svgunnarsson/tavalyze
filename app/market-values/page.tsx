import MarketValueTable from "@/components/MarketValueTable";

export default function MarketValuesPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
            Five-league value board
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Market Value Rankings
          </h1>

          <p className="mt-3 max-w-2xl text-gray-400">
            Compare Tavalyze&apos;s sourced and clearly labelled player-value
            snapshots across the Premier League, LaLiga, Bundesliga, Serie A
            and Ligue 1.
          </p>
        </div>

        <MarketValueTable />
      </section>
    </main>
  );
}
