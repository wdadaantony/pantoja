import type { Metadata } from 'next';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { VehicleCatalog } from '@/components/VehicleCatalog';
import { normalizarVehiculo, ordenarVehiculosPorModelo, vehiculos as fallbackVehiculos } from '@/lib/data';
import { supabasePublic } from '@/lib/supabase/public';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Catálogo de vehículos | Pantoja',
  description: 'Explora minivans, combis y vans Pantoja disponibles en Arequipa.'
};

export default async function Page() {
  const supabase = supabasePublic;
  let items = ordenarVehiculosPorModelo(fallbackVehiculos.map(normalizarVehiculo));

  if (supabase) {
    const { data } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('publicado', true)
      .order('orden', { ascending: true });
    
    if (data && data.length > 0) {
      items = ordenarVehiculosPorModelo((data as any[]).map(normalizarVehiculo));
    }
  }

  return (
    <>
      <PublicHeader />
      <main className="catalog-page">
        <section className="page-hero">
          <div className="container">
            <p>Inicio / Vehículos</p>
            <h1>Vehículos que mueven <em>tu progreso</em></h1>
            <span>Encuentra el modelo ideal para tu ruta, negocio o familia.</span>
          </div>
        </section>
        <div className="container">
          <VehicleCatalog items={items} />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}

