import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football Player Database",
  description:
    "Search football players by club, position and data coverage, then explore transparent Tavalyze market-value estimates.",
  alternates: { canonical: "/players" },
};

export default function PlayersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
