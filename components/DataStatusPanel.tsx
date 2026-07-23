import type { Player } from "@/data/players";

export default function DataStatusPanel({ player }: { player: Player }) {
  const clubVerified = player.dataStatus?.club === "verified";
  const valueSourced = player.dataStatus?.marketValue === "sourced";

  return (
    <aside className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge verified={clubVerified}>
          Club {clubVerified ? "verified" : "demo data"}
        </StatusBadge>
        <StatusBadge verified={valueSourced}>
          Value {valueSourced ? "sourced" : "demo estimate"}
        </StatusBadge>
        <StatusBadge verified={false}>Forecast modelled</StatusBadge>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {player.dataStatus?.lastChecked
            ? `Sources last checked ${player.dataStatus.lastChecked}`
            : "This profile has not been source-verified yet."}
        </p>
        <a href="/methodology" className="font-semibold text-green-400 hover:text-green-300">
          How Tavalyze labels data →
        </a>
      </div>

      {player.dataStatus?.sources && player.dataStatus.sources.length > 0 && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Sources
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {player.dataStatus.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-300 underline decoration-white/20 underline-offset-4 hover:text-white"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

function StatusBadge({
  verified,
  children,
}: {
  verified: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        verified
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : "border-amber-400/30 bg-amber-400/10 text-amber-300"
      }`}
    >
      <span aria-hidden="true">{verified ? "✓" : "◇"}</span>
      {children}
    </span>
  );
}
