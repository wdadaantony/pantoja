begin;
alter table public.vehiculos add column if not exists stock_cantidad integer
  check (stock_cantidad >= 0);
alter table public.repuestos add column if not exists stock_cantidad integer
  check (stock_cantidad >= 0);
alter table public.configuracion add column if not exists promo_popup_activa boolean default false;
alter table public.configuracion add column if not exists promo_popup_imagen text default '';
alter table public.configuracion add column if not exists promo_popup_url text default '';
commit;
