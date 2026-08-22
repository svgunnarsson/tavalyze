"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { configured, user } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    return (
      <main className="min-h-[70vh] bg-[#07111f] px-6 py-20 text-white">
        <section className="mx-auto max-w-xl rounded-3xl border border-green-500/20 bg-green-500/5 p-8 text-center">
          <div className="text-4xl">✓</div>
          <h1 className="mt-4 text-3xl font-bold">You’re already logged in</h1>
          <p className="mt-3 text-gray-400">Your Tavalyze watchlist can follow you across devices.</p>
          <button
            type="button"
            onClick={() => router.push("/account")}
            className="mt-7 rounded-xl bg-green-500 px-5 py-3 font-semibold text-black"
          >
            Open my account
          </button>
        </section>
      </main>
    );
  }

  async function signInWithGoogle() {
    const supabase = createClient();
    if (!supabase) return;

    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/favorites`,
      },
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
    }
  }

  async function sendMagicLink(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/favorites`,
      },
    });

    setBusy(false);
    setMessage(
      error
        ? error.message
        : "Check your email — your secure Tavalyze login link is on its way.",
    );
  }

  return (
    <main className="min-h-[78vh] bg-[#07111f] px-6 py-16 text-white">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a1829] shadow-2xl shadow-black/30 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:border-r">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-400">
              Tavalyze account
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              Build your football watchlist.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-gray-400">
              Follow players, keep your shortlist across devices and get ready for personalized market-value alerts.
            </p>
            <div className="mt-10 space-y-4 text-sm text-gray-300">
              {[
                "Favorites synced across devices",
                "A personal player watchlist",
                "Future value and transfer alerts",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/15 text-green-400">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <h2 className="text-2xl font-bold">Log in or create an account</h2>
          <p className="mt-2 text-sm text-gray-500">Free to join. No payment details needed.</p>

          {!configured ? (
            <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm leading-6 text-amber-100">
              <strong>Login is ready for connection.</strong>
              <p className="mt-2 text-amber-100/70">
                The Tavalyze interface is complete. Add the Supabase project details to activate secure accounts.
              </p>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={busy}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white px-5 py-3.5 font-semibold text-gray-900 transition hover:bg-gray-100 disabled:opacity-60"
              >
                <span className="text-lg font-black text-blue-500">G</span>
                Continue with Google
              </button>

              <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-widest text-gray-600">
                <span className="h-px flex-1 bg-white/10" /> or use email <span className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={sendMagicLink}>
                <label htmlFor="email" className="text-sm font-semibold text-gray-300">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/50"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-4 w-full rounded-xl bg-green-500 px-5 py-3.5 font-bold text-black transition hover:bg-green-400 disabled:opacity-60"
                >
                  {busy ? "Please wait…" : "Email me a login link"}
                </button>
              </form>
            </>
          )}

          {message && (
            <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300" role="status">
              {message}
            </p>
          )}

          <p className="mt-7 text-xs leading-5 text-gray-600">
            By continuing, you agree to use Tavalyze responsibly. Your password is never stored by Tavalyze.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm text-gray-500 hover:text-white">← Back to Tavalyze</Link>
        </div>
      </section>
    </main>
  );
}
