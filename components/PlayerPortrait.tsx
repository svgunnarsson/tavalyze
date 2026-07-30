import Image from "next/image";
import type { Player } from "@/data/players";

type PlayerPortraitProps = {
  player: Pick<Player, "name" | "image">;
  sizes: string;
  className?: string;
  priority?: boolean;
};

const portraitPalettes = [
  ["#0ea5e9", "#0f172a"],
  ["#22c55e", "#052e16"],
  ["#a855f7", "#1e1b4b"],
  ["#f59e0b", "#451a03"],
  ["#f43f5e", "#4c0519"],
] as const;

function playerInitials(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
}

function paletteFor(name: string) {
  const score = Array.from(name).reduce(
    (total, character) => total + character.codePointAt(0)!,
    0,
  );

  return portraitPalettes[score % portraitPalettes.length];
}

export default function PlayerPortrait({
  player,
  sizes,
  className = "",
  priority = false,
}: PlayerPortraitProps) {
  if (player.image) {
    return (
      <Image
        src={player.image}
        alt={player.name}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  const [accent, base] = paletteFor(player.name);

  return (
    <span
      aria-label={`${player.name} portrait placeholder`}
      role="img"
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 28%, ${accent}55 0%, ${base} 68%)`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -bottom-16 h-44 w-44 rounded-full opacity-25 blur-2xl"
        style={{ backgroundColor: accent }}
      />
      <span
        aria-hidden="true"
        className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-black/25 text-3xl font-black tracking-tight text-white shadow-2xl backdrop-blur"
      >
        {playerInitials(player.name)}
      </span>
    </span>
  );
}
