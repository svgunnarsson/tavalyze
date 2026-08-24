import { players } from "@/data/players";
import { projectMarketValue } from "@/lib/market-value-forecast";

export type PredictionStatus = "open" | "hit" | "miss";

export type Prediction = {
  id: string;
  playerId: string;
  publishedAt: string;
  reviewAt: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  status: PredictionStatus;
  thesis: string;
};

const predictionSeeds = [
  {
    playerId: "lamine-yamal",
    confidence: 82,
    thesis: "Elite production at a rare age keeps the upside case unusually strong.",
  },
  {
    playerId: "erling-haaland",
    confidence: 76,
    thesis: "Prime-age scoring output supports value stability near the top of the market.",
  },
  {
    playerId: "florian-wirtz",
    confidence: 74,
    thesis: "Age profile and creative output leave room for another valuation step.",
  },
  {
    playerId: "morgan-rogers",
    confidence: 72,
    thesis: "A larger role and continued end product could accelerate his value curve.",
  },
  {
    playerId: "cole-palmer",
    confidence: 71,
    thesis: "Sustained chance creation would reinforce his position among elite attackers.",
  },
  {
    playerId: "jamal-musiala",
    confidence: 70,
    thesis: "High-level ball progression and age keep long-term demand strong.",
  },
  {
    playerId: "rayan-cherki",
    confidence: 67,
    thesis: "Creative upside is high, while role consistency remains the main swing factor.",
  },
  {
    playerId: "alexander-isak",
    confidence: 65,
    thesis: "Finishing quality supports the estimate, balanced by a mature age curve.",
  },
] as const;

export const predictions: Prediction[] = predictionSeeds.flatMap((seed) => {
  const player = players.find((item) => item.id === seed.playerId);

  if (!player) return [];

  return [
    {
      id: `${player.id}-2026-08`,
      playerId: player.id,
      publishedAt: "2026-08-24",
      reviewAt: "2027-02-24",
      currentValue: player.marketValue,
      predictedValue: projectMarketValue(
        player.marketValue,
        player.age,
        6,
        "base",
      ),
      confidence: seed.confidence,
      status: "open" as const,
      thesis: seed.thesis,
    },
  ];
});

export function getPrediction(id: string) {
  return predictions.find((prediction) => prediction.id === id);
}
