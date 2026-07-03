"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

export function AuthButton() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setLoggedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  async function logout() {
    const supabase = createClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!loggedIn) return null;

  return (
    <button onClick={logout} className="hidden items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 md:inline-flex">
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Logout
    </button>
  );
}
