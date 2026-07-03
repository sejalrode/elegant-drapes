"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, IndianRupee, PackageCheck, PackageX, ReceiptText, Truck, WalletCards } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { demoOrders } from "@/lib/demoData";
import { formatCurrency } from "@/lib/formatCurrency";
import { createClient } from "@/lib/supabaseClient";
import type { Order } from "@/types/order";

function monthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const label = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(now);
  return { start, end, label };
}

export function DashboardClient() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [mode, setMode] = useState("Demo data");
  const [status, setStatus] = useState("");
  const { start, end, label } = useMemo(monthRange, []);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    async function load() {
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
  }, [end, start]);

  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + Number(order.selling_price), 0);
  const totalProfit = orders.reduce((sum, order) => sum + Number(order.profit), 0);
  const pendingPayments = orders
    .filter((order) => order.payment_status !== "paid")
    .reduce((sum, order) => sum + Number(order.balance_amount), 0);
  const paidOrders = orders.filter((order) => order.payment_status === "paid").length;
  const deliveredOrders = orders.filter((order) => order.delivery_status === "delivered").length;
  const pendingDelivery = orders.filter((order) => order.delivery_status !== "delivered" && order.delivery_status !== "cancelled").length;
  const cancelledOrders = orders.filter((order) => order.delivery_status === "cancelled").length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-palm">{label}</p>
          <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">{mode}</span>
      </div>
      {status ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{status}</p> : null}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard label="Total Orders" value={String(totalOrders)} icon={<ReceiptText className="h-5 w-5" />} />
        <DashboardCard label="Total Sales" value={formatCurrency(totalSales)} icon={<IndianRupee className="h-5 w-5" />} />
        <DashboardCard label="Total Profit" value={formatCurrency(totalProfit)} icon={<WalletCards className="h-5 w-5" />} tone="good" />
        <DashboardCard label="Pending Payments" value={formatCurrency(pendingPayments)} icon={<IndianRupee className="h-5 w-5" />} tone="warn" />
        <DashboardCard label="Paid Orders" value={String(paidOrders)} icon={<CheckCircle2 className="h-5 w-5" />} tone="good" />
        <DashboardCard label="Pending Delivery" value={String(pendingDelivery)} icon={<Truck className="h-5 w-5" />} tone="warn" />
        <DashboardCard label="Delivered Orders" value={String(deliveredOrders)} icon={<PackageCheck className="h-5 w-5" />} tone="good" />
        <DashboardCard label="Cancelled Orders" value={String(cancelledOrders)} icon={<PackageX className="h-5 w-5" />} tone="danger" />
      </section>
    </div>
  );
}
