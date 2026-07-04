"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { demoOrders } from "@/lib/demoData";
import { formatCurrency } from "@/lib/formatCurrency";
import { getOrderSourceName } from "@/lib/sourceName";
import { createClient } from "@/lib/supabaseClient";
import type { Order } from "@/types/order";

export function ReportsClient() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [mode, setMode] = useState("Demo data");
  const [status, setStatus] = useState("");
  const label = useMemo(() => new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date()), []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
      const { data, error } = await supabase!
        .from("orders")
        .select("*, source_groups(name)")
        .gte("order_date", start)
        .lte("order_date", end)
        .order("order_date", { ascending: false });

      if (error) {
        setStatus(error.message);
        return;
      }
      setOrders(data as Order[]);
      setMode("Live Supabase data");
    }

    load();
  }, []);

  const sales = orders.reduce((sum, order) => sum + Number(order.selling_price), 0);
  const profit = orders.reduce((sum, order) => sum + Number(order.profit), 0);
  const pending = orders.filter((order) => order.payment_status !== "paid");
  const bySource = orders.reduce<Record<string, { orders: number; profit: number }>>((acc, order) => {
    const source = getOrderSourceName(order);
    acc[source] = acc[source] || { orders: 0, profit: 0 };
    acc[source].orders += 1;
    acc[source].profit += Number(order.profit);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-palm">Monthly summary</p>
        <h1 className="text-2xl font-bold text-ink">Reports</h1>
        <p className="text-xs font-semibold text-slate-500">{mode}</p>
      </div>
      {status ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{status}</p> : null}
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-palm" aria-hidden="true" />
          <h2 className="font-bold text-ink">{label}</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-mist p-3">
            <p className="text-sm text-slate-600">Total Sales</p>
            <p className="text-2xl font-bold">{formatCurrency(sales)}</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="text-sm text-slate-600">Total Profit</p>
            <p className="text-2xl font-bold text-palm">{formatCurrency(profit)}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <p className="text-sm text-slate-600">Pending Payments</p>
            <p className="text-2xl font-bold text-amber-900">{pending.length}</p>
          </div>
        </div>
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        {Object.entries(bySource).length === 0 ? (
          <EmptyState title="No source report yet" message="Source group analytics will appear after orders are added." />
        ) : Object.entries(bySource).map(([source, summary]) => (
          <article key={source} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="font-bold text-ink">{source}</h2>
            <p className="mt-2 text-sm text-slate-600">Orders: {summary.orders}</p>
            <p className="text-sm font-bold text-palm">Profit: {formatCurrency(summary.profit)}</p>
          </article>
        ))}
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="font-bold text-ink">Pending Payment List</h2>
        {pending.length === 0 ? (
          <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">No pending payments for this month.</p>
        ) : (
          <div className="mt-3 divide-y divide-slate-100">
            {pending.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-sm text-slate-500">{order.order_code}</p>
                </div>
                <p className="font-bold text-rosewood">{formatCurrency(order.balance_amount)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
