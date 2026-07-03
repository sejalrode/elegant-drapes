"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    const supabase = createClient();
    if (!supabase) {
      setStatus("Add Supabase keys in .env.local before login can work.");
      return;
    }

    setLoading(true);
    setStatus("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    router.push(searchParams.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <section className="w-full rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-palm text-white">
          <LockKeyhole className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">Admin Login</h1>
          <p className="text-sm text-slate-500">Elegant Drapes Order Tracker</p>
        </div>
      </div>
      <form className="space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
            placeholder="admin@example.com"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
            placeholder="Password"
          />
        </label>
        {status ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{status}</p> : null}
        <button
          type="button"
          onClick={login}
          disabled={loading}
          className="h-12 w-full rounded-md bg-palm text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
}
