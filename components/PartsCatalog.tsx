import type { Repuesto } from '@/lib/data';
import { PartCard } from './PartCard';

export function PartsCatalog({ items }: { items: Repuesto[] }) {
  return <div className="catalog-layout catalog-simple"><section className="catalog-results" aria-label="Repuestos disponibles">
    {items.length ? <div className="catalog-grid">{items.map(part => <PartCard key={part.id} part={part} />)}</div> : <div className="empty-state"><b>No hay repuestos publicados</b><p>Escríbenos por WhatsApp para consultar el repuesto que necesitas.</p></div>}
  </section></div>;
}
