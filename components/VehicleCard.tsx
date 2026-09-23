import Link from 'next/link';
import Image from 'next/image';
import { Fuel, MessageCircle, Settings2, Users } from 'lucide-react';
import type { Vehiculo } from '@/lib/data';
import { precioLocal } from '@/lib/data';
import { mensajesWhatsapp, waLink } from '@/lib/whatsapp';

export function VehicleCard({ vehicle }: { vehicle: Vehiculo }) {
  const hasImages = vehicle.imagenes && vehicle.imagenes.length > 0;

  return (
    <article className="catalog-card">
      <Link className="catalog-visual" href={`/vehiculos/${vehicle.slug}`} aria-label={`Ver ${vehicle.nombre}`}>
        <span className="catalog-badge">{vehicle.modelo}</span>
        {hasImages ? (
          <img 
            className="catalog-vehicle-image"
            src={vehicle.imagenes[0]} 
            alt={vehicle.nombre} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <Image className="catalog-vehicle-image" src="/pantoja-fleet.png" alt={`${vehicle.nombre}, imagen referencial`} fill sizes="(max-width: 700px) 100vw, 33vw"/>
        )}
      </Link>
      <div className="catalog-card-body">
        <p>{vehicle.categoria} · {vehicle.carroceria ?? 'Carrocería a consultar'} · {vehicle.anio}</p>
        <h2>
          <Link href={`/vehiculos/${vehicle.slug}`}>{vehicle.nombre}</Link>
        </h2>
        <div className="quick-specs">
          <span><Users size={13}/> {vehicle.pasajeros} pasajeros</span>
          <span><Settings2 size={13}/> {vehicle.transmision}</span>
          <span><Fuel size={13}/> {vehicle.combustible}</span>
        </div>
        <strong>{precioLocal(vehicle.precio, vehicle.moneda)}</strong>
        <a className="card-wa" href={waLink(mensajesWhatsapp.vehiculo(vehicle.nombre))} target="_blank" rel="noreferrer">
          <MessageCircle size={15}/> Cotizar por WhatsApp
        </a>
      </div>
    </article>
  );
}

