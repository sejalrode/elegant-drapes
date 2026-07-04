import type { SourceGroup } from "./sourceGroup";

export type Category = "Saree" | "Jewelry" | "Dress" | "Decor" | "Other";
export type PaymentStatus = "pending" | "partial" | "paid";
export type DeliveryStatus =
  | "booked"
  | "ordered_from_source"
  | "received"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  order_code: string | null;
  order_date: string;
  source_group_id: string | null;
  source_name: string | null;
  item_photo_url: string | null;
  category: Category;
  actual_price: number;
  selling_price: number;
  profit: number;
  customer_name: string;
  customer_phone: string | null;
  payment_status: PaymentStatus;
  advance_paid: number;
  balance_amount: number;
  delivery_status: DeliveryStatus;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
  source_groups?: Pick<SourceGroup, "name"> | null;
};

export type OrderFormValues = {
  order_date: string;
  source_name: string;
  category: Category;
  actual_price: string;
  selling_price: string;
  customer_name: string;
  customer_phone: string;
  payment_status: PaymentStatus;
  advance_paid: string;
  delivery_status: DeliveryStatus;
  notes: string;
};

export type OrderInput = Omit<
  Order,
  "id" | "order_code" | "profit" | "balance_amount" | "created_at" | "updated_at" | "source_groups"
>;
