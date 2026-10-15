import { AdminTopbar } from '@/components/AdminTopbar';
import { PromotionForm } from '@/components/PromotionForm';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const client = await createClient();
  if (!client) return <p>No se pudo conectar con Supabase.</p>;
  const { data, error } = await client.from('configuracion').select('promo_popup_activa,promo_popup_imagen,promo_popup_url').eq('id', 1).maybeSingle();
  return <><AdminTopbar title="Promoción" subtitle="Administra el popup de la portada" /><div className="admin-content form-content">{error ? <p role="alert">No se pudo cargar la promoción. Recarga la página para volver a intentarlo.</p> : <PromotionForm initial={data ?? {}} />}</div></>;
}
