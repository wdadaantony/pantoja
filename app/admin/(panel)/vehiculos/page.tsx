import { AdminTopbar } from '@/components/AdminTopbar';import { AdminVehicleTable } from '@/components/AdminVehicleTable';import { vehiculos } from '@/lib/data';
export default function Page(){return <><AdminTopbar title="Vehículos" subtitle="Administra los vehículos del catálogo"/><div className="admin-content"><AdminVehicleTable initial={vehiculos}/></div></>}
