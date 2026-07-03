"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OrderForm } from "@/components/OrderForm";
import { createClient } from "@/lib/supabaseClient";
import type { Order } from "@/types/order";
import type { SourceGroup } from "@/types/sourceGroup";

type EditOrderClientProps = {
  id: string;
};

export function EditOrderClient({ id }: EditOrderClientProps) {
  const [sourceGroups, setSourceGroups] = useState<SourceGroup[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("Loading order...");

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setStatus("Add Supabase keys in .env.local before editing orders.");
      return;
    }

    async function load() {
      const [groupsResult, orderResult] = await Promise.all([
        supabase!.from("source_groups").select("*").order("name"),
        supabase!.from("orders").select("*, source_groups(name)").eq("id", id).single()
      ]);

      if (groupsResult.error) {
        setStatus(groupsResult.error.message);
        return;
      }
      if (orderResult.error) {
        setStatus(orderResult.error.message);
        return;
      }

      setSourceGroups((groupsResult.data ?? []) as SourceGroup[]);
      setOrder(orderResult.data as Order);
      setStatus("");
    }

    load();
  }, [id]);

  return (
    <div className="space-y-4">
      <div>
        <Link href="/orders" className="text-sm font-semibold text-palm">Back to orders</Link>
        <h1 className="mt-1 text-2xl font-bold text-ink">Edit Order</h1>
      </div>
      {status ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{status}</p> : null}
      {order ? <OrderForm sourceGroups={sourceGroups} initialOrder={order} /> : null}
    </div>
  );
}
