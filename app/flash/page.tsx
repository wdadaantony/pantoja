import type { Metadata } from 'next';
import Link from 'next/link';
import { Gift, MessageCircle, Sparkles, Tags } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { repuestos as fallbackRepuestos, precioLocal } from '@/lib/data';
import { supabasePublic } from '@/lib/supabase/public';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Flash | Pantoja',
  description: 'Liquidaciones, remates, regalos y oportunidades especiales Pantoja.'
};

export default async function Page() {
  let items = fallbackRepuestos.filter(item => item.destacado).slice(0, 12);
  if (supabasePublic) {
    const { data } = await supabasePublic.from('repuestos').select('*').eq('publicado', true).eq('destacado', true).order('created_at', { ascending: false }).limit(12);
    if (data && data.length > 0) items = data as any;
  }

  return (
    <>
      <PublicHeader />
      <main className="catalog-page flash-page">
        <section className="page-hero parts-hero">
          <div className="container">
            <p>Inicio / Flash</p>
            <h1>Flash <em>Pantoja</em></h1>
            <span>Liquidaciones, remates, regalos y oportunidades por tiempo limitado.</span>
          </div>
        </section>
        <section className="container flash-grid-section">
          <div className="section-heading">
            <div><p className="eyebrow dark"><span /> Oportunidades</p><h2>Productos <em>en promoción</em></h2></div>
            <Link href="/contacto">Consultar disponibilidad →</Link>
          </div>
          {items.length ? <div className="catalog-grid">{items.map(item => <article className="catalog-card" key={item.id}><div className="catalog-visual part-visual">{item.imagenes?.[0] ? <img className="catalog-vehicle-image" src={item.imagenes[0]} alt={item.nombre} /> : <Sparkles />}</div><div className="catalog-card-body"><p>{item.compatible_con.join(', ') || 'PANTOJA'}</p><h2>{item.nombre}</h2><div className="quick-specs"><span><Tags size={13}/> {precioLocal(item.precio, item.moneda)}</span><span><Gift size={13}/> {item.stock}</span></div><a className="card-wa" href={`https://wa.me/51952885588?text=${encodeURIComponent(`Hola PANTOJA, quiero consultar por FLASH: ${item.nombre}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={15}/> Consultar</a></div></article>)}</div> : <div className="empty-state"><b>Próximamente</b><p>Aquí se publicarán liquidaciones, remates y regalos disponibles.</p></div>}
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
