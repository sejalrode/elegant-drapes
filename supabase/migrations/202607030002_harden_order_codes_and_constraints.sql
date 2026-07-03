create sequence if not exists order_code_seq;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'source_groups_name_key'
  ) then
    alter table source_groups add constraint source_groups_name_key unique (name);
  end if;
exception
  when unique_violation then
    raise notice 'Skipping source_groups name unique constraint because duplicate names exist.';
end;
$$;

alter table orders
drop constraint if exists advance_not_more_than_selling;

alter table orders
add constraint advance_not_more_than_selling check (advance_paid <= selling_price) not valid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_actual_price_nonnegative'
  ) then
    alter table orders add constraint orders_actual_price_nonnegative check (actual_price >= 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_selling_price_nonnegative'
  ) then
    alter table orders add constraint orders_selling_price_nonnegative check (selling_price >= 0) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_advance_paid_nonnegative'
  ) then
    alter table orders add constraint orders_advance_paid_nonnegative check (advance_paid >= 0) not valid;
  end if;
end;
$$;

alter table orders
drop constraint if exists orders_source_group_id_fkey;

alter table orders
add constraint orders_source_group_id_fkey
foreign key (source_group_id) references source_groups(id) on delete set null;

create index if not exists orders_customer_name_idx on orders(customer_name);
create index if not exists orders_customer_phone_idx on orders(customer_phone);

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
