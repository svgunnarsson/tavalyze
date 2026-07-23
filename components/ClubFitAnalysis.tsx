import type { Player } from "@/data/players";

type ClubProfile = {
  name: string;
  league: string;
  preferredPositions: string[];
  maxTargetValue: number;
  youthFocus: number;
  style: string;
};

const clubProfiles: ClubProfile[] = [
  {
    name: "Arsenal",
    league: "Premier League",
    preferredPositions: ["ST", "RW", "CM", "DM"],
    maxTargetValue: 170,
    youthFocus: 8,
    style: "possession and structured pressing",
  },
  {
    name: "Chelsea",
    league: "Premier League",
    preferredPositions: ["CAM", "RW", "CB", "ST"],
    maxTargetValue: 180,
    youthFocus: 10,
    style: "young, high-upside squad building",
  },
  {
    name: "Liverpool",
    league: "Premier League",
    preferredPositions: ["CM", "DM", "RW", "CB"],
    maxTargetValue: 175,
    youthFocus: 8,
    style: "vertical attacks and aggressive pressing",
  },
  {
    name: "Manchester City",
    league: "Premier League",
    preferredPositions: ["CAM", "CM", "CB", "RW"],
    maxTargetValue: 200,
    youthFocus: 7,
    style: "technical dominance and positional play",
  },
  {
    name: "Real Madrid",
    league: "LaLiga",
    preferredPositions: ["ST", "RW", "CM", "CB"],
    maxTargetValue: 240,
    youthFocus: 8,
    style: "elite transition play and individual quality",
  },
  {
    name: "Barcelona",
    league: "LaLiga",
    preferredPositions: ["DM", "CAM", "LW", "CB"],
    maxTargetValue: 165,
    youthFocus: 9,
    style: "technical possession and academy-led development",
  },
  {
    name: "Bayern Munich",
    league: "Bundesliga",
    preferredPositions: ["ST", "CAM", "CB", "RW"],
    maxTargetValue: 165,
    youthFocus: 7,
    style: "high pressing and sustained attacking pressure",
  },
  {
    name: "Borussia Dortmund",
    league: "Bundesliga",
    preferredPositions: ["ST", "CAM", "RW", "CB"],
    maxTargetValue: 105,
    youthFocus: 10,
    style: "fast development and direct attacking football",
  },
  {
    name: "Paris Saint-Germain",
    league: "Ligue 1",
    preferredPositions: ["LW", "RW", "CAM", "CM"],
    maxTargetValue: 210,
    youthFocus: 7,
    style: "technical attackers and dominant possession",
  },
  {
    name: "Inter Milan",
    league: "Serie A",
    preferredPositions: ["ST", "CB", "CM", "DM"],
    maxTargetValue: 115,
    youthFocus: 6,
    style: "tactical structure and wing-back progression",
  },
];

function stableVariation(playerId: string, clubName: string) {
  const input = `${playerId}-${clubName}`;
  return (
    input.split("").reduce((total, character) => total + character.charCodeAt(0), 0) %
    8
  );
}

function getFitScore(player: Player, club: ClubProfile) {
  const positionFit = club.preferredPositions.includes(player.position) ? 38 : 19;
  const affordability = Math.max(
    4,
    Math.min(25, 25 * (club.maxTargetValue / Math.max(player.marketValue, 1))),
  );
  const idealYouthScore = player.age <= 24 ? club.youthFocus * 1.7 : 12;
  const leagueAdaptation = club.league === player.league ? 9 : 6;
  const variation = stableVariation(player.id, club.name);

  return Math.min(
    96,
    Math.round(positionFit + affordability + idealYouthScore + leagueAdaptation + variation),
  );
}

export default function ClubFitAnalysis({ player }: { player: Player }) {
  const matches = clubProfiles
    .filter((club) => club.name !== player.club)
    .map((club) => ({ club, score: getFitScore(player, club) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const moveChance = player.age <= 23 ? 28 : player.age <= 28 ? 34 : 39;
  const stayChance = 100 - moveChance;

  return (
    <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
            Tavalyze fit model
          </p>
          <h2 className="mt-2 text-3xl font-bold">Club Fit & Transfer Outlook</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
            Demo analysis using position, age, estimated value, buying capacity
            and development profile. Scores are modelled scenarios—not transfer
            rumors.
          </p>
        </div>

        <div className="grid min-w-full grid-cols-2 gap-3 sm:min-w-80 lg:min-w-96">
          <OutlookCard label={`Stay at ${player.club}`} value={stayChance} />
          <OutlookCard label="Move in next 12 months" value={moveChance} />
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {matches.map((match, index) => (
          <article
            key={match.club.name}
            className="rounded-2xl border border-white/10 bg-black/20 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {index === 0 ? "Best fit" : `Candidate ${index + 1}`}
                </p>
                <h3 className="mt-2 text-xl font-bold">{match.club.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{match.club.league}</p>
              </div>
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-right">
                <p className="text-xs text-green-400">Fit score</p>
                <p className="text-2xl font-bold text-white">{match.score}%</p>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${match.score}%` }}
              />
            </div>

            <ul className="mt-5 space-y-2 text-sm leading-6 text-gray-400">
              <li>• Tactical fit: {match.club.style}</li>
              <li>
                • Position demand: {match.club.preferredPositions.includes(player.position) ? "strong" : "moderate"}
              </li>
              <li>
                • Value capacity: {player.marketValue <= match.club.maxTargetValue ? "within model range" : "stretch target"}
              </li>
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-5 py-4 text-sm text-gray-500">
        Model v0.1 does not yet use contracts, injuries, verified squad needs,
        wage budgets or live reporting. Those inputs will replace these demo
        assumptions later.
      </div>
    </section>
  );
}

function OutlookCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs leading-5 text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}%</p>
    </div>
  );
}
