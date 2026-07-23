import Link from "next/link";
import ApiFootballPlayerSearch from "@/components/ApiFootballPlayerSearch";

const levels = [
  {
    name: "Verified",
    color: "green",
    description:
      "A fact checked against an official club, league or governing-body announcement. A direct source link and check date should be shown.",
  },
  {
    name: "Sourced estimate",
    color: "blue",
    description:
      "An estimate published by a named third-party data provider. Market value is an opinion, not the same as a transfer fee.",
  },
  {
    name: "Demo data",
    color: "amber",
    description:
      "Temporary information used to build and test the product. It must not be presented as current or authoritative.",
  },
  {
    name: "Modelled",
    color: "purple",
    description:
      "A Tavalyze output calculated from documented inputs and assumptions. It is a scenario—not a confirmed future event.",
  },
];

const colorClasses: Record<string, string> = {
  green: "border-green-500/30 bg-green-500/10 text-green-400",
  blue: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  purple: "border-purple-400/30 bg-purple-400/10 text-purple-300",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
          Trust & transparency
        </p>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">
          Data Sources & Methodology
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
          Tavalyze is currently an MVP. This page explains what is verified,
          what comes from another provider and what exists only to demonstrate
          the future product.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {levels.map((level) => (
            <article
              key={level.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${colorClasses[level.color]}`}
              >
                {level.name}
              </span>
              <p className="mt-5 leading-7 text-gray-400">{level.description}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-7 md:p-9">
          <h2 className="text-3xl font-bold">What the current MVP does</h2>
          <ul className="mt-6 space-y-4 leading-7 text-gray-400">
            <li>
              <strong className="text-white">Player and team facts:</strong>{" "}
              mostly a manually entered demo dataset. Profiles without source
              links should be treated as unverified.
            </li>
            <li>
              <strong className="text-white">Market values:</strong> manually
              entered estimates. A sourced value shows the provider and date;
              it is never the same thing as a confirmed transfer fee.
            </li>
            <li>
              <strong className="text-white">Value forecasts:</strong> a simple
              age-based demo model with base, upside and downside scenarios.
            </li>
            <li>
              <strong className="text-white">Club Fit:</strong> a prototype
              score using position, age, estimated value and manually defined
              club profiles. It does not use live rumors or verified squad needs.
            </li>
          </ul>
        </section>

        <section className="mt-10 rounded-3xl border border-green-500/20 bg-green-500/5 p-7 md:p-9">
          <h2 className="text-3xl font-bold">Path to real predictions</h2>
          <ol className="mt-6 grid gap-4 text-gray-300 md:grid-cols-2">
            <li className="rounded-2xl bg-black/20 p-5">1. Connect licensed football and contract data.</li>
            <li className="rounded-2xl bg-black/20 p-5">2. Store source, timestamp and confidence per field.</li>
            <li className="rounded-2xl bg-black/20 p-5">3. Train and back-test models on historical transfers.</li>
            <li className="rounded-2xl bg-black/20 p-5">4. Publish accuracy and calibration results.</li>
          </ol>
        </section>

        <section className="mt-10 rounded-3xl border border-sky-400/20 bg-sky-400/5 p-7 md:p-9">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
            Real-data connection
          </p>
          <h2 className="mt-2 text-3xl font-bold">API-Football adapter ready</h2>
          <p className="mt-4 max-w-3xl leading-7 text-gray-400">
            Tavalyze now has a server-only connection layer for player profiles,
            statistics, squads and transfers. The secret key is never sent to
            the browser.
          </p>

          <ol className="mt-6 space-y-3 text-gray-300">
            <li>1. Create a free API-Football account.</li>
            <li>
              2. Copy <code className="rounded bg-black/30 px-2 py-1 text-sky-200">.env.example</code> to{" "}
              <code className="rounded bg-black/30 px-2 py-1 text-sky-200">.env.local</code>.
            </li>
            <li>
              3. Add the key as <code className="rounded bg-black/30 px-2 py-1 text-sky-200">API_FOOTBALL_KEY</code> and restart the development server.
            </li>
            <li>
              4. Open <code className="rounded bg-black/30 px-2 py-1 text-sky-200">/api/football/status</code> to verify the connection.
            </li>
          </ol>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="https://www.api-football.com/pricing"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-sky-400 px-5 py-3 font-semibold text-[#07111f] transition hover:bg-sky-300"
            >
              Get API access
            </a>
            <a
              href="https://www.api-football.com/documentation-v3"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-gray-300 transition hover:text-white"
            >
              Official documentation
            </a>
          </div>

          <div className="mt-9 border-t border-white/10 pt-8">
            <h3 className="text-2xl font-bold">Test the live connection</h3>
            <p className="mt-3 max-w-3xl leading-7 text-gray-400">
              Search the API-Football player database. These profile facts come
              from the connected provider; market values still use Tavalyze&apos;s
              separately labelled estimates.
            </p>
            <ApiFootballPlayerSearch />
          </div>
        </section>

        <Link
          href="/players"
          className="mt-10 inline-flex rounded-xl bg-green-500 px-5 py-3 font-semibold text-black transition hover:bg-green-400"
        >
          Explore player data
        </Link>
      </section>
    </main>
  );
}
