import type { Metadata } from "next";
import Link from "next/link";
import PlayerPortrait from "@/components/PlayerPortrait";
import SharePredictionButton from "@/components/SharePredictionButton";
import { players } from "@/data/players";
import { predictions } from "@/data/predictions";

export const metadata: Metadata = {
  title: "Prediction Ledger",
  description:
    "Dated, reviewable Tavalyze football market-value forecasts with transparent confidence and methodology.",
  alternates: { canonical: "/predictions" },
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export default function PredictionsPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="battle-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-sky-400/25 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-200">
              Public prediction record
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-[-0.04em] md:text-7xl">
              Predictions with receipts.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Every forecast is stamped, explained and scheduled for review.
              Open calls stay visible—whether they eventually hit or miss.
            </p>
          </div>

          <dl className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            <LedgerStat label="Open forecasts" value={predictions.length} />
            <LedgerStat label="Forecast horizon" value="6 months" />
            <LedgerStat label="Current model" value="v0.1" />
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
              The ledger
            </p>
            <h2 className="mt-2 text-3xl font-black">Latest market calls</h2>
          </div>
          <Link
            href="/methodology"
            className="text-sm font-semibold text-slate-400 hover:text-white"
          >
            Read the methodology →
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {predictions.map((prediction) => {
            const player = players.find(
              (item) => item.id === prediction.playerId,
            );

            if (!player) return null;

            const change = prediction.predictedValue - prediction.currentValue;
            const changePercent = Math.round(
              (change / prediction.currentValue) * 100,
            );

            return (
              <article
                id={prediction.id}
                key={prediction.id}
                className="scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
              >
                <div className="grid sm:grid-cols-[170px_1fr]">
                  <Link
                    href={`/players/${player.id}`}
                    className="relative min-h-48 bg-gradient-to-b from-sky-400/10 to-black/20"
                  >
                    <PlayerPortrait
                      player={player}
                      sizes="(max-width: 640px) 100vw, 170px"
                      className="object-contain object-bottom p-3"
                    />
                  </Link>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">
                        Open call
                      </span>
                      <span className="text-xs text-slate-500">
                        Published {dateFormatter.format(new Date(prediction.publishedAt))}
                      </span>
                    </div>

                    <Link href={`/players/${player.id}`}>
                      <h3 className="mt-5 text-2xl font-black hover:text-green-300">
                        {player.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">
                      {player.position} · {player.club}
                    </p>

                    <div className="mt-6 flex items-end gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Today
                        </p>
                        <p className="mt-1 text-2xl font-black">
                          €{prediction.currentValue}M
                        </p>
                      </div>
                      <span className="pb-1 text-xl text-slate-600">→</span>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-green-400">
                          6-month call
                        </p>
                        <p className="mt-1 text-3xl font-black text-green-400">
                          €{prediction.predictedValue}M
                        </p>
                      </div>
                      <span className="mb-1 rounded-lg bg-green-400/10 px-2 py-1 text-xs font-bold text-green-300">
                        {change >= 0 ? "+" : ""}{changePercent}%
                      </span>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-400">
                      {prediction.thesis}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <div>
                        <p className="text-xs text-slate-500">Model confidence</p>
                        <p className="mt-1 font-bold">{prediction.confidence}%</p>
                      </div>
                      <SharePredictionButton
                        predictionId={prediction.id}
                        playerName={player.name}
                      />
                    </div>
                    <Link
                      href={`/predictions/${prediction.id}`}
                      className="mt-4 inline-flex text-sm font-bold text-sky-300 hover:text-sky-200"
                    >
                      Open prediction receipt →
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-black/15 px-6 py-4 text-xs text-slate-500">
                  <span>Review date: {dateFormatter.format(new Date(prediction.reviewAt))}</span>
                  <span>Receipt ID: {prediction.id}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-amber-300/20 bg-amber-300/5 p-6 text-sm leading-6 text-slate-400">
          Tavalyze forecasts are experimental model outputs—not confirmed fees,
          financial advice or guarantees. Model v0.1 currently uses only value
          and age assumptions; future versions will add form, contracts,
          injuries and transfer demand.
        </div>
      </section>
    </main>
  );
}

function LedgerStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-black">{value}</dd>
    </div>
  );
}
