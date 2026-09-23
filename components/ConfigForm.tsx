'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function ConfigForm({ initial }: { initial: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Promo modal states
  const [promoPopupActiva, setPromoPopupActiva] = useState(initial.promo_popup_activa ?? false);
  const [promoImageFile, setPromoImageFile] = useState<File | null>(null);
  const [promoImageUrl, setPromoImageUrl] = useState<string>(initial.promo_popup_imagen ?? '');
  const [promoPopupUrl, setPromoPopupUrl] = useState<string>(initial.promo_popup_url ?? '');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setToast('');

    const client = createClient();
    if (!client) {
      setErrorMsg('Configura las variables de Supabase para guardar cambios.');
      setSaving(false);
      return;
    }

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      // 1. Subir la imagen de la promo si se seleccionó una nueva
      let finalPromoImageUrl = promoImageUrl;
      if (promoImageFile) {
        const extension = promoImageFile.name.split('.').pop() ?? 'jpg';
        const filepath = `config/promo_popup.${extension}`;

        // Upsert para sobrescribir la imagen de promoción anterior
        const { error: uploadError } = await client.storage
          .from('productos')
          .upload(filepath, promoImageFile, { upsert: true });

        if (uploadError) {
          throw new Error(`Error al subir imagen de la promoción: ${uploadError.message}`);
        }

        const { data } = client.storage.from('productos').getPublicUrl(filepath);
        finalPromoImageUrl = data.publicUrl;
      }

      // 2. Preparar el payload
      const payload = {
        id: 1,
        whatsapp: formData.get('whatsapp') as string,
        telefono: formData.get('telefono') as string,
        horario: formData.get('horario') as string,
        sede_arequipa: {
          direccion: formData.get('aqp_direccion') as string,
          mapa_url: formData.get('aqp_mapa_url') as string
        },
        banner_home: formData.get('banner_home') as string,
        activo_banner: formData.get('activo_banner') === 'on',
        promo_popup_activa: promoPopupActiva,
        promo_popup_imagen: finalPromoImageUrl,
        promo_popup_url: promoPopupUrl
      };

      // 3. Guardar configuración en base de datos
      const { error } = await client
        .from('configuracion')
        .upsert([payload]);

      if (error) throw error;

      setToast('Configuración guardada ✓');
      setTimeout(() => {
        setToast('');
        router.refresh();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al guardar la configuración.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="product-form config-form" onSubmit={save}>
      <section>
        <details open>
          <summary>
            <span>1</span>
            <div>
              <b>Contacto</b>
              <small>Números visibles y usados en WhatsApp</small>
            </div>
          </summary>
          <div className="form-grid">
            <label>
              Número de WhatsApp
              <input name="whatsapp" defaultValue={initial.whatsapp} required />
              <small>Incluye el código de país: 51 (ej: 51952885588)</small>
            </label>
            <label>
              Teléfono visible
              <input name="telefono" defaultValue={initial.telefono} required />
            </label>
            <label className="full">
              Horario de atención
              <input name="horario" defaultValue={initial.horario} required />
            </label>
          </div>
        </details>
      </section>

      <section>
        <details open>
          <summary>
            <span>2</span>
            <div>
              <b>Sede Arequipa</b>
              <small>Dirección y mapa</small>
            </div>
          </summary>
          <div className="form-grid">
            <label className="full">
              Dirección
              <input name="aqp_direccion" defaultValue={initial.sede_arequipa?.direccion} required />
            </label>
            <label className="full">
              Link de Google Maps
              <input type="url" name="aqp_mapa_url" defaultValue={initial.sede_arequipa?.mapa_url} required />
            </label>
          </div>
        </details>
      </section>

      <section>
        <details open>
          <summary>
            <span>3</span>
            <div>
              <b>Banner promocional</b>
              <small>Mensaje destacado de la portada</small>
            </div>
          </summary>
          <div className="form-grid">
            <label className="full">
              Texto del banner
              <input name="banner_home" defaultValue={initial.banner_home} required />
            </label>
            <label className="check full">
              <input type="checkbox" name="activo_banner" defaultChecked={initial.activo_banner} /> Mostrar banner en la portada
            </label>
          </div>
        </details>
      </section>

      <section>
        <details open>
          <summary>
            <span>4</span>
            <div>
              <b>Pop-up Promocional (Modal Emergente)</b>
              <small>Ventana que se muestra al ingresar a la web</small>
            </div>
          </summary>
          <div className="form-grid">
            <label className="check full">
              <input 
                type="checkbox" 
                checked={promoPopupActiva} 
                onChange={e => setPromoPopupActiva(e.target.checked)} 
              /> 
              Activar ventana emergente de promoción al entrar al sitio
            </label>
            
            <label className="full">
              Imagen de la Promoción
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPromoImageFile(file);
                    setPromoImageUrl(URL.createObjectURL(file));
                  }
                }} 
              />
              {promoImageUrl && (
                <div style={{ marginTop: '12px' }}>
                  <img 
                    src={promoImageUrl} 
                    alt="Promoción del día" 
                    style={{ maxWidth: '300px', maxHeight: '200px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #ddd' }} 
                  />
                </div>
              )}
            </label>

            <label className="full">
              Enlace de redirección (Opcional)
              <input 
                type="url" 
                value={promoPopupUrl} 
                onChange={e => setPromoPopupUrl(e.target.value)} 
                placeholder="Ej: https://wa.me/51952885588?text=Hola,%20quiero%20la%20promocion..." 
              />
              <small>Al hacer clic en la promoción, el usuario será redirigido a este enlace (ej: WhatsApp o catálogo).</small>
            </label>
          </div>
        </details>
      </section>

      {errorMsg && <p className="form-error" role="alert" style={{ color: 'red', marginTop: '15px' }}>{errorMsg}</p>}
      {toast && <div className="toast">{toast}</div>}

      <div className="form-actions">
        <button className="admin-primary" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar configuración'}
        </button>
      </div>
    </form>
  );
}
