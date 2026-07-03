import { deliveryLabels, paymentLabels } from "@/lib/constants";
import type { DeliveryStatus, PaymentStatus } from "@/types/order";

type StatusBadgeProps = {
  type: "payment" | "delivery";
  value: PaymentStatus | DeliveryStatus;
};

const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  partial: "bg-sky-100 text-sky-800",
  paid: "bg-emerald-100 text-emerald-800",
  booked: "bg-slate-100 text-slate-700",
  ordered_from_source: "bg-indigo-100 text-indigo-800",
  received: "bg-teal-100 text-teal-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800"
};

export function StatusBadge({ type, value }: StatusBadgeProps) {
  const label = type === "payment" ? paymentLabels[value as PaymentStatus] : deliveryLabels[value as DeliveryStatus];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[value]}`}>
      {label}
    </span>
  );
}
