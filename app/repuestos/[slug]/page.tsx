import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { PartCard } from '@/components/PartCard';
import { precioLocal, repuestos as fallbackRepuestos, configuracion as fallbackConfig } from '@/lib/data';
import { mensajesWhatsapp, waLink } from '@/lib/whatsapp';
import { supabasePublic } from '@/lib/supabase/public';

export const revalidate = 30;

export async function generateStaticParams() {
  const supabase = supabasePublic;
  if (supabase) {
    const { data } = await supabase.from('repuestos').select('slug');
    if (data && data.length > 0) {
      return data.map(p => ({ slug: p.slug }));
    }
  }
  return fallbackRepuestos.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = supabasePublic;
  let p = fallbackRepuestos.find(x => x.slug === slug);

  if (supabase) {
    const { data } = await supabase.from('repuestos').select('*').eq('slug', slug).maybeSingle();
    if (data) {
      p = data as any;
    }
  }

  if (!p) return {};
  return {
    title: `${p.nombre} | Repuestos Pantoja`,
    description: p.descripcion,
    openGraph: {
      title: `${p.nombre} | Repuestos Pantoja`,
      description: p.descripcion,
      images: p.imagenes && p.imagenes.length > 0 ? [p.imagenes[0]] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${p.nombre} | Repuestos Pantoja`,
      description: p.descripcion,
      images: p.imagenes && p.imagenes.length > 0 ? [p.imagenes[0]] : []
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = supabasePublic;
  
  let p = fallbackRepuestos.find(x => x.slug === slug);
  let allParts = fallbackRepuestos;
  let siteConfig = fallbackConfig;

  if (supabase) {
    const { data: dbPart } = await supabase.from('repuestos').select('*').eq('slug', slug).maybeSingle();
    if (dbPart) {
      p = dbPart as any;
      
      const { data: dbParts } = await supabase.from('repuestos').select('*').eq('publicado', true);
      if (dbParts && dbParts.length > 0) {
        allParts = dbParts as any;
      }

      const { data: dbConfig } = await supabase.from('configuracion').select('*').eq('id', 1).maybeSingle();
      if (dbConfig) {
        siteConfig = dbConfig as any;
      }
    }
  }

  if (!p) notFound();

  const related = allParts.filter(x => x.id !== p!.id).slice(0, 3);
  const hasImages = p.imagenes && p.imagenes.length > 0;
  const wa = waLink(mensajesWhatsapp.repuesto(p.nombre, p.sku), siteConfig.whatsapp);

  return (
    <>
      <PublicHeader />
      <main className="detail-page">
        <div className="container breadcrumb">
          <Link href="/">Inicio</Link> / <Link href="/repuestos">Repuestos</Link> / {p.nombre}
        </div>
        
        <section className="container product-main">
          <div className="product-gallery part-detail">
            <span className="catalog-badge">{p.categoria}</span>
            {hasImages ? (
              <img 
                src={p.imagenes[0]} 
                alt={p.nombre} 
                style={{ width: '100%', height: 'auto', maxHeight: '450px', borderRadius: '8px', objectFit: 'contain' }} 
              />
            ) : (
              <span className="part-icon">⚙</span>
            )}
          </div>
          
          <div className="product-info">
            <p className="eyebrow dark"><span /> Código {p.sku}</p>
            <h1>{p.nombre}</h1>
            <p>{p.descripcion}</p>
            <span className={`stock ${p.stock === 'Disponible' ? 'in' : 'order'}`}>{p.stock}</span>
            <strong className="detail-price">{precioLocal(p.precio, p.moneda)}</strong>
            <div className="compatibility">
              <b>Compatible con</b>
              {p.compatible_con.map(x => <span key={x}>{x}</span>)}
            </div>
            <div className="detail-actions">
              <a className="card-wa" href={wa} target="_blank" rel="noreferrer">
                Cotizar por WhatsApp
              </a>
              <a className="call-button" href={`tel:+${siteConfig.telefono.replace(/\s+/g, '')}`}>
                Llamar ahora
              </a>
            </div>
          </div>
        </section>
        
        <section className="related container">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark"><span /> Repuestos originales</p>
              <h2>También te puede <em>interesar</em></h2>
            </div>
          </div>
          <div className="catalog-grid">
            {related.map(x => <PartCard key={x.id} part={x} />)}
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
