'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Building2, CarFront, ChevronDown, Clock3, MapPin, Menu, MessageCircle, Phone, Sparkles, Wrench, X } from 'lucide-react';
import { configuracion } from '@/lib/data';
import { mensajesWhatsapp, waLink } from '@/lib/whatsapp';

const menuItems=[
  {href:'/vehiculos',label:'Vehículos',description:'Compara nuestros cuatro modelos exclusivos',icon:CarFront,tone:'red'},
  {href:'/repuestos',label:'Repuestos',description:'Encuentra piezas originales por modelo y categoría',icon:Wrench,tone:'gold'},
  {href:'/nosotros',label:'Nosotros',description:'Conoce la historia y el respaldo de Pantoja',icon:Building2,tone:'dark'},
  {href:'/flash',label:'Flash',description:'Liquidaciones, remates y regalos disponibles',icon:Sparkles,tone:'gold'},
  {href:'/contacto',label:'Contacto',description:'Visítanos en Arequipa',icon:MapPin,tone:'green'},
];

export function PublicHeader(){
  const pathname=usePathname();
  const [isOpen,setIsOpen]=useState(false);
  useEffect(()=>{setIsOpen(false)},[pathname]);
  useEffect(()=>{
    document.body.classList.toggle('menu-is-open',isOpen);
    const onKey=(event:KeyboardEvent)=>event.key==='Escape'&&setIsOpen(false);
    window.addEventListener('keydown',onKey);
    return()=>{document.body.classList.remove('menu-is-open');window.removeEventListener('keydown',onKey)};
  },[isOpen]);
  const wa=waLink(mensajesWhatsapp.general,configuracion.whatsapp);

  return <>
    <div className="topbar"><div className="container topbar-inner"><span><MapPin size={13}/> Arequipa</span><a href={`tel:+51${configuracion.telefono.replace(/\D/g,'')}`}><Phone size={13}/> {configuracion.telefono}</a><span className="topbar-hours"><Clock3 size={13}/> {configuracion.horario}</span></div></div>
    <header className="site-header"><div className="container nav-wrap">
      <Link href="/" className="brand" aria-label="Pantoja, inicio"><Image src="/logo-dorado.png" alt="Pantoja" width={181} height={136}/></Link>
      <nav className="desktop-nav" aria-label="Navegación principal">{menuItems.slice(0,2).map(item=><Link key={item.href} href={item.href} className={pathname.startsWith(item.href)?'active':''}>{item.label}</Link>)}<button className={`explore-trigger ${isOpen?'active':''}`} onClick={()=>setIsOpen(value=>!value)} aria-expanded={isOpen} aria-controls="explore-menu">Explorar <ChevronDown size={14}/></button></nav>
      <a className="wa-button wa-header" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={18}/><span>Hablar con un asesor</span></a>
      <button className={`menu-toggle ${isOpen?'active':''}`} onClick={()=>setIsOpen(value=>!value)} aria-label={isOpen?'Cerrar menú':'Abrir menú'} aria-expanded={isOpen}>{isOpen?<X/>:<Menu/>}<span>Menú</span></button>
    </div></header>
    <div className={`menu-backdrop ${isOpen?'open':''}`} onClick={()=>setIsOpen(false)} aria-hidden="true"/>
    <section id="explore-menu" className={`explore-menu ${isOpen?'open':''}`} aria-hidden={!isOpen}><div className="container explore-inner">
      <div className="explore-intro"><span>EXPLORA PANTOJA</span><h2>¿Qué estás buscando?</h2><p>Elige una opción y te llevamos directo a la información que necesitas.</p><a href={wa} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Necesito orientación</a></div>
      <div className="explore-grid">{menuItems.map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className={`explore-card ${item.tone}`}><span className="explore-icon"><Icon/></span><div><b>{item.label}</b><small>{item.description}</small></div><ArrowUpRight size={18}/></Link>})}</div>
      <div className="explore-contact"><div><MapPin size={16}/><span><b>Arequipa</b>Calle Puno N.° 310</span></div><div><Clock3 size={16}/><span><b>Horario</b>Lun–Sáb · 9 a.m.–7 p.m.</span></div></div>
    </div></section>
  </>;
}
