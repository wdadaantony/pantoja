import Link from 'next/link';
import { MessageCircle, Wrench } from 'lucide-react';
import type { Repuesto } from '@/lib/data';
import { precioLocal } from '@/lib/data';
import { mensajesWhatsapp, waLink } from '@/lib/whatsapp';

export function PartCard({ part }: { part: Repuesto }) {
  const hasImages = part.imagenes && part.imagenes.length > 0;

  return (
    <article className="catalog-card part-card">
      <Link className="catalog-visual part-visual" href={`/repuestos/${part.slug}`}>
        <span className="catalog-badge">{part.categoria}</span>
        {hasImages ? (
          <img 
            src={part.imagenes[0]} 
            alt={part.nombre} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <span className="part-icon"><Wrench size={68}/></span>
        )}
      </Link>
      <div className="catalog-card-body">
        <p>{part.marca} · {part.sku}</p>
        <h2>
          <Link href={`/repuestos/${part.slug}`}>{part.nombre}</Link>
        </h2>
        <span className={`stock ${part.stock === 'Disponible' ? 'in' : 'order'}`}>{part.stock}</span>
        <strong>{precioLocal(part.precio, part.moneda)}</strong>
        <a className="card-wa" href={waLink(mensajesWhatsapp.repuesto(part.nombre, part.sku))} target="_blank" rel="noreferrer">
          <MessageCircle size={15}/> Cotizar por WhatsApp
        </a>
      </div>
    </article>
  );
}
