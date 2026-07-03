import type { Category, DeliveryStatus, PaymentStatus } from "@/types/order";

export const categoryOptions: Category[] = ["Saree", "Jewelry", "Dress", "Decor", "Other"];

export const paymentStatusOptions: PaymentStatus[] = ["pending", "partial", "paid"];

export const deliveryStatusOptions: DeliveryStatus[] = [
  "booked",
  "ordered_from_source",
  "received",
  "delivered",
  "cancelled"
];

export const paymentLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  partial: "Partial",
  paid: "Paid"
};

export const deliveryLabels: Record<DeliveryStatus, string> = {
  booked: "Booked",
  ordered_from_source: "Ordered",
  received: "Received",
  delivered: "Delivered",
  cancelled: "Cancelled"
};
