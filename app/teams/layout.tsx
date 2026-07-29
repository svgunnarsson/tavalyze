import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football Teams & Squad Values",
  description:
    "Explore curated football squads, combined Tavalyze estimates and player profiles by club.",
  alternates: { canonical: "/teams" },
};

export default function TeamsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
