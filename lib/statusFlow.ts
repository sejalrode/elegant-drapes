import { deliveryLabels } from "@/lib/constants";
import type { DeliveryStatus } from "@/types/order";

const deliveryFlow: DeliveryStatus[] = ["booked", "ordered_from_source", "received", "delivered"];

export function getNextDeliveryStatus(status: DeliveryStatus) {
  const currentIndex = deliveryFlow.indexOf(status);
  if (currentIndex === -1 || currentIndex === deliveryFlow.length - 1) return null;

  const nextStatus = deliveryFlow[currentIndex + 1];
  return {
    value: nextStatus,
    label: deliveryLabels[nextStatus]
  };
}
