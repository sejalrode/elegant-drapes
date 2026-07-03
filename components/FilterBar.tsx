"use client";

import { Search } from "lucide-react";

export function FilterBar() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-11 w-full rounded-md border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-palm"
            placeholder="Search customer or phone"
          />
        </label>
        <select className="h-11 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-palm">
          <option>This month</option>
          <option>Last month</option>
          <option>Custom range</option>
        </select>
        <select className="h-11 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-palm">
          <option>All statuses</option>
          <option>Payment pending</option>
          <option>Paid</option>
          <option>Delivery pending</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>
    </section>
  );
}
