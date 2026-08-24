"use client";

import { useMemo, useState } from "react";
import {
  forecastScenarioDetails,
  projectMarketValue,
  type ForecastScenario,
} from "@/lib/market-value-forecast";

export default function MarketValueForecast({
  playerName,
  currentValue,
  age,
}: {
  playerName: string;
  currentValue: number;
  age: number;
}) {
  const [scenario, setScenario] = useState<ForecastScenario>("base");
  const detail = forecastScenarioDetails[scenario];

  const points = useMemo(() => {
    return [0, 3, 6, 12].map((months) => ({
      months,
      value: projectMarketValue(currentValue, age, months, scenario),
    }));
  }, [age, currentValue, scenario]);

  const values = points.map((point) => point.value);
  const minimum = Math.max(0, Math.min(...values) * 0.85);
  const maximum = Math.max(...values) * 1.15;
  const range = Math.max(1, maximum - minimum);
  const chartPoints = points.map((point, index) => ({
    ...point,
    x: 52 + index * 205,
    y: 220 - ((point.value - minimum) / range) * 170,
  }));
  const polylinePoints = chartPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
  const sixMonthValue = points.find((point) => point.months === 6)?.value;
  const twelveMonthValue = points.find((point) => point.months === 12)?.value;

  return (
    <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
            Tavalyze forecast
          </p>
          <h2 className="mt-2 text-3xl font-bold">Market Value Projection</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Illustrative demo forecast based on current value, age and the
            selected scenario. It is not financial advice or verified market
            data.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" aria-label="Forecast scenario">
          {(Object.keys(forecastScenarioDetails) as ForecastScenario[]).map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() => setScenario(option)}
                aria-pressed={scenario === option}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  scenario === option
                    ? "border-green-500/40 bg-green-500/15 text-white"
                    : "border-white/10 bg-black/20 text-gray-400 hover:text-white"
                }`}
              >
                {forecastScenarioDetails[option].label}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ForecastStat label="Current" value={currentValue} />
        <ForecastStat label="6 months" value={sixMonthValue ?? currentValue} />
        <ForecastStat label="12 months" value={twelveMonthValue ?? currentValue} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-4">
        <svg
          viewBox="0 0 720 270"
          role="img"
          aria-label={`${detail.label} market value projection for ${playerName}`}
          className="min-w-[620px]"
        >
          <defs>
            <linearGradient id="forecast-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={detail.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={detail.color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[50, 105, 160, 215].map((y) => (
            <line
              key={y}
              x1="42"
              x2="687"
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="5 7"
            />
          ))}

          <polygon
            points={`52,220 ${polylinePoints} 667,220`}
            fill="url(#forecast-area)"
          />
          <polyline
            points={polylinePoints}
            fill="none"
            stroke={detail.color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartPoints.map((point) => (
            <g key={point.months}>
              <circle
                cx={point.x}
                cy={point.y}
                r="7"
                fill="#07111f"
                stroke={detail.color}
                strokeWidth="4"
              />
              <text
                x={point.x}
                y={point.y - 18}
                textAnchor="middle"
                fill="white"
                fontSize="15"
                fontWeight="700"
              >
                €{point.value}M
              </text>
              <text
                x={point.x}
                y="252"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="14"
              >
                {point.months === 0 ? "Today" : `${point.months} months`}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-500">
        Model v0.1 changes only age-related growth assumptions. Performance,
        injuries, contracts and transfer demand are not connected yet.
      </p>
    </section>
  );
}

function ForecastStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">€{value}M</p>
    </div>
  );
}
