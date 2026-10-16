import type { Vehiculo } from '@/lib/data';
import { ordenarVehiculosPorModelo } from '@/lib/data';
import { VehicleCard } from './VehicleCard';

export function VehicleCatalog({ items }: { items: Vehiculo[] }) {
  const vehicles = ordenarVehiculosPorModelo(items);
  return <div className="catalog-layout catalog-simple"><section className="catalog-results" aria-label="Vehículos disponibles">
    {vehicles.length ? <div className="catalog-grid">{vehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="empty-state"><b>No hay vehículos publicados</b><p>Escríbenos por WhatsApp para consultar los modelos disponibles.</p></div>}
  </section></div>;
}
