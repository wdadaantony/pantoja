create extension if not exists pgcrypto;

create table if not exists public.vehiculos (
  id uuid primary key default gen_random_uuid(), slug text unique not null, nombre text not null,
  modelo text not null, categoria text not null, anio int, precio numeric, moneda text default 'USD' check (moneda in ('USD','PEN')),
  pasajeros int, motor text, cilindrada text, potencia text, transmision text, combustible text,
  equipamiento text[] default '{}', descripcion text, imagenes text[] default '{}', destacado boolean default false,
  publicado boolean default true, disponible_en text[] default '{}', orden int default 0,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists public.repuestos (
  id uuid primary key default gen_random_uuid(), slug text unique not null, nombre text not null, sku text unique not null,
  categoria text not null, marca text, precio numeric, moneda text default 'PEN' check (moneda in ('USD','PEN')),
  compatible_con text[] default '{}', descripcion text, imagenes text[] default '{}',
  stock text default 'Disponible' check (stock in ('Disponible','Bajo pedido','Agotado')),
  destacado boolean default false, publicado boolean default true,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists public.configuracion (
  id int primary key default 1 check (id=1), whatsapp text default '51952885588', telefono text default '952885588',
  horario text, sede_arequipa jsonb, sede_tacna jsonb, banner_home text, activo_banner boolean default true,
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at=now(); return new; end $$;
drop trigger if exists vehiculos_updated_at on public.vehiculos;
create trigger vehiculos_updated_at before update on public.vehiculos for each row execute function public.set_updated_at();
alter table public.vehiculos add column if not exists carroceria text;
alter table public.vehiculos add column if not exists color text;
alter table public.vehiculos add column if not exists caja text;
alter table public.vehiculos add column if not exists carga text;
alter table public.vehiculos add column if not exists euro text;
alter table public.vehiculos add column if not exists accesorios text[] default '{}';
alter table public.vehiculos add column if not exists autopartes text[] default '{}';
alter table public.vehiculos add column if not exists ficha_tecnica jsonb default '{}'::jsonb;
drop trigger if exists repuestos_updated_at on public.repuestos;
create trigger repuestos_updated_at before update on public.repuestos for each row execute function public.set_updated_at();
drop trigger if exists configuracion_updated_at on public.configuracion;
create trigger configuracion_updated_at before update on public.configuracion for each row execute function public.set_updated_at();

alter table public.vehiculos enable row level security;
alter table public.repuestos enable row level security;
alter table public.configuracion enable row level security;

drop policy if exists "vehiculos publicos" on public.vehiculos;
create policy "vehiculos publicos" on public.vehiculos for select using (publicado=true);
drop policy if exists "vehiculos admin" on public.vehiculos;
create policy "vehiculos admin" on public.vehiculos for all to authenticated using (true) with check (true);
drop policy if exists "repuestos publicos" on public.repuestos;
create policy "repuestos publicos" on public.repuestos for select using (publicado=true);
drop policy if exists "repuestos admin" on public.repuestos;
create policy "repuestos admin" on public.repuestos for all to authenticated using (true) with check (true);
drop policy if exists "configuracion publica" on public.configuracion;
create policy "configuracion publica" on public.configuracion for select using (true);
drop policy if exists "configuracion admin" on public.configuracion;
create policy "configuracion admin" on public.configuracion for all to authenticated using (true) with check (true);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('productos','productos',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do update set public=true;
drop policy if exists "fotos publicas" on storage.objects;
create policy "fotos publicas" on storage.objects for select using (bucket_id='productos');
drop policy if exists "fotos admin insertar" on storage.objects;
create policy "fotos admin insertar" on storage.objects for insert to authenticated with check (bucket_id='productos');
drop policy if exists "fotos admin actualizar" on storage.objects;
create policy "fotos admin actualizar" on storage.objects for update to authenticated using (bucket_id='productos') with check (bucket_id='productos');
drop policy if exists "fotos admin eliminar" on storage.objects;
create policy "fotos admin eliminar" on storage.objects for delete to authenticated using (bucket_id='productos');

insert into public.configuracion (id,whatsapp,telefono,horario,sede_arequipa,sede_tacna,banner_home,activo_banner) values
(1,'51952885588','952885588','Lunes a Sábado, 9:00 a.m. – 7:00 p.m.',
 '{"direccion":"Calle Puno N° 310, Miraflores, Arequipa","distrito":"Miraflores","mapa_url":"https://maps.google.com/?q=Calle+Puno+310+Miraflores+Arequipa"}',
 '{}',
 'Cotiza tu Pantoja hoy y empieza una nueva ruta',true) on conflict (id) do nothing;

insert into public.vehiculos (slug,nombre,modelo,categoria,carroceria,anio,moneda,pasajeros,motor,cilindrada,potencia,transmision,caja,combustible,carga,euro,color,equipamiento,accesorios,autopartes,descripcion,destacado,disponible_en,orden) values
('pantoja-zeus','Pantoja Zeus','ZEUS','M2','Minivan',2026,'USD',17,'Gasolina 4 cilindros','2.4 L','134 HP','Manual','Mecánica','Gasolina','Consultar','Euro IV','A elección',array['Aire acondicionado','Frenos ABS','Pantalla multimedia'],array['Faros delanteros','Faro posterior','Espejos retrovisores','Parachoque delantero','Parachoque posterior','Tablero','Puertas laterales','Puerta posterior','Capot delantero','Neblinero','Rejilla delantera','Pisadera R-L'],array['Cables de transmisión L y R','Pedal electrónico de acelerador','Manija jalador de puertas','Manija jalador de puerta trasera','Depósito de rebose de agua de radiador','Filtro de combustible','Filtro de aire','Filtro de aceite','Bobina de encendido','Cables de alto voltaje de encendido','Horquilla','Collarín','Memoria ECU','Tacómetro','Mando mixto de dirección','Turbo','Bomba de combustible','Alternador','Arrancador','Sensor de oxígeno','Tapa de cárter','Cárter','Relay de puertas'],'Minivan grande de pasajeros diseñada para rutas exigentes.',true,array['Arequipa'],1),
('pantoja-pantera','Pantoja Pantera','PANTERA-TOANO','M3','Minibus',2026,'USD',19,'Turbo diésel','2.8 L','150 HP','Manual','Mecánica','Diésel','Consultar','Euro V','A elección',array['Aire acondicionado','Asientos reclinables','Amplio maletero'],array['Faros delanteros','Faro posterior','Espejos retrovisores','Parachoque delantero','Parachoque posterior','Tablero','Puertas laterales','Puerta posterior','Capot delantero','Neblinero','Rejilla delantera','Pisadera R-L'],array['Cables de transmisión L y R','Pedal electrónico de acelerador','Manija jalador de puertas','Manija jalador de puerta trasera','Depósito de rebose de agua de radiador','Filtro de combustible','Filtro de aire','Filtro de aceite','Bobina de encendido','Cables de alto voltaje de encendido','Horquilla','Collarín','Memoria ECU','Tacómetro','Mando mixto de dirección','Turbo','Bomba de combustible','Alternador','Arrancador','Sensor de oxígeno','Tapa de cárter','Cárter','Relay de puertas'],'Van alargada para transporte interprovincial y turismo.',true,array['Arequipa'],2),
('pantoja-bufalin','Pantoja Bufalin','PANTERA-BUFALIN','M2','Microbus',2026,'USD',16,'Turbo diésel','2.5 L','136 HP','Manual','Mecánica','Diésel','Consultar','Euro IV','A elección',array['Techo alto','Frenos ABS','Radio Bluetooth'],array['Faros delanteros','Faro posterior','Espejos retrovisores','Parachoque delantero','Parachoque posterior','Tablero','Puertas laterales','Puerta posterior','Capot delantero','Neblinero','Rejilla delantera','Pisadera R-L'],array['Cables de transmisión L y R','Pedal electrónico de acelerador','Manija jalador de puertas','Manija jalador de puerta trasera','Depósito de rebose de agua de radiador','Filtro de combustible','Filtro de aire','Filtro de aceite','Bobina de encendido','Cables de alto voltaje de encendido','Horquilla','Collarín','Memoria ECU','Tacómetro','Mando mixto de dirección','Turbo','Bomba de combustible','Alternador','Arrancador','Sensor de oxígeno','Tapa de cárter','Cárter','Relay de puertas'],'Combi de techo alto y gran rendimiento.',true,array['Arequipa'],3),
('pantoja-victory','Pantoja Victory','VICTORY','M1','Minivan',2026,'USD',11,'Gasolina','1.5 L','105 HP','Manual','Mecánica','Gasolina','Consultar','Euro IV','A elección',array['Aire acondicionado','Pantalla multimedia','Sensores de retroceso'],array['Faros delanteros','Faro posterior','Espejos retrovisores','Parachoque delantero','Parachoque posterior','Tablero','Puertas laterales','Puerta posterior','Capot delantero','Neblinero','Rejilla delantera','Pisadera R-L'],array['Cables de transmisión L y R','Pedal electrónico de acelerador','Manija jalador de puertas','Manija jalador de puerta trasera','Depósito de rebose de agua de radiador','Filtro de combustible','Filtro de aire','Filtro de aceite','Bobina de encendido','Cables de alto voltaje de encendido','Horquilla','Collarín','Memoria ECU','Tacómetro','Mando mixto de dirección','Turbo','Bomba de combustible','Alternador','Arrancador','Sensor de oxígeno','Tapa de cárter','Cárter','Relay de puertas'],'Minivan compacta y ágil para la ciudad.',true,array['Arequipa'],4)
on conflict (slug) do nothing;

insert into public.repuestos (slug,nombre,sku,categoria,marca,precio,compatible_con,descripcion,stock,destacado) values
('filtro-aceite','Filtro de aceite original','PTJ-001','Filtros','PANTOJA',65,array['ZEUS','PANTERA-TOANO'],'Filtro original Pantoja.','Disponible',true),
('pastillas-freno','Pastillas de freno delanteras','PTJ-002','Frenos','PANTOJA',180,array['PANTERA-BUFALIN','VICTORY'],'Pastillas delanteras de alta duración.','Disponible',true),
('kit-embrague','Kit de embrague reforzado','PTJ-003','Embrague','PANTOJA',890,array['ZEUS','PANTERA-TOANO'],'Kit completo reforzado.','Disponible',true),
('amortiguador-delantero','Amortiguador delantero','PTJ-004','Suspensión','PANTOJA',420,array['PANTERA-BUFALIN','VICTORY'],'Amortiguador original.','Disponible',true),
('faro-delantero','Faro delantero LED','PTJ-005','Eléctrico','PANTOJA',360,array['ZEUS','PANTERA-TOANO'],'Faro completo LED.','Disponible',false),
('espejo-lateral','Espejo lateral completo','PTJ-006','Carrocería','PANTOJA',280,array['PANTERA-BUFALIN','VICTORY'],'Espejo lateral completo.','Disponible',false),
('correa-distribucion','Correa de distribución','PTJ-007','Motor','PANTOJA',230,array['ZEUS','PANTERA-TOANO'],'Correa de distribución original.','Disponible',false),
('filtro-aire','Filtro de aire','PTJ-008','Filtros','PANTOJA',80,array['PANTERA-BUFALIN','VICTORY'],'Filtro de aire para mantenimiento.','Disponible',false),
('disco-freno','Disco de freno ventilado','PTJ-009','Frenos','PANTOJA',290,array['ZEUS','PANTERA-TOANO'],'Disco ventilado original.','Disponible',false),
('alternador','Alternador completo','PTJ-010','Eléctrico','PANTOJA',780,array['PANTERA-BUFALIN','VICTORY'],'Alternador completo.','Disponible',false),
('radiador','Radiador de motor','PTJ-011','Motor','PANTOJA',690,array['ZEUS','PANTERA-TOANO'],'Radiador original.','Bajo pedido',false)
on conflict (slug) do nothing;

