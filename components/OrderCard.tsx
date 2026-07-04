import { formatCurrency } from "@/lib/formatCurrency";
import { getOrderSourceName } from "@/lib/sourceName";
import { getNextDeliveryStatus } from "@/lib/statusFlow";
import type { Order } from "@/types/order";
import { StatusBadge } from "./StatusBadge";

type OrderCardProps = {
  order: Order;
  onUpdate?: (id: string, values: Partial<Order>) => void;
  onDelete?: (id: string) => void;
};

export function OrderCard({ order, onUpdate, onDelete }: OrderCardProps) {
  const nextDelivery = getNextDeliveryStatus(order.delivery_status);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex gap-3">
        {order.item_photo_url ? (
          <img src={order.item_photo_url} alt="" className="h-20 w-20 shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-mist text-xs font-semibold text-slate-500">
            Photo
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-ink">{order.notes || order.category}</p>
              <p className="text-xs text-slate-500">{order.order_code}</p>
            </div>
            <p className="text-xs text-slate-500">{new Date(order.order_date).toLocaleDateString("en-IN")}</p>
          </div>
          <p className="mt-2 text-sm text-slate-700">Customer: {order.customer_name}</p>
          <p className="text-sm text-slate-700">Source: {getOrderSourceName(order)}</p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-xs text-slate-500">Actual</dt>
          <dd className="font-semibold">{formatCurrency(order.actual_price)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Sold</dt>
          <dd className="font-semibold">{formatCurrency(order.selling_price)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Profit</dt>
          <dd className="font-semibold text-palm">{formatCurrency(order.profit)}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge type="payment" value={order.payment_status} />
        <StatusBadge type="delivery" value={order.delivery_status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={`/orders/${order.id}/edit`} className="rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700">Edit</a>
        <button onClick={() => onUpdate?.(order.id, { payment_status: "paid", advance_paid: order.selling_price })} className="rounded-md bg-palm px-3 py-2 text-sm font-semibold text-white">Mark Paid</button>
        {nextDelivery ? (
          <button onClick={() => onUpdate?.(order.id, { delivery_status: nextDelivery.value })} className="rounded-md border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800">
            {nextDelivery.label}
          </button>
        ) : (
          <button disabled className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400">Done</button>
        )}
        <button onClick={() => window.confirm("Delete this order?") && onDelete?.(order.id)} className="rounded-md border border-rose-200 px-3 py-2 text-sm font-semibold text-rosewood">Delete</button>
      </div>
    </article>
  );
}
