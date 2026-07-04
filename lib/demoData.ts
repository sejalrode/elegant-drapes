import type { Order } from "@/types/order";
import type { SourceGroup } from "@/types/sourceGroup";

export const demoSourceGroups: SourceGroup[] = [
  {
    id: "1",
    name: "Pune Saree Group",
    contact_person: "Meena",
    phone: "9876543210",
    notes: "Reliable saree supplier"
  },
  {
    id: "2",
    name: "Kolhapur Jewelry Group",
    contact_person: "Rupa",
    phone: "9876501234",
    notes: "Good festival collection"
  },
  {
    id: "3",
    name: "Decor Supplier Group",
    contact_person: "Anita",
    phone: null,
    notes: "Home decor and gifting"
  }
];

export const demoOrders: Order[] = [
  {
    id: "101",
    order_code: "ED001",
    order_date: "2026-07-02",
    source_group_id: "1",
    source_name: "Pune Saree Group",
    item_photo_url: null,
    category: "Saree",
    actual_price: 1200,
    selling_price: 1550,
    profit: 350,
    customer_name: "Sunita Tai",
    customer_phone: "9876543211",
    payment_status: "paid",
    advance_paid: 1550,
    balance_amount: 0,
    delivery_status: "delivered",
    notes: "Pink silk saree",
    source_groups: { name: "Pune Saree Group" }
  },
  {
    id: "102",
    order_code: "ED002",
    order_date: "2026-07-03",
    source_group_id: "2",
    source_name: "Kolhapur Jewelry Group",
    item_photo_url: null,
    category: "Jewelry",
    actual_price: 700,
    selling_price: 950,
    profit: 250,
    customer_name: "Neha",
    customer_phone: "9876543212",
    payment_status: "partial",
    advance_paid: 500,
    balance_amount: 450,
    delivery_status: "booked",
    notes: "Temple necklace set",
    source_groups: { name: "Kolhapur Jewelry Group" }
  }
];
