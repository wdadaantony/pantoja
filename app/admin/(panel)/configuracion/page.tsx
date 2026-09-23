import { AdminTopbar } from '@/components/AdminTopbar';
import { ConfigForm } from '@/components/ConfigForm';
import { createClient } from '@/lib/supabase/server';
import { configuracion as fallbackConfig } from '@/lib/data';

export default async function Page() {
  const supabase = await createClient();
  let initial = fallbackConfig;

  if (supabase) {
    const { data } = await supabase
      .from('configuracion')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    
    if (data) {
      initial = data as any;
    }
  }

  return (
    <>
      <AdminTopbar title="Configuración" subtitle="Edita los datos generales del sitio" />
      <div className="admin-content form-content">
        <ConfigForm initial={initial as any} />
      </div>
    </>
  );
}
