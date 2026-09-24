import { AdminTopbar } from '@/components/AdminTopbar';
import { AdminPartsTable } from '@/components/AdminPartsTable';
import { repuestos as fallbackRepuestos } from '@/lib/data';
import { supabasePublic } from '@/lib/supabase/public';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let items = fallbackRepuestos;

  const supabase = supabasePublic;
  if (supabase) {
    const { data } = await supabase.from('repuestos').select('*').order('created_at', { ascending: false });
    if (data) {
      items = data as typeof fallbackRepuestos;
    }
  }

  return (
    <>
      <AdminTopbar title="Repuestos" subtitle="Administra el catálogo de repuestos" />
      <div className="admin-content">
        <AdminPartsTable initial={items} />
      </div>
    </>
  );
}
