-- Catalog photos supplied by the owner, edited onto white backgrounds.
-- Additions are repeatable. Existing specifications and prices are preserved.
begin;

-- Keep test records available to the owner as drafts, not public products.
update public.vehiculos set publicado = false where slug in ('prueba', 'dcvsdv');
update public.repuestos set publicado = false where slug = 'mudam-prueba';
update public.vehiculos set nombre = 'Pantoja Zeus 20 pasajeros'
where slug = 'pantoja' and modelo = 'ZEUS' and nombre = 'PANTOJA';

update public.vehiculos
set imagenes = array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/zeus.webp']
  || array_remove(coalesce(imagenes, '{}'), 'https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/zeus.webp')
where slug in ('pantoja-zeus', 'pantoja');

update public.vehiculos
set modelo = 'PANTERA',
    imagenes = array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/pantera.webp']
      || array_remove(coalesce(imagenes, '{}'), 'https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/pantera.webp')
where slug = 'pantoja-pantera';

update public.vehiculos
set modelo = 'BUFALIN',
    imagenes = array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/bufalin.webp']
      || array_remove(coalesce(imagenes, '{}'), 'https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/bufalin.webp')
where slug = 'pantoja-bufalin';

update public.vehiculos
set imagenes = array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/victory.webp']
  || array_remove(coalesce(imagenes, '{}'), 'https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/victory.webp')
where slug = 'pantoja-victory';

insert into public.vehiculos
  (slug, nombre, modelo, categoria, carroceria, precio, moneda, descripcion, imagenes, publicado, destacado, disponible_en, orden)
values
  ('pantoja-bufalin-foton', 'Pantoja Bufalin Foton', 'BUFALIN-FOTON', 'Consultar', 'Minivan', null, 'USD',
   'Bufalin Foton. Consulta con nuestro equipo la capacidad, el equipamiento y las especificaciones de la unidad disponible.',
   array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/bufalin-foton.webp'], true, true, array['Arequipa'], 5),
  ('pantoja-pantera-toano', 'Pantoja Pantera-Toano', 'PANTERA-TOANO', 'Consultar', 'Minibus', null, 'USD',
   'Pantera-Toano. Consulta con nuestro equipo la capacidad, el equipamiento y las especificaciones de la unidad disponible.',
   array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/pantera-toano.webp'], true, true, array['Arequipa'], 6),
  ('pantoja-couster-urbano', 'Pantoja Couster Urbano', 'COUSTER-URBANO', 'Consultar', 'Couster', null, 'USD',
   'Couster Urbano. Consulta con nuestro equipo la capacidad, el equipamiento y las especificaciones de la unidad disponible.',
   array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/couster-urbano.webp'], true, true, array['Arequipa'], 7)
on conflict (slug) do update
set nombre = excluded.nombre, modelo = excluded.modelo,
    imagenes = excluded.imagenes || array_remove(coalesce(vehiculos.imagenes, '{}'), excluded.imagenes[1]);

insert into public.repuestos
  (slug, nombre, sku, categoria, marca, precio, moneda, compatible_con, descripcion, imagenes, stock, destacado, publicado)
values
  ('collarin-y-horquilla', 'Collarín y horquilla', 'PTJ-CH-001', 'Embrague', 'PANTOJA', null, 'PEN', '{}',
   'Collarín y horquilla de embrague. Consulta disponibilidad y compatibilidad con tu modelo antes de cotizar.',
   array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/collarin-horquilla.webp'], 'Bajo pedido', true, true),
  ('filtro-de-combustible', 'Filtro de combustible', 'PTJ-FC-001', 'Filtros', 'PANTOJA', null, 'PEN', '{}',
   'Filtro de combustible. Consulta disponibilidad y compatibilidad con tu modelo antes de cotizar.',
   array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/filtro-combustible.webp'], 'Bajo pedido', true, true),
  ('mando-mixto-de-direccion', 'Mando mixto de dirección', 'PTJ-MD-001', 'Eléctrico', 'PANTOJA', null, 'PEN', '{}',
   'Mando mixto de dirección. Consulta disponibilidad y compatibilidad con tu modelo antes de cotizar.',
   array['https://wdvptqyybwhxxtdhmemh.supabase.co/storage/v1/object/public/productos/catalogo/2026-10-15/mando-direccion.webp'], 'Bajo pedido', true, true)
on conflict (slug) do update
set nombre = excluded.nombre,
    imagenes = excluded.imagenes || array_remove(coalesce(repuestos.imagenes, '{}'), excluded.imagenes[1]);

commit;
