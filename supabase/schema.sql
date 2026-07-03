create extension if not exists "pgcrypto";

create sequence if not exists order_code_seq;

create table if not exists source_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  contact_person text,
  phone text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique,
  order_date date not null default current_date,
  source_group_id uuid references source_groups(id) on delete set null,
  item_photo_url text,
  category text not null check (category in ('Saree', 'Jewelry', 'Dress', 'Decor', 'Other')),
  actual_price numeric(10,2) not null check (actual_price >= 0),
  selling_price numeric(10,2) not null check (selling_price >= 0),
  profit numeric(10,2) generated always as (selling_price - actual_price) stored,
  customer_name text not null,
  customer_phone text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'partial', 'paid')),
  advance_paid numeric(10,2) default 0 check (advance_paid >= 0),
  balance_amount numeric(10,2) generated always as (selling_price - advance_paid) stored,
  delivery_status text not null default 'booked' check (delivery_status in ('booked', 'ordered_from_source', 'received', 'delivered', 'cancelled')),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table orders
drop constraint if exists advance_not_more_than_selling;

alter table orders
add constraint advance_not_more_than_selling check (advance_paid <= selling_price);

create index if not exists orders_order_date_idx on orders(order_date);
create index if not exists orders_source_group_idx on orders(source_group_id);
create index if not exists orders_payment_status_idx on orders(payment_status);
create index if not exists orders_delivery_status_idx on orders(delivery_status);
create index if not exists orders_customer_name_idx on orders(customer_name);
create index if not exists orders_customer_phone_idx on orders(customer_phone);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_source_groups_updated_at on source_groups;
create trigger set_source_groups_updated_at
before update on source_groups
for each row execute function set_updated_at();

drop trigger if exists set_orders_updated_at on orders;
create trigger set_orders_updated_at
before update on orders
for each row execute function set_updated_at();

create or replace function generate_order_code()
returns trigger as $$
begin
  if new.order_code is not null then
    return new;
  end if;

  new.order_code := 'ED' || lpad(nextval('order_code_seq')::text, 3, '0');
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_order_code on orders;
create trigger set_order_code
before insert on orders
for each row execute function generate_order_code();

alter table source_groups enable row level security;
alter table orders enable row level security;

drop policy if exists "Authenticated users can manage source groups" on source_groups;
create policy "Authenticated users can manage source groups"
on source_groups for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage orders" on orders;
create policy "Authenticated users can manage orders"
on orders for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('order-photos', 'order-photos', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload order photos" on storage.objects;
create policy "Authenticated users can upload order photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'order-photos');

drop policy if exists "Authenticated users can update order photos" on storage.objects;
create policy "Authenticated users can update order photos"
on storage.objects for update
to authenticated
using (bucket_id = 'order-photos')
with check (bucket_id = 'order-photos');

drop policy if exists "Authenticated users can read order photos" on storage.objects;
create policy "Authenticated users can read order photos"
on storage.objects for select
to authenticated
using (bucket_id = 'order-photos');

drop policy if exists "Authenticated users can delete order photos" on storage.objects;
create policy "Authenticated users can delete order photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'order-photos');
