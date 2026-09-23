import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';
import { VehicleCard } from '@/components/VehicleCard';
import { accesoriosPorModelo, autopartesPorModelo, fichaVehicularSecciones, ordenarVehiculosPorModelo, precioLocal, repuestos as fallbackRepuestos, normalizarVehiculo, vehiculos as fallbackVehiculos, configuracion as fallbackConfig } from '@/lib/data';
import { mensajesWhatsapp, waLink } from '@/lib/whatsapp';
import { PartCard } from '@/components/PartCard';
import { supabasePublic } from '@/lib/supabase/public';

export const revalidate = 30;
function valorFichaVehicular(v: any, key: string) {
  const ficha = v.ficha_tecnica ?? {};
  const base: Record<string, string | number | undefined> = {
    marca: 'PANTOJA',
    modelo_comercial: v.modelo,
    categoria_vehicular: v.categoria,
    clase_vehicular: v.carroceria,
    color_1: v.color,
    anio_modelo: v.anio,
    cilindrada: v.cilindrada,
    potencia: v.potencia,
    transmision: v.transmision,
    caja: v.caja,
    combustible: v.combustible,
    pasajeros: v.pasajeros,
    carga: v.carga,
    norma_gases: v.euro
  };
  const value = ficha[key] ?? base[key];
  return value === undefined || value === null || String(value).trim() === '' ? 'Consultar' : String(value);
}

