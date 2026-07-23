import Image from "next/image";
import Link from "next/link";
import { players } from "@/data/players";

const transfers = [
  {
    playerId: "morgan-rogers",
    fromClub: "Aston Villa",
    toClub: "Chelsea",
    fee: 137,
    date: "Summer 2026",
    type: "Permanent",
  },
  {
    playerId: "florian-wirtz",
    fromClub: "Bayer Leverkusen",
    toClub: "Liverpool",
    fee: 125,
    date: "Summer 2025",
    type: "Permanent",
  },
  {
    playerId: "viktor-gyokeres",
    fromClub: "Sporting CP",
    toClub: "Arsenal",
    fee: 75,
    date: "Summer 2025",
    type: "Permanent",
  },
  {
    playerId: "rayan-cherki",
    fromClub: "Lyon",
    toClub: "Manchester City",
    fee: 36,
    date: "Summer 2025",
    type: "Permanent",
  },
  {
    playerId: "hugo-ekitike",
    fromClub: "Eintracht Frankfurt",
    toClub: "Liverpool",
    fee: 80,
    date: "Summer 2025",
    type: "Permanent",
  },
  {
    playerId: "mohammed-kudus",
    fromClub: "West Ham United",
    toClub: "Tottenham Hotspur",
    fee: 64,
    date: "Summer 2025",
    type: "Permanent",
  },
];

export default function TransfersPage() {
  const transferRows = transfers
    .map((transfer) => {
      const player = players.find(
        (item) => item.id === transfer.playerId
      );

      if (!player) {
        return null;
      }

      return {
        ...transfer,
        player,
      };
    })
    .filter((transfer) => transfer !== null);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-500">
          Transfer Centre
        </p>

        <h1 className="mt-2 text-4xl font-bold md:text-5xl">
          Latest Transfers
        </h1>

        <p className="mt-3 max-w-2xl text-gray-400">
          Recent moves involving players currently included in Tavalyze V1.
        </p>

        <div className="mt-10 space-y-5">
          {transferRows.map((transfer) => (
            <Link
              key={transfer.player.id}
              href={`/players/${transfer.player.id}`}
              className="group grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/10 md:grid-cols-[90px_1fr_220px_140px] md:items-center"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-black/20">
                <Image
                  src={transfer.player.image}
                  alt={transfer.player.name}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold transition group-hover:text-green-400">
                  {transfer.player.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {transfer.player.position} · {transfer.player.nationality}
                </p>

                <p className="mt-3 text-sm text-gray-400">
                  {transfer.date} · {transfer.type}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Transfer</p>

                <p className="mt-2 font-semibold">
                  {transfer.fromClub}
                </p>

                <p className="my-1 text-green-500">↓</p>

                <p className="font-semibold">
                  {transfer.toClub}
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-sm text-gray-500">Transfer Fee</p>

                <p className="mt-2 text-3xl font-bold">
                  €{transfer.fee}M
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
