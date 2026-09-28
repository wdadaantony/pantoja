import { notFound } from 'next/navigation';
import { AdminTopbar } from '@/components/AdminTopbar';
import { PartForm } from '@/components/PartForm';
import { repuestos as fallbackRepuestos } from '@/lib/data';
import { supabasePublic } from '@/lib/supabase/public';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let p = fallbackRepuestos.find(x => x.id === id);

  const supabase = supabasePublic;
  if (supabase) {
    const { data } = await supabase.from('repuestos').select('*').eq('id', id).maybeSingle();
    if (data) p = data as typeof fallbackRepuestos[number];
  }

  if (!p) notFound();

  return (
    <>
      <AdminTopbar title={`Editar ${p.nombre}`} subtitle="Actualiza la información del repuesto" />
      <div className="admin-content form-content">
        <PartForm part={p} />
      </div>
    </>
  );
}
