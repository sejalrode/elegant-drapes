import type { Order } from "@/types/order";

export function getOrderSourceName(order: Pick<Order, "source_name" | "source_groups">) {
  return order.source_name?.trim() || order.source_groups?.name || "No source";
}
