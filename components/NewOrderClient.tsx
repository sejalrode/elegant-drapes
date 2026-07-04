"use client";

import { useEffect, useState } from "react";
import { OrderForm } from "@/components/OrderForm";
import { demoSourceGroups } from "@/lib/demoData";
import { createClient } from "@/lib/supabaseClient";

export function NewOrderClient() {
  const [sourceSuggestions, setSourceSuggestions] = useState<string[]>(demoSourceGroups.map((group) => group.name));
  const [mode, setMode] = useState("Demo source suggestions");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const [groupsResult, ordersResult] = await Promise.all([
        supabase!.from("source_groups").select("name").order("name"),
        supabase!.from("orders").select("source_name, source_groups(name)").order("order_date", { ascending: false }).limit(200)
      ]);

      if (groupsResult.error) {
        setStatus(groupsResult.error.message);
        return;
      }
      if (ordersResult.error) {
        setStatus(ordersResult.error.message);
        return;
      }

      const names = new Set<string>();
      groupsResult.data?.forEach((group) => group.name && names.add(group.name));
      ordersResult.data?.forEach((order) => {
        const relation = order.source_groups as { name?: string } | null;
        const sourceName = order.source_name || relation?.name;
        if (sourceName) names.add(sourceName);
      });

      setSourceSuggestions(Array.from(names).sort((a, b) => a.localeCompare(b)));
      setMode("Live source suggestions");
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
      <OrderForm sourceSuggestions={sourceSuggestions} />
    </div>
  );
}
