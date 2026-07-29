import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Battle Lab — Compare Football Players",
  description:
    "Compare two football players across market value, age profile, Tavalyze Index and available verified performance data.",
  alternates: { canonical: "/compare" },
};

export default function CompareLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
