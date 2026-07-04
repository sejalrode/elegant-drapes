alter table orders
add column if not exists source_name text;

update orders
set source_name = source_groups.name
from source_groups
where orders.source_group_id = source_groups.id
  and orders.source_name is null;

create index if not exists orders_source_name_idx on orders(source_name);
