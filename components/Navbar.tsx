"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const navigation = [
    { href: "/players", label: "Players" },
    { href: "/teams", label: "Teams" },
    { href: "/market-values", label: "Market Values" },
    { href: "/transfers", label: "Transfers" },
    { href: "/compare", label: "Compare" },
    { href: "/favorites", label: "Favorites" },
    { href: "/methodology", label: "Data" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-5 py-3">
          <Link href="/" className="shrink-0 text-2xl font-bold tracking-tight">
            Tav<span className="text-green-500">alyze</span>
          </Link>

          <div className="hidden items-center gap-5 text-sm text-gray-300 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "page"
                    : undefined
                }
                className={`whitespace-nowrap rounded-lg px-2.5 py-2 transition ${
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <SearchBar compact className="hidden w-full max-w-60 xl:block" />
        </div>

        <div className="-mx-4 flex gap-5 overflow-x-auto border-t border-white/5 px-4 py-3 text-sm text-gray-300 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "page"
                  : undefined
              }
              className={`shrink-0 rounded-full px-3 py-1.5 transition ${
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-green-500 text-black"
                  : "hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
