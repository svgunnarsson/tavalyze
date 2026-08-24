export type ForecastScenario = "base" | "upside" | "downside";

export const forecastScenarioDetails: Record<
  ForecastScenario,
  { label: string; color: string; adjustment: number }
> = {
  base: { label: "Base case", color: "#22c55e", adjustment: 0 },
  upside: { label: "Upside", color: "#38bdf8", adjustment: 0.15 },
  downside: { label: "Downside", color: "#fb7185", adjustment: -0.18 },
};

export function getBaseAnnualRate(age: number) {
  if (age <= 21) return 0.15;
  if (age <= 24) return 0.1;
  if (age <= 27) return 0.05;
  if (age <= 30) return 0;
  return -0.08;
}

export function projectMarketValue(
  value: number,
  age: number,
  months: number,
  scenario: ForecastScenario = "base",
) {
  const annualRate =
    getBaseAnnualRate(age) + forecastScenarioDetails[scenario].adjustment;

  return Math.max(
    1,
    Math.round(value * (1 + annualRate * (months / 12))),
  );
}
