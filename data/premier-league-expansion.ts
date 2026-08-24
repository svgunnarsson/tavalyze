import type { Player } from "@/data/players";

type PlayerRow = readonly [
  id: string,
  name: string,
  club: string,
  nationality: string,
  position: string,
  age: number,
  marketValue: number,
];

const OFFICIAL_SQUADS_URL =
  "https://www.premierleague.com/en/news/4688364/how-every-premier-league-club-could-line-up-in-202627";
const MARKET_VALUES_URL =
  "https://www.transfermarkt.com/premier-league/marktwerte/wettbewerb/GB1";

function premierLeagueSnapshot(valueSource = MARKET_VALUES_URL): Player["dataStatus"] {
  return {
    club: "verified",
    marketValue: "sourced",
    lastChecked: "2026-08-24",
    sources: [
      { label: "Premier League 2026/27 official squad list", url: OFFICIAL_SQUADS_URL },
      { label: "Market-value snapshot", url: valueSource },
    ],
  };
}

const topValueRows: PlayerRow[] = [
  ["nico-o-reilly", "Nico O'Reilly", "Manchester City", "England", "LB", 21, 70],
  ["jurrien-timber", "Jurriën Timber", "Arsenal", "Netherlands", "RB", 25, 70],
  ["kobbie-mainoo", "Kobbie Mainoo", "Manchester United", "England", "CM", 21, 70],
  ["adam-wharton", "Adam Wharton", "Crystal Palace", "England", "DM", 22, 70],
  ["junior-kroupi", "Junior Kroupi", "AFC Bournemouth", "France", "ST", 20, 70],
  ["igor-thiago", "Igor Thiago", "Brentford", "Brazil", "ST", 25, 65],
  ["cody-gakpo", "Cody Gakpo", "Liverpool", "Netherlands", "LW", 27, 60],
  ["luka-vuskovic", "Luka Vuskovic", "Brighton & Hove Albion", "Croatia", "CB", 19, 60],
  ["jan-paul-van-hecke", "Jan Paul van Hecke", "Tottenham Hotspur", "Netherlands", "CB", 26, 60],
  ["rayan", "Rayan", "AFC Bournemouth", "Brazil", "RW", 20, 60],
  ["kai-havertz", "Kai Havertz", "Arsenal", "Germany", "ST", 27, 55],
  ["riccardo-calafiori", "Riccardo Calafiori", "Arsenal", "Italy", "LB", 24, 55],
  ["iliman-ndiaye", "Iliman Ndiaye", "Everton", "Senegal", "RW", 26, 55],
  ["nick-woltemade", "Nick Woltemade", "Newcastle United", "Germany", "ST", 24, 55],
  ["carlos-baleba", "Carlos Baleba", "Brighton & Hove Albion", "Cameroon", "DM", 22, 55],
  ["jeremy-jacquet", "Jérémy Jacquet", "Liverpool", "France", "CB", 21, 55],
  ["abdukodir-khusanov", "Abdukodir Khusanov", "Manchester City", "Uzbekistan", "CB", 22, 50],
  ["noni-madueke", "Noni Madueke", "Arsenal", "England", "RW", 24, 50],
  ["matheus-nunes", "Matheus Nunes", "Manchester City", "Portugal", "RB", 27, 50],
  ["piero-hincapie", "Piero Hincapié", "Arsenal", "Ecuador", "CB", 24, 50],
  ["leny-yoro", "Leny Yoro", "Manchester United", "France", "CB", 20, 50],
  ["omar-marmoush", "Omar Marmoush", "Manchester City", "Egypt", "ST", 27, 50],
  ["bazoumana-toure", "Bazoumana Touré", "Newcastle United", "Cote d'Ivoire", "LW", 20, 50],
  ["mateus-fernandes", "Mateus Fernandes", "Tottenham Hotspur", "Portugal", "CM", 22, 50],
  ["maxence-lacroix", "Maxence Lacroix", "Chelsea", "France", "CB", 26, 50],
  ["murillo", "Murillo", "Nottingham Forest", "Brazil", "CB", 24, 50],
  ["alex-scott", "Alex Scott", "AFC Bournemouth", "England", "CM", 23, 50],
  ["ezri-konsa", "Ezri Konsa", "Arsenal", "England", "CB", 28, 45],
  ["gabriel-martinelli", "Gabriel Martinelli", "Arsenal", "Brazil", "LW", 25, 45],
  ["lisandro-martinez", "Lisandro Martínez", "Manchester United", "Argentina", "CB", 28, 45],
  ["myles-lewis-skelly", "Myles Lewis-Skelly", "Arsenal", "England", "LB", 19, 45],
  ["amad-diallo", "Amad Diallo", "Manchester United", "Cote d'Ivoire", "RW", 24, 45],
  ["james-garner", "James Garner", "Everton", "England", "DM", 25, 45],
  ["ismaila-sarr", "Ismaïla Sarr", "Crystal Palace", "Senegal", "RW", 28, 45],
  ["amadou-onana", "Amadou Onana", "Aston Villa", "Belgium", "DM", 25, 45],
  ["malick-thiaw", "Malick Thiaw", "Newcastle United", "Germany", "CB", 25, 45],
  ["tino-livramento", "Tino Livramento", "Newcastle United", "England", "RB", 23, 45],
  ["yankuba-minteh", "Yankuba Minteh", "Brighton & Hove Albion", "The Gambia", "RW", 22, 45],
  ["pedro-porro", "Pedro Porro", "Tottenham Hotspur", "Spain", "RB", 26, 45],
  ["ousmane-diomande", "Ousmane Diomande", "Nottingham Forest", "Cote d'Ivoire", "CB", 22, 42],
  ["geovany-quenda", "Geovany Quenda", "Chelsea", "Portugal", "RW", 19, 42],
  ["brian-brobbey", "Brian Brobbey", "Sunderland", "Netherlands", "ST", 24, 40],
  ["michael-kayode", "Michael Kayode", "Brentford", "Italy", "RB", 22, 40],
  ["mamadou-sangare", "Mamadou Sangaré", "Brentford", "Mali", "CM", 24, 40],
  ["rayan-ait-nouri", "Rayan Aït-Nouri", "Manchester City", "Algeria", "LB", 25, 40],
  ["nico-gonzalez", "Nico González", "Manchester City", "Spain", "DM", 24, 40],
  ["boubacar-kamara", "Boubacar Kamara", "Aston Villa", "France", "DM", 26, 40],
  ["joao-gomes", "João Gomes", "Aston Villa", "Brazil", "CM", 25, 40],
  ["xavi-simons", "Xavi Simons", "Tottenham Hotspur", "Netherlands", "CAM", 23, 40],
  ["cristhian-mosquera", "Cristhian Mosquera", "Arsenal", "Spain", "CB", 22, 40],
  ["lewis-hall", "Lewis Hall", "Newcastle United", "England", "LB", 21, 40],
  ["jarrad-branthwaite", "Jarrad Branthwaite", "Everton", "England", "CB", 24, 40],
  ["jorgen-strand-larsen", "Jørgen Strand Larsen", "Crystal Palace", "Norway", "ST", 26, 40],
  ["andrey-santos", "Andrey Santos", "Manchester United", "Brazil", "DM", 22, 40],
  ["youri-tielemans", "Youri Tielemans", "Manchester United", "Belgium", "CM", 29, 40],
  ["marcus-rashford", "Marcus Rashford", "Manchester United", "England", "LW", 28, 40],
  ["nicolas-jackson", "Nicolas Jackson", "Chelsea", "Senegal", "ST", 25, 40],
  ["christos-tzolis", "Christos Tzolis", "Arsenal", "Greece", "LW", 24, 40],
];