export async function generateStaticParams() {
  const supabase = supabasePublic;
  if (supabase) {
    const { data } = await supabase.from('vehiculos').select('slug');
    if (data && data.length > 0) {
      return data.map(v => ({ slug: v.slug }));
    }
  }
  return fallbackVehiculos.map(v => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = supabasePublic;
  let v = fallbackVehiculos.map(normalizarVehiculo).find(x => x.slug === slug);

  if (supabase) {
    const { data } = await supabase.from('vehiculos').select('*').eq('slug', slug).maybeSingle();
    if (data) {
      v = normalizarVehiculo(data as any);
    }
  }

  if (!v) return {};
  return {
    title: `${v.nombre} | Pantoja`,
    description: v.descripcion,
    openGraph: {
      title: `${v.nombre} | Pantoja`,
      description: v.descripcion,
      images: v.imagenes && v.imagenes.length > 0 ? [v.imagenes[0]] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${v.nombre} | Pantoja`,
      description: v.descripcion,
      images: v.imagenes && v.imagenes.length > 0 ? [v.imagenes[0]] : []
    }
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = supabasePublic;
  
  let v = fallbackVehiculos.map(normalizarVehiculo).find(x => x.slug === slug);
  let allVehicles = fallbackVehiculos.map(normalizarVehiculo);
  let allParts = fallbackRepuestos;
  let siteConfig = fallbackConfig;

  if (supabase) {
    const { data: dbVehicle } = await supabase.from('vehiculos').select('*').eq('slug', slug).maybeSingle();
    if (dbVehicle) {
      v = normalizarVehiculo(dbVehicle as any);
      
      const { data: dbVehicles } = await supabase.from('vehiculos').select('*').eq('publicado', true);
      if (dbVehicles && dbVehicles.length > 0) {
        allVehicles = (dbVehicles as any[]).map(normalizarVehiculo);
      }
      
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

  if (!v) notFound();

  const related = ordenarVehiculosPorModelo(allVehicles.filter(x => x.id !== v!.id)).slice(0, 3);
  const compatible = allParts.filter(p => p.compatible_con.includes(v!.modelo)).slice(0, 3);
  
  const hasImages = v.imagenes && v.imagenes.length > 0;
  const wa = waLink(mensajesWhatsapp.vehiculo(v.nombre), siteConfig.whatsapp);

  return (
    <>
      <PublicHeader />
      <main className="detail-page">
        <div className="container breadcrumb">
          <Link href="/">Inicio</Link> / <Link href="/vehiculos">Vehículos</Link> / {v.nombre}
        </div>
        
        <section className="container product-main">
          <div className="product-gallery">
            <span className="catalog-badge">{v.modelo}</span>
            {hasImages ? (
              <div className="gallery-wrap">
                <img 
                  className="main-detail-image" 
                  src={v.imagenes[0]} 
                  alt={v.nombre} 
                  style={{ width: '100%', height: 'auto', maxHeight: '450px', borderRadius: '8px', objectFit: 'contain' }} 
                />
                {v.imagenes.length > 1 && (
                  <div className="gallery-thumbs" style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto' }}>
                    {v.imagenes.map((imgUrl, i) => (
                      <img 
                        key={i} 
                        src={imgUrl} 
                        alt={`${v.nombre} ${i + 1}`} 
                        style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover', cursor: 'pointer' }} 
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <Image className="detail-vehicle-image" src="/pantoja-fleet.png" alt={`${v.nombre}, imagen referencial`} fill sizes="(max-width: 700px) 100vw, 55vw"/>
                <p>Imágenes referenciales · agrega fotos reales desde el panel</p>
              </>
            )}
          </div>
          
          <div className="product-info">
            <p className="eyebrow dark"><span /> {v.categoria} · {v.carroceria ?? 'Carrocería a consultar'} · {v.anio}</p>
            <h1>{v.nombre}</h1>
            <p>{v.descripcion}</p>
            <strong className="detail-price">{precioLocal(v.precio, v.moneda)}</strong>
            <div className="detail-actions">
              <a className="card-wa" href={wa} target="_blank" rel="noreferrer">
                Cotizar por WhatsApp
              </a>
              <a className="call-button" href={`tel:+${siteConfig.telefono.replace(/\s+/g, '')}`}>
                Llamar ahora
              </a>
            </div>
            <div className="available">
              <b>Disponible en</b>
              {v.disponible_en.map(s => <span key={s}>● {s}</span>)}
            </div>
          </div>
        </section>

        <section className="spec-section vehicle-id-section">
          <div className="container">
            <div className="vehicle-id-heading">
              <p className="eyebrow"><span /> Ficha técnica</p>
              <h2>Identificación vehicular completa</h2>
              <p>Datos organizados para revisar categoría, registros, motor, capacidad, dimensiones y equipamiento del modelo.</p>
            </div>
            <div className="vehicle-id-grid">
              {fichaVehicularSecciones.map(seccion => (
                <article className="vehicle-id-group" key={seccion.titulo}>
                  <h3>{seccion.titulo}</h3>
                  <small>{seccion.resumen}</small>
                  <dl>
                    {seccion.campos.map(([key, label]) => (
                      <div key={key}>
                        <dt>{label}</dt>
                        <dd>{valorFichaVehicular(v, key)}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
            <div className="vehicle-equipment-strip">
              <h3>Equipamiento destacado</h3>
              <div>{v.equipamiento.map(x => <span key={x}>✓ {x}</span>)}</div>
            </div>
          </div>
        </section>

        <section className="model-parts container">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark"><span /> Por modelo de vehículo</p>
              <h2>Accesorios y <em>autopartes</em></h2>
            </div>
          </div>
          <div className="model-parts-grid">
            <article>
              <h3>Accesorios</h3>
              <ul>{(v.accesorios?.length ? v.accesorios : accesoriosPorModelo).map(item => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <h3>Autopartes y repuestos</h3>
              <ul>{(v.autopartes?.length ? v.autopartes : autopartesPorModelo).map(item => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        </section>
        {compatible.length > 0 && (
          <section className="related container">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark"><span /> Mantén tu Pantoja al 100%</p>
                <h2>Repuestos <em>compatibles</em></h2>
              </div>
            </div>
            <div className="catalog-grid">
              {compatible.map(p => <PartCard key={p.id} part={p} />)}
            </div>
          </section>
        )}

        <section className="related container">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark"><span /> También podrían interesarte</p>
              <h2>Modelos <em>relacionados</em></h2>
            </div>
          </div>
          <div className="catalog-grid">
            {related.map(x => <VehicleCard key={x.id} vehicle={x} />)}
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}


