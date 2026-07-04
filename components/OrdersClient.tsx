"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { OrderCard } from "@/components/OrderCard";
import { OrderTable } from "@/components/OrderTable";
import { EmptyState } from "@/components/EmptyState";
import { categoryOptions } from "@/lib/constants";
import { demoOrders } from "@/lib/demoData";
import { getOrderSourceName } from "@/lib/sourceName";
import { createClient } from "@/lib/supabaseClient";
import type { Order } from "@/types/order";

type DateFilter = "this_month" | "last_month" | "all";
type StatusFilter = "all" | "payment_pending" | "paid" | "delivery_pending" | "delivered" | "cancelled";

function dateRange(filter: DateFilter) {
  const now = new Date();
  const monthStart = filter === "last_month" ? new Date(now.getFullYear(), now.getMonth() - 1, 1) : new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = filter === "last_month" ? new Date(now.getFullYear(), now.getMonth(), 0) : new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: monthStart.toISOString().slice(0, 10),
    end: monthEnd.toISOString().slice(0, 10)
  };
}

export function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("this_month");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [mode, setMode] = useState("Demo data");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadOrders() {
    const supabase = createClient();
    if (!supabase) return;

    setLoading(true);
    setStatus("");
    let query = supabase.from("orders").select("*, source_groups(name)").order("order_date", { ascending: false });
    if (dateFilter !== "all") {
      const range = dateRange(dateFilter);
      query = query.gte("order_date", range.start).lte("order_date", range.end);
    }

    const { data, error } = await query;
    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }
    setOrders((data ?? []) as Order[]);
    setMode("Live Supabase data");
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, [dateFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const text = `${order.customer_name} ${order.customer_phone ?? ""} ${order.order_code ?? ""}`.toLowerCase();
      const searchMatch = text.includes(search.toLowerCase());
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "payment_pending" && order.payment_status !== "paid") ||
        (statusFilter === "paid" && order.payment_status === "paid") ||
        (statusFilter === "delivery_pending" && order.delivery_status !== "delivered" && order.delivery_status !== "cancelled") ||
        (statusFilter === "delivered" && order.delivery_status === "delivered") ||
        (statusFilter === "cancelled" && order.delivery_status === "cancelled");
      const categoryMatch = categoryFilter === "all" || order.category === categoryFilter;
      const sourceMatch = sourceFilter === "all" || getOrderSourceName(order) === sourceFilter;
      return searchMatch && statusMatch && categoryMatch && sourceMatch;
    });
  }, [categoryFilter, orders, search, sourceFilter, statusFilter]);

  const sourceOptions = useMemo(() => {
    const options = new Set<string>();
    orders.forEach((order) => {
      const source = getOrderSourceName(order);
      if (source !== "No source") options.add(source);
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b));
  }, [orders]);

  async function updateOrder(id: string, values: Partial<Order>) {
    const supabase = createClient();
    if (!supabase) {
      setStatus("Add Supabase keys in .env.local before updating orders.");
      return;
    }

    const { error } = await supabase.from("orders").update(values).eq("id", id);
    if (error) {
      setStatus(error.message);
      return;
    }
    await loadOrders();
  }

  async function deleteOrder(id: string) {
    const supabase = createClient();
    if (!supabase) {
      setStatus("Add Supabase keys in .env.local before deleting orders.");
      return;
    }

    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      setStatus(error.message);
      return;
    }
    await loadOrders();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-palm">Booked items</p>
          <h1 className="text-2xl font-bold text-ink">Orders</h1>
          <p className="text-xs font-semibold text-slate-500">{mode}</p>
        </div>
        <Link href="/orders/new" className="flex h-11 items-center gap-2 rounded-md bg-palm px-4 text-sm font-bold text-white">
          <PlusCircle className="h-5 w-5" aria-hidden="true" />
          Add
        </Link>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 w-full rounded-md border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-palm"
              placeholder="Search customer or phone"
            />
          </label>
          <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value as DateFilter)} className="h-11 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-palm">
            <option value="this_month">This month</option>
            <option value="last_month">Last month</option>
            <option value="all">All orders</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="h-11 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-palm">
            <option value="all">All statuses</option>
            <option value="payment_pending">Payment pending</option>
            <option value="paid">Paid</option>
            <option value="delivery_pending">Delivery pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-11 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-palm">
            <option value="all">All categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)} className="h-11 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-palm">
            <option value="all">All sources</option>
            {sourceOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </section>
      {status ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{status}</p> : null}
      {loading ? <p className="rounded-lg bg-white p-4 text-sm font-semibold text-slate-500 shadow-soft">Loading orders...</p> : null}
      {!loading && filteredOrders.length === 0 ? (
        <EmptyState title="No orders found" message="Add a booked item or change the filters to see more orders." />
      ) : (
        <>
          <OrderTable orders={filteredOrders} onUpdate={updateOrder} onDelete={deleteOrder} />
          <div className="grid gap-3 md:hidden">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onUpdate={updateOrder} onDelete={deleteOrder} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