const coverageRows: Array<PlayerRow & { readonly valueSource: string }> = [
  Object.assign(
    ["milan-van-ewijk", "Milan van Ewijk", "Coventry City", "Netherlands", "RB", 25, 22] as const,
    { valueSource: "https://www.transfermarkt.com/coventry-city/kader/verein/990/saison_id/2026" },
  ),
  Object.assign(
    ["gonzalo-garcia", "Gonzalo García", "Fulham", "Spain", "ST", 22, 30] as const,
    { valueSource: "https://www.transfermarkt.com/gonzalo/marktwertverlauf/spieler/935230" },
  ),
  Object.assign(
    ["konstantinos-tzolakis", "Konstantinos Tzolakis", "Hull City", "Greece", "GK", 23, 18] as const,
    { valueSource: "https://www.transfermarkt.com/konstantinos-tzolakis/marktwertverlauf/spieler/554389" },
  ),
  Object.assign(
    ["daizen-maeda", "Daizen Maeda", "Ipswich Town", "Japan", "LW", 28, 13] as const,
    { valueSource: "https://www.transfermarkt.com/daizen-maeda/marktwertverlauf/spieler/420931" },
  ),
  Object.assign(
    ["ethan-ampadu", "Ethan Ampadu", "Leeds United", "Wales", "DM", 25, 30] as const,
    { valueSource: "https://www.transfermarkt.com/leeds-united/kader/verein/399/saison_id/2026/plus/1" },
  ),
];

function playerFromRow(row: PlayerRow, valueSource?: string): Player {
  const [id, name, club, nationality, position, age, marketValue] = row;
  return {
    id,
    name,
    club,
    league: "Premier League",
    nationality,
    position,
    age,
    marketValue,
    dataStatus: premierLeagueSnapshot(valueSource),
  };
}

export const premierLeagueExpansion: Player[] = [
  ...topValueRows.map((row) => playerFromRow(row)),
  ...coverageRows.map((row) => playerFromRow(row, row.valueSource)),
];
