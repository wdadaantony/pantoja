'use client';

import { useState } from 'react';
import { waLink } from '@/lib/whatsapp';

export function ContactForm(){
  const [nombre,setNombre]=useState(''); const [ciudad,setCiudad]=useState('Arequipa'); const [consulta,setConsulta]=useState('');
  function submit(e:React.FormEvent){e.preventDefault();window.open(waLink(`Hola PANTOJA 👋, soy ${nombre} de ${ciudad}. ${consulta}`),'_blank','noopener,noreferrer')}
  return <form className="contact-form" onSubmit={submit}><label>Nombre completo<input required value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="¿Cómo te llamas?"/></label><label>Ciudad<select value={ciudad} onChange={e=>setCiudad(e.target.value)}><option>Arequipa</option><option>Otra ciudad</option></select></label><label className="full">¿En qué podemos ayudarte?<textarea required rows={5} value={consulta} onChange={e=>setConsulta(e.target.value)} placeholder="Cuéntanos qué vehículo o repuesto estás buscando"/></label><button className="card-wa full" type="submit">Enviar consulta por WhatsApp</button></form>
}
