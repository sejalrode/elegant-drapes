"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { calculateBalance, calculateProfit } from "@/lib/calculations";
import { categoryOptions, deliveryLabels, deliveryStatusOptions, paymentLabels, paymentStatusOptions } from "@/lib/constants";
import { createClient, getStorageBucket } from "@/lib/supabaseClient";
import type { Order, OrderFormValues } from "@/types/order";
import { formatCurrency } from "@/lib/formatCurrency";
import { ImageUpload } from "./ImageUpload";

type OrderFormProps = {
  sourceSuggestions: string[];
  initialOrder?: Order;
};

const today = new Date().toISOString().slice(0, 10);

export function OrderForm({ sourceSuggestions, initialOrder }: OrderFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialOrder?.item_photo_url ?? null);
  const [status, setStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<OrderFormValues>({
    order_date: initialOrder?.order_date ?? today,
    source_name: initialOrder?.source_name ?? initialOrder?.source_groups?.name ?? "",
    category: initialOrder?.category ?? "Saree",
    actual_price: initialOrder ? String(initialOrder.actual_price) : "",
    selling_price: initialOrder ? String(initialOrder.selling_price) : "",
    customer_name: initialOrder?.customer_name ?? "",
    customer_phone: initialOrder?.customer_phone ?? "",
    payment_status: initialOrder?.payment_status ?? "pending",
    advance_paid: initialOrder ? String(initialOrder.advance_paid ?? 0) : "",
    delivery_status: initialOrder?.delivery_status ?? "booked",
    notes: initialOrder?.notes ?? ""
  });

  const actualPrice = Number(values.actual_price || 0);
  const sellingPrice = Number(values.selling_price || 0);
  const advancePaid = Number(values.advance_paid || 0);

  const totals = useMemo(
    () => ({
      profit: calculateProfit(sellingPrice, actualPrice),
      balance: calculateBalance(sellingPrice, advancePaid)
    }),
    [actualPrice, advancePaid, sellingPrice]
  );

  function update(name: keyof OrderFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function chooseFile(nextFile: File | null) {
    setFile(nextFile);
    if (nextFile) {
      setPreviewUrl(URL.createObjectURL(nextFile));
    }
  }

  async function uploadPhoto(orderId: string) {
    if (!file) return initialOrder?.item_photo_url ?? null;

    const supabase = createClient();
    if (!supabase) return null;

    const extension = file.name.split(".").pop() || "jpg";
    const path = `${orderId}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from(getStorageBucket()).upload(path, file, {
      cacheControl: "3600",
      upsert: true
    });

    if (error) throw error;

    const { data } = supabase.storage.from(getStorageBucket()).getPublicUrl(path);
    return data.publicUrl;
  }

  async function saveOrder() {
    const supabase = createClient();
    if (!supabase) {
      setStatus("Add Supabase keys in .env.local before saving real orders.");
      return;
    }

    if (!values.customer_name.trim() || !values.actual_price || !values.selling_price) {
      setStatus("Customer name, actual price, and selling price are required.");
      return;
    }

    if (!Number.isFinite(actualPrice) || !Number.isFinite(sellingPrice) || !Number.isFinite(advancePaid)) {
      setStatus("Prices and advance amount must be valid numbers.");
      return;
    }

    if (actualPrice < 0 || sellingPrice < 0 || advancePaid < 0) {
      setStatus("Prices and advance amount cannot be negative.");
      return;
    }

    if (advancePaid > sellingPrice) {
      setStatus("Advance paid cannot be more than the selling price.");
      return;
    }

    setSaving(true);
    setStatus("");

    try {
      const payload = {
        order_date: values.order_date,
        source_name: values.source_name.trim() || null,
        source_group_id: null,
        category: values.category,
        actual_price: actualPrice,
        selling_price: sellingPrice,
        customer_name: values.customer_name,
        customer_phone: values.customer_phone || null,
        payment_status: values.payment_status,
        advance_paid: advancePaid,
        delivery_status: values.delivery_status,
        notes: values.notes || null
      };

      const savedOrder = initialOrder
        ? await supabase.from("orders").update(payload).eq("id", initialOrder.id).select("id").single()
        : await supabase.from("orders").insert(payload).select("id").single();

      if (savedOrder.error) throw savedOrder.error;

      const photoUrl = await uploadPhoto(savedOrder.data.id);
      if (photoUrl) {
        const { error } = await supabase.from("orders").update({ item_photo_url: photoUrl }).eq("id", savedOrder.data.id);
        if (error) throw error;
      }

      router.push("/orders");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save this order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Order Date</span>
          <input
            type="date"
            value={values.order_date}
            onChange={(event) => update("order_date", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Source WhatsApp Group</span>
          <input
            list="source-name-suggestions"
            value={values.source_name}
            onChange={(event) => update("source_name", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
            placeholder="Priya Sarees"
          />
          <datalist id="source-name-suggestions">
            {sourceSuggestions.map((source) => (
              <option key={source} value={source} />
            ))}
          </datalist>
        </label>
      </div>

      <ImageUpload previewUrl={previewUrl} onFileChange={chooseFile} />

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Category</span>
          <select
            value={values.category}
            onChange={(event) => update("category", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
          >
            {categoryOptions.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Actual Price</span>
          <input
            inputMode="decimal"
            value={values.actual_price}
            onChange={(event) => update("actual_price", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
            placeholder="1200"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Selling Price</span>
          <input
            inputMode="decimal"
            value={values.selling_price}
            onChange={(event) => update("selling_price", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
            placeholder="1550"
          />
        </label>
      </div>

      <div className="grid gap-3 rounded-lg bg-mist p-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Profit</p>
          <p className="text-2xl font-bold text-palm">{formatCurrency(totals.profit)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Balance</p>
          <p className="text-2xl font-bold text-rosewood">{formatCurrency(totals.balance)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Customer Name</span>
          <input
            value={values.customer_name}
            onChange={(event) => update("customer_name", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
            placeholder="Sunita Tai"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Customer Phone</span>
          <input
            inputMode="tel"
            value={values.customer_phone}
            onChange={(event) => update("customer_phone", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
            placeholder="9876543210"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Payment Status</span>
          <select
            value={values.payment_status}
            onChange={(event) => update("payment_status", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
          >
            {paymentStatusOptions.map((status) => (
              <option key={status} value={status}>{paymentLabels[status]}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Advance Paid</span>
          <input
            inputMode="decimal"
            value={values.advance_paid}
            onChange={(event) => update("advance_paid", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
            placeholder="0"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-slate-700">Delivery Status</span>
          <select
            value={values.delivery_status}
            onChange={(event) => update("delivery_status", event.target.value)}
            className="h-12 w-full rounded-md border border-slate-300 px-3 text-base outline-none focus:border-palm"
          >
            {deliveryStatusOptions.map((status) => (
              <option key={status} value={status}>{deliveryLabels[status]}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-700">Notes</span>
        <textarea
          value={values.notes}
          onChange={(event) => update("notes", event.target.value)}
          className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-3 text-base outline-none focus:border-palm"
          placeholder="Pink silk saree, delivery details, supplier note"
        />
      </label>

      {status ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{status}</p> : null}

      <button
        type="button"
        onClick={saveOrder}
        disabled={saving}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-palm px-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-5 w-5" aria-hidden="true" />
        {saving ? "Saving..." : "Save Order"}
      </button>
    </form>
  );
}
