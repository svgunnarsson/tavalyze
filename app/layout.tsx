import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tavalyze.com"),
  title: {
    default: "Tavalyze — Football Market Intelligence",
    template: "%s | Tavalyze",
  },
  description:
    "Compare football players, explore transparent market-value estimates and discover club-fit intelligence with Tavalyze.",
  keywords: [
    "football market values",
    "player comparison",
    "football analytics",
    "transfer intelligence",
    "football scouting",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Tavalyze",
    title: "Tavalyze — Football Market Intelligence",
    description:
      "Compare football players and explore transparent market-value intelligence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tavalyze — Football Market Intelligence",
    description:
      "Compare football players and explore transparent market-value intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#07111f] text-white">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
