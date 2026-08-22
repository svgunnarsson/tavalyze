"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function AccountButton() {
  const { configured, loading, user } = useAuth();

  if (!configured) {
    return null;
  }

  if (loading) {
    return (
      <span className="h-10 w-20 animate-pulse rounded-xl bg-white/5" aria-hidden="true" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="shrink-0 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-500 hover:text-black"
      >
        Log in
      </Link>
    );
  }

  const label =
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "Account";

  return (
    <Link
      href="/account"
      className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:border-green-500/40 hover:text-white"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black">
        {label.charAt(0).toUpperCase()}
      </span>
      <span className="hidden max-w-24 truncate 2xl:inline">{label}</span>
    </Link>
  );
}
