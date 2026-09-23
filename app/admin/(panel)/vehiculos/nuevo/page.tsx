import { AdminTopbar } from '@/components/AdminTopbar';import { VehicleForm } from '@/components/VehicleForm';
export default function Page(){return <><AdminTopbar title="Agregar vehículo" subtitle="Completa la información del nuevo vehículo"/><div className="admin-content form-content"><VehicleForm/></div></>}
