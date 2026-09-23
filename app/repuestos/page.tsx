import type { Metadata } from 'next';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { PartsCatalog } from '@/components/PartsCatalog';
import { repuestos as fallbackRepuestos } from '@/lib/data';
import { supabasePublic } from '@/lib/supabase/public';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Repuestos originales | Pantoja',
  description: 'Repuestos originales para vehículos Pantoja. Consulta disponibilidad por WhatsApp.'
};

export default async function Page() {
  const supabase = supabasePublic;
  let items = fallbackRepuestos;

  if (supabase) {
    const { data } = await supabase
      .from('repuestos')
      .select('*')
      .eq('publicado', true)
      .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      items = data as any;
    }
  }

  return (
    <>
      <PublicHeader />
      <main className="catalog-page">
        <section className="page-hero parts-hero">
          <div className="container">
            <p>Inicio / Repuestos</p>
            <h1>Originales para seguir <em>en movimiento</em></h1>
            <span>Respaldo y compatibilidad para cada modelo Pantoja.</span>
          </div>
        </section>
        <div className="container">
          <PartsCatalog items={items} />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
