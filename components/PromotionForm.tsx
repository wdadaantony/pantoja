'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { refreshPromotion } from '@/app/admin/(panel)/promocion/actions';

type Promotion = { promo_popup_activa?: boolean; promo_popup_imagen?: string; promo_popup_url?: string };

export function PromotionForm({ initial }: { initial: Promotion }) {
  const [active, setActive] = useState(initial.promo_popup_activa ?? false);
  const [image, setImage] = useState(initial.promo_popup_imagen ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState(initial.promo_popup_url ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function save(event: React.FormEvent, publish: boolean) {
    event.preventDefault();
    setMessage(''); setError(''); setSaving(true);
    try {
      if (publish && !image) throw new Error('Sube una imagen antes de publicar la promoción.');
      if (url && !['https:', 'http:'].includes(new URL(url).protocol)) throw new Error('El enlace debe empezar por https:// o http://.');
      const client = createClient();
      if (!client) throw new Error('No se pudo conectar con Supabase.');
      let uploadedImage = image;
      if (file) {
        const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
        const path = `config/promocion-${crypto.randomUUID()}.${extension}`;
        const upload = await client.storage.from('productos').upload(path, file, { contentType: file.type });
        if (upload.error) throw upload.error;
        uploadedImage = client.storage.from('productos').getPublicUrl(path).data.publicUrl;
      }
      const result = await client.from('configuracion').upsert({ id: 1, promo_popup_activa: publish, promo_popup_imagen: uploadedImage, promo_popup_url: url.trim() });
      if (result.error) throw result.error;
      setImage(uploadedImage); setFile(null); setActive(publish);
      await refreshPromotion();
      setMessage(publish ? 'Promoción publicada. El popup aparecerá al ingresar a la portada.' : 'Promoción desactivada. El popup ya no se mostrará.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar la promoción.');
    } finally { setSaving(false); }
  }

  return <form className="product-form config-form" onSubmit={event => save(event, true)}>
    <section className="admin-card">
      <h2>Popup de promoción</h2>
      <p>Sube la imagen que verán los visitantes al entrar en la portada.</p>
      <div className="form-grid">
        <p className="full" role="status">Estado: <strong>{active ? 'Publicada' : 'Sin publicar'}</strong></p>
        <label className="full">Imagen de la promoción
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => {
            const selected = e.target.files?.[0];
            if (!selected) return;
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 5 * 1024 * 1024) {
              setError('Selecciona una imagen JPG, PNG o WebP de máximo 5 MB.'); e.target.value = ''; return;
            }
            setError(''); setFile(selected); setImage(URL.createObjectURL(selected));
          }} />
          <small>JPG, PNG o WebP · Máximo 5 MB</small>
        </label>
        {image && <div className="full"><img src={image} alt="Vista previa de la promoción" style={{ maxWidth: '100%', width: 400, maxHeight: 400, objectFit: 'contain' }} /></div>}
        <label className="full">Enlace al pulsar la promoción (opcional)<input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://wa.me/51952885588" /></label>
        <div className="full promotion-actions">
          <button className="admin-primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Publicar'}</button>
          {active && <button className="call-button" type="button" disabled={saving} onClick={event => save(event, false)}>Desactivar popup</button>}
        </div>
        {error && <p className="form-error full" role="alert">{error}</p>}
        {message && <p className="full" role="status">{message}</p>}
      </div>
    </section>
  </form>;
}
