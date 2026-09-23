import { AdminTopbar } from '@/components/AdminTopbar';import { AdminPartsTable } from '@/components/AdminPartsTable';import { repuestos } from '@/lib/data';
export default function Page(){return <><AdminTopbar title="Repuestos" subtitle="Administra el catálogo de repuestos"/><div className="admin-content"><AdminPartsTable initial={repuestos}/></div></>}
