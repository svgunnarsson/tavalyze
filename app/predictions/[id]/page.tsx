import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlayerPortrait from "@/components/PlayerPortrait";
import SharePredictionButton from "@/components/SharePredictionButton";
import { players } from "@/data/players";
import { getPrediction, predictions } from "@/data/predictions";

type Props = {
  params: Promise<{ id: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function generateStaticParams() {
  return predictions.map((prediction) => ({ id: prediction.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const prediction = getPrediction(id);
  const player = prediction
    ? players.find((item) => item.id === prediction.playerId)
    : undefined;

  if (!prediction || !player) return { title: "Prediction not found" };

  const title = `${player.name}: €${prediction.predictedValue}M forecast`;
  const description = `A dated Tavalyze six-month market-value forecast for ${player.name}, published with ${prediction.confidence}% model confidence.`;
  const image = `/api/og/prediction?id=${prediction.id}`;

  return {
    title,
    description,
    alternates: { canonical: `/predictions/${prediction.id}` },
    openGraph: {
      type: "article",
      url: `/predictions/${prediction.id}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PredictionReceiptPage({ params }: Props) {
  const { id } = await params;
  const prediction = getPrediction(id);
  const player = prediction
    ? players.find((item) => item.id === prediction.playerId)
    : undefined;

  if (!prediction || !player) notFound();

  const change = prediction.predictedValue - prediction.currentValue;
  const changePercent = Math.round((change / prediction.currentValue) * 100);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-14">
        <Link
          href="/predictions"
          className="text-sm font-semibold text-slate-400 hover:text-white"
        >
          ← Prediction ledger
        </Link>

        <article className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1828]">
          <div className="grid lg:grid-cols-[340px_1fr]">
            <div className="relative min-h-[380px] bg-gradient-to-b from-sky-400/10 to-black/25">
              <PlayerPortrait
                player={player}
                sizes="(max-width: 1024px) 100vw, 340px"
                className="object-contain object-bottom p-5"
                priority
              />
            </div>

            <div className="p-7 md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-200">
                  Open call
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {prediction.id}
                </span>
              </div>

              <p className="mt-7 text-sm text-slate-400">
                {player.position} · {player.club}
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
                {player.name}
              </h1>

              <div className="mt-9 flex flex-wrap items-end gap-4">
                <Value label="Published estimate" value={prediction.currentValue} />
                <span className="pb-2 text-3xl text-slate-600">→</span>
                <Value label="6-month forecast" value={prediction.predictedValue} accent />
                <span className="mb-2 rounded-lg bg-green-400/10 px-2.5 py-1.5 text-sm font-bold text-green-300">
                  {change >= 0 ? "+" : ""}{changePercent}%
                </span>
              </div>

              <p className="mt-8 max-w-2xl text-base leading-7 text-slate-400">
                {prediction.thesis}
              </p>

              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                <ReceiptFact
                  label="Published"
                  value={dateFormatter.format(new Date(prediction.publishedAt))}
                />
                <ReceiptFact
                  label="Review date"
                  value={dateFormatter.format(new Date(prediction.reviewAt))}
                />
                <ReceiptFact
                  label="Model confidence"
                  value={`${prediction.confidence}%`}
                />
              </dl>

              <div className="mt-8">
                <SharePredictionButton
                  predictionId={prediction.id}
                  playerName={player.name}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/20 p-6 text-sm leading-6 text-slate-500">
            Experimental model output—not a confirmed transfer fee, financial
            advice or guarantee. The receipt remains public after its review
            date so the call can be judged against the result.
          </div>
        </article>
      </section>
    </main>
  );
}

function Value({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <p className={`text-xs uppercase tracking-wider ${accent ? "text-green-400" : "text-slate-500"}`}>
        {label}
      </p>
      <p className={`mt-1 text-4xl font-black ${accent ? "text-green-400" : "text-white"}`}>
        €{value}M
      </p>
    </div>
  );
}

function ReceiptFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-bold text-white">{value}</dd>
    </div>
  );
}
