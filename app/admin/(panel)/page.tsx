import Link from 'next/link';
import { AdminTopbar } from '@/components/AdminTopbar';
import { ordenarVehiculosPorModelo, repuestos, vehiculos } from '@/lib/data';
import type { Repuesto, Vehiculo } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let vehicleItems: Pick<Vehiculo, 'id' | 'nombre' | 'modelo' | 'publicado'>[] = vehiculos;
  let partItems: Pick<Repuesto, 'publicado' | 'stock'>[] = repuestos;
  const supabase = await createClient();
  let connected = false;
  if (supabase) {
    const [vehicleResult, partResult] = await Promise.all([
      supabase.from('vehiculos').select('id,nombre,modelo,publicado'),
      supabase.from('repuestos').select('publicado,stock'),
    ]);
    if (!vehicleResult.error && !partResult.error) {
      vehicleItems = vehicleResult.data;
      partItems = partResult.data;
      connected = true;
    }
  }
  const stats = [
    ['Vehículos publicados', vehicleItems.filter(v => v.publicado).length, '▰'],
    ['Vehículos en borrador', vehicleItems.filter(v => !v.publicado).length, '◫'],
    ['Repuestos publicados', partItems.filter(p => p.publicado).length, '⚙'],
    ['Repuestos agotados', partItems.filter(p => p.stock === 'Agotado').length, '!'],
  ];
  return (
    <>
      <AdminTopbar title="Inicio" subtitle="Resumen del catálogo Pantoja" />
      <div className="admin-content">
        <div className="stat-grid">
          {stats.map(([label, value, icon]) => (
            <article key={label}><span>{icon}</span><div><strong>{value}</strong><p>{label}</p></div></article>
          ))}
        </div>
        <div className="dashboard-grid">
          <section className="admin-card">
            <div className="card-heading"><h2>Accesos rápidos</h2></div>
            <div className="quick-links">
              <Link href="/admin/vehiculos/nuevo"><span>▰</span><div><b>Agregar vehículo</b><small>Publica un nuevo modelo o unidad</small></div><i>→</i></Link>
              <Link href="/admin/repuestos/nuevo"><span>⚙</span><div><b>Agregar repuesto</b><small>Registra un repuesto en el catálogo</small></div><i>→</i></Link>
            </div>
          </section>
          <section className="admin-card">
            <div className="card-heading"><h2>Nuestros productos en venta</h2><Link href="/admin/vehiculos">Ver todos</Link></div>
            {ordenarVehiculosPorModelo(vehicleItems.filter(v => v.publicado)).slice(0, 4).map(v => (
              <div className="recent" key={v.id}><span>▰</span><div><b>{v.nombre}</b><small>{v.modelo}</small></div><time>Publicado</time></div>
            ))}
          </section>
        </div>
        <div className="setup-note" role="status">
          <b>{connected ? '✓ Catálogo conectado a Supabase' : 'No se pudo actualizar el resumen'}</b>
          <p>{connected ? 'Los vehículos, repuestos y fotos se guardan en tu proyecto Pantoja. Puedes administrarlos desde este panel.' : 'Se muestran los datos de referencia. Vuelve a cargar la página para consultar los datos actuales.'}</p>
        </div>
      </div>
    </>
  );
}
