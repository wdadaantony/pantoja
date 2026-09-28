import { notFound } from 'next/navigation';
import { AdminTopbar } from '@/components/AdminTopbar';
import { VehicleForm } from '@/components/VehicleForm';
import { vehiculos as fallbackVehiculos, normalizarVehiculo } from '@/lib/data';
import { supabasePublic } from '@/lib/supabase/public';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let v = fallbackVehiculos.map(normalizarVehiculo).find(x => x.id === id);

  const supabase = supabasePublic;
  if (supabase) {
    const { data } = await supabase.from('vehiculos').select('*').eq('id', id).maybeSingle();
    if (data) v = normalizarVehiculo(data as any);
  }

  if (!v) notFound();

  return (
    <>
      <AdminTopbar title={`Editar ${v.nombre}`} subtitle="Actualiza la información del vehículo" />
      <div className="admin-content form-content">
        <VehicleForm vehicle={v} />
      </div>
    </>
  );
}
