import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, CarFront, Headphones, MapPin, MessageCircle, PackageCheck, ShieldCheck, Sparkles, Users, Wrench } from 'lucide-react';
import { supabasePublic } from '@/lib/supabase/public';
import { PromoModal } from '@/components/PromoModal';
import { imagenesPorModelo, ordenarVehiculosPorModelo } from '@/lib/data';
import { PublicHeader } from '@/components/PublicHeader';
import { PublicFooter } from '@/components/PublicFooter';

export const revalidate=30;

const modelos=ordenarVehiculosPorModelo([
  {nombre:'PANTERA-BUFALIN',modelo:'PANTERA-BUFALIN',tipo:'Combi de techo alto',pasajeros:'Potencia para trabajar',slug:'pantoja-bufalin',imagen:imagenesPorModelo['PANTERA-BUFALIN'][0]},
  {nombre:'PANTERA-TOANO',modelo:'PANTERA-TOANO',tipo:'Van alargada',pasajeros:'Espacio para grandes rutas',slug:'pantoja-pantera',imagen:imagenesPorModelo['PANTERA-TOANO'][0]},
  {nombre:'VICTORY',modelo:'VICTORY',tipo:'Minivan compacta',pasajeros:'Ágil para la ciudad',slug:'pantoja-victory',imagen:imagenesPorModelo.VICTORY[0]},
  {nombre:'ZEUS',modelo:'ZEUS',tipo:'Minivan de pasajeros',pasajeros:'Hasta 17 pasajeros',slug:'pantoja-zeus',imagen:imagenesPorModelo.ZEUS[0]},
]);

export default async function Home(){
  let promoConfig={active:false,image:'',url:''};
  if(supabasePublic){const {data}=await supabasePublic.from('configuracion').select('promo_popup_activa, promo_popup_imagen, promo_popup_url').eq('id',1).maybeSingle();if(data)promoConfig={active:data.promo_popup_activa??false,image:data.promo_popup_imagen??'',url:data.promo_popup_url??''}}
  const wa='https://wa.me/51952885588?text=Hola%20PANTOJA%20%F0%9F%91%8B%2C%20quisiera%20informaci%C3%B3n%20sobre%20sus%20veh%C3%ADculos.';
  return <main>
    <PromoModal active={promoConfig.active} image={promoConfig.image} url={promoConfig.url}/>
    <PublicHeader/>

    <section className="hero hero-v2" id="inicio">
      <div className="hero-media"><Image src="/pantoja-fleet.png" alt="Gama de vans y minivans Pantoja en carretera" fill priority sizes="100vw"/><div className="hero-noise"/></div>
      <div className="container hero-content"><div className="hero-copy">
        <div className="hero-kicker"><span>MODELOS 2026</span><small>MARCA EXCLUSIVA PERUANA</small></div>
        <h1>La ruta es tuya.<br/><em>Conquístala.</em></h1>
        <p className="hero-lead">Vehículos creados para trabajar, crecer y llegar más lejos. Atención directa en Arequipa, repuestos originales y respaldo real.</p>
        <div className="hero-actions"><Link className="primary-button" href="/vehiculos">Explorar vehículos <ArrowRight size={18}/></Link><a className="ghost-button" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Cotizar ahora</a></div>
        <div className="hero-proof"><div className="proof-avatars"><span>Z</span><span>P</span><span>B</span><span>V</span></div><span><b>4 modelos exclusivos</b><br/>para transporte, negocio y familia</span></div>
      </div></div>
      <div className="hero-scroll"><i/> DESLIZA PARA DESCUBRIR</div>
    </section>

    <section className="category-rail"><div className="container category-grid" data-reveal>
      <Link href="/vehiculos"><Users/><span><b>Pasajeros</b><small>Capacidad, comodidad y seguridad</small></span></Link>
      <Link href="/vehiculos"><CarFront/><span><b>Trabajo y carga</b><small>Rendimiento para cada jornada</small></span></Link>
      <Link href="/repuestos"><Wrench/><span><b>Repuestos</b><small>Originales y compatibles</small></span></Link>
      <Link href="/contacto"><Headphones/><span><b>Asesoría</b><small>Te ayudamos a elegir</small></span></Link>
    </div></section>

    <section className="modelos modelos-v2" id="modelos"><div className="container">
      <div className="section-heading" data-reveal><div><p className="eyebrow dark"><span/> Diseñados para avanzar</p><h2>Un modelo para cada <em>nueva ruta</em></h2></div><Link href="/vehiculos">Comparar todos →</Link></div>
      <div className="model-grid-v2">{modelos.map((modelo,index)=><article className="model-card-v2" key={modelo.nombre} data-reveal>
        <Image src={modelo.imagen} alt={`${modelo.nombre}, vehículo Pantoja`} fill sizes="(max-width: 900px) 100vw, 50vw"/>
        <div className="model-number">0{index+1}</div><div className="model-content-v2"><span>{modelo.tipo}</span><h3>{modelo.nombre}</h3><p>{modelo.pasajeros}</p><div className="model-actions"><Link href={`/vehiculos/${modelo.slug}`}>Conocer modelo <ArrowRight size={13}/></Link><a href={`https://wa.me/51952885588?text=${encodeURIComponent(`Hola PANTOJA 👋, estoy interesado en la ${modelo.nombre}. ¿Me pueden dar más información?`)}`} target="_blank" rel="noreferrer">Cotizar</a></div></div>
      </article>)}</div>
    </div></section>

    <section className="trust trust-v2"><div className="container trust-grid">
      <div><span><ShieldCheck/></span><h3>Garantía de fábrica</h3><p>Tu inversión siempre respaldada.</p></div>
      <div><span><PackageCheck/></span><h3>Repuestos originales</h3><p>Disponibilidad para seguir en ruta.</p></div>
      <div><span><BadgeCheck/></span><h3>Servicio postventa</h3><p>Te acompañamos después de la compra.</p></div>
      <div><span><Sparkles/></span><h3>Atención directa</h3><p>Asesoría humana en Arequipa.</p></div>
    </div></section>

    <section className="cta-band"><div className="container cta-inner" data-reveal><div><span><MessageCircle/></span><div><h2>¿No sabes qué modelo elegir?</h2><p>Cuéntanos tu ruta, capacidad y presupuesto. Un asesor te orientará sin compromiso.</p></div></div><a href={wa} target="_blank" rel="noreferrer">Hablar con un asesor <ArrowRight size={16}/></a></div></section>

    <section className="locations locations-v2" id="sedes"><div className="container locations-wrap">
      <div data-reveal><p className="eyebrow dark"><span/> Cerca de ti</p><h2>Visítanos en<br/><em>Arequipa</em></h2><p>Conoce nuestros vehículos, recibe atención personalizada y encuentra el repuesto que necesitas.</p></div>
      <article><small>SEDE 01</small><h3>Arequipa</h3><p>Calle Puno N.° 310<br/>Miraflores, Arequipa</p><a href="https://maps.google.com/?q=Calle+Puno+310+Miraflores+Arequipa" target="_blank" rel="noreferrer"><MapPin size={13}/> Cómo llegar</a></article>
    </div></section>
    <PublicFooter/>
  </main>;
}

