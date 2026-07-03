"use client";

import { useEffect, useState } from "react";
import { OrderForm } from "@/components/OrderForm";
import { demoSourceGroups } from "@/lib/demoData";
import { createClient } from "@/lib/supabaseClient";
import type { SourceGroup } from "@/types/sourceGroup";

export function NewOrderClient() {
  const [sourceGroups, setSourceGroups] = useState<SourceGroup[]>(demoSourceGroups);
  const [mode, setMode] = useState("Demo source groups");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const { data, error } = await supabase!.from("source_groups").select("*").order("name");
      if (error) {
        setStatus(error.message);
        return;
      }
      setSourceGroups(data as SourceGroup[]);
      setMode("Live source groups");
    }

    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-palm">New booking</p>
        <h1 className="text-2xl font-bold text-ink">Add Booked Item</h1>
        <p className="text-xs font-semibold text-slate-500">{mode}</p>
      </div>
      {status ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{status}</p> : null}
      {sourceGroups.length === 0 ? (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">Add at least one source group before saving orders.</p>
      ) : null}
      <OrderForm sourceGroups={sourceGroups} />
    </div>
  );
}
