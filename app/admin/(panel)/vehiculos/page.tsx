import { AdminTopbar } from '@/components/AdminTopbar';
import { AdminVehicleTable } from '@/components/AdminVehicleTable';
import { vehiculos as fallbackVehiculos, normalizarVehiculo } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let items = fallbackVehiculos.map(normalizarVehiculo);

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.from('vehiculos').select('*').order('created_at', { ascending: false });
    if (data) {
      items = data.map(normalizarVehiculo);
    }
  }

  return (
    <>
      <AdminTopbar title="Vehículos" subtitle="Administra los vehículos del catálogo" />
      <div className="admin-content">
        <AdminVehicleTable initial={items} />
      </div>
    </>
  );
}
