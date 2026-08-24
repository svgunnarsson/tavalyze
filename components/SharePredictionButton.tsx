"use client";

import { useState } from "react";

export default function SharePredictionButton({
  predictionId,
  playerName,
}: {
  predictionId: string;
  playerName: string;
}) {
  const [copied, setCopied] = useState(false);

  async function sharePrediction() {
    const url = `${window.location.origin}/predictions/${predictionId}`;
    const shareData = {
      title: `${playerName} value forecast | Tavalyze`,
      text: `See Tavalyze's dated six-month market-value forecast for ${playerName}.`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`/api/og/prediction?id=${predictionId}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
      >
        Open image
      </a>
      <button
        type="button"
        onClick={sharePrediction}
        className="rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-green-400"
      >
        {copied ? "Link copied" : "Share forecast"}
      </button>
    </div>
  );
}
