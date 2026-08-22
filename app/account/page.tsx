"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useFavorites } from "@/hooks/useFavorites";

export default function AccountPage() {
  const router = useRouter();
  const { configured, loading, signOut, user } = useAuth();
  const { favoriteIds, syncing } = useFavorites();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <main className="min-h-[70vh] bg-[#07111f] px-6 py-20 text-center text-gray-400">Loading your account…</main>;
  }

  if (!configured || !user) {
    return (
      <main className="min-h-[70vh] bg-[#07111f] px-6 py-20 text-white">
        <section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-bold">Log in to open your account</h1>
          <p className="mt-3 text-gray-400">Create a free account to sync your football watchlist.</p>
          <Link href="/login" className="mt-7 inline-flex rounded-xl bg-green-500 px-5 py-3 font-semibold text-black">Go to login</Link>
        </section>
      </main>
    );
  }

  const name = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Football fan";

  return (
    <main className="min-h-[75vh] bg-[#07111f] px-6 py-14 text-white">
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">My Tavalyze</p>
        <div className="mt-4 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-2xl font-black text-black">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button type="button" onClick={handleSignOut} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 transition hover:border-red-400/40 hover:text-red-300">
            Log out
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Link href="/favorites" className="group rounded-3xl border border-white/10 bg-[#0a1829] p-7 transition hover:border-green-500/40">
            <p className="text-sm text-gray-500">My watchlist</p>
            <p className="mt-3 text-5xl font-black">{favoriteIds.length}</p>
            <p className="mt-3 text-gray-400">saved players {syncing ? "· syncing…" : "· synced"}</p>
            <p className="mt-7 text-sm font-semibold text-green-400">Open favorites →</p>
          </Link>
          <div className="rounded-3xl border border-white/10 bg-[#0a1829] p-7">
            <p className="text-sm text-gray-500">Coming next</p>
            <h2 className="mt-3 text-2xl font-bold">Player alerts</h2>
            <p className="mt-3 leading-7 text-gray-400">Get notified when a watched player changes club, value trend or verified performance.</p>
            <span className="mt-7 inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">In development</span>
          </div>
        </div>
      </section>
    </main>
  );
}
