import { formatCurrency } from "@/lib/formatCurrency";
import { getOrderSourceName } from "@/lib/sourceName";
import { getNextDeliveryStatus } from "@/lib/statusFlow";
import type { Order } from "@/types/order";
import { StatusBadge } from "./StatusBadge";

type OrderTableProps = {
  orders: Order[];
  onUpdate?: (id: string, values: Partial<Order>) => void;
  onDelete?: (id: string) => void;
};

export function OrderTable({ orders, onUpdate, onDelete }: OrderTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-mist text-xs uppercase text-slate-600">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Prices</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Delivery</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const nextDelivery = getNextDeliveryStatus(order.delivery_status);
            return (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {order.item_photo_url ? (
                      <img src={order.item_photo_url} alt="" className="h-12 w-12 rounded-md object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-mist" />
                    )}
                    <div>
                      <p className="font-semibold text-ink">{order.order_code}</p>
                      <p className="text-xs text-slate-500">{order.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-xs text-slate-500">{order.customer_phone}</p>
                </td>
                <td className="px-4 py-3">{getOrderSourceName(order)}</td>
                <td className="px-4 py-3">
                  <p>Sold {formatCurrency(order.selling_price)}</p>
                  <p className="text-palm">Profit {formatCurrency(order.profit)}</p>
                </td>
                <td className="px-4 py-3"><StatusBadge type="payment" value={order.payment_status} /></td>
                <td className="px-4 py-3"><StatusBadge type="delivery" value={order.delivery_status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <a href={`/orders/${order.id}/edit`} className="rounded-md border border-slate-300 px-3 py-2 font-semibold">Edit</a>
                    <button onClick={() => onUpdate?.(order.id, { payment_status: "paid", advance_paid: order.selling_price })} className="rounded-md bg-palm px-3 py-2 font-semibold text-white">Paid</button>
                    {nextDelivery ? (
                      <button onClick={() => onUpdate?.(order.id, { delivery_status: nextDelivery.value })} className="rounded-md border border-emerald-200 px-3 py-2 font-semibold text-emerald-800">{nextDelivery.label}</button>
                    ) : null}
                    <button onClick={() => window.confirm("Delete this order?") && onDelete?.(order.id)} className="rounded-md border border-rose-200 px-3 py-2 font-semibold text-rosewood">Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
