'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import type { Repuesto } from '@/lib/data';
import { modelosVehiculo } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  nombre: z.string().min(3, 'Ingresa el nombre'),
  precio: z.string().optional().or(z.literal('')),
  descripcion: z.string().optional().or(z.literal('')),
  modelo: z.string().min(1, 'Selecciona el modelo')
});

type Values = z.infer<typeof schema>;

export function PartForm({ part }: { part?: Repuesto }) {
  const router = useRouter();
  const [saved, setSaved] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [stock, setStock] = useState<'Disponible' | 'Bajo pedido' | 'Agotado'>((part?.stock as any) ?? 'Disponible');
  const [publicado, setPublicado] = useState(part?.publicado ?? true);
  const [photos, setPhotos] = useState<Array<{ file?: File; url: string }>>(part?.imagenes?.map(url => ({ url })) ?? []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: part?.nombre ?? '',
      precio: part?.precio !== null && part?.precio !== undefined ? String(part.precio) : '',
      descripcion: part?.descripcion ?? '',
      modelo: part?.compatible_con?.[0] ?? ''
    }
  });

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 5 * 1024 * 1024);
    setPhotos(old => [...old, ...valid.map(file => ({ file, url: URL.createObjectURL(file) }))]);
  }

  function removePhoto(idx: number) {
    setPhotos(old => old.filter((_, i) => i !== idx));
  }

  async function save(values: Values) {
    setErrorMsg('');
    const client = createClient();
    if (!client) {
      setErrorMsg('Configura las variables de Supabase para guardar cambios.');
      return;
    }

    try {
      const baseSlug = `${values.modelo}-${values.nombre}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uploadedUrls: string[] = [];
      for (const photo of photos) {
        if (photo.file) {
          const extension = photo.file.name.split('.').pop() ?? 'jpg';
          const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
          const filepath = `repuestos/${baseSlug}/${filename}`;
          const { error: uploadError } = await client.storage.from('productos').upload(filepath, photo.file);
          if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`);
          const { data } = client.storage.from('productos').getPublicUrl(filepath);
          uploadedUrls.push(data.publicUrl);
        } else {
          uploadedUrls.push(photo.url);
        }
      }

      const payload = {
        nombre: values.nombre,
        sku: part?.sku ?? baseSlug.toUpperCase().slice(0, 24),
        slug: baseSlug,
        categoria: 'Accesorios y repuestos',
        marca: 'PANTOJA',
        precio: values.precio ? parseFloat(values.precio) : null,
        moneda: 'PEN',
        stock,
        compatible_con: [values.modelo],
        descripcion: values.descripcion || `Accesorio o repuesto para ${values.modelo}.`,
        publicado,
        destacado: false,
        imagenes: uploadedUrls
      };

      if (part?.id) {
        const { error } = await client.from('repuestos').update(payload).eq('id', part.id);
        if (error) throw error;
      } else {
        const { error } = await client.from('repuestos').insert([payload]);
        if (error) throw error;
      }

      setSaved('Accesorio o repuesto guardado ✓');
      setTimeout(() => { setSaved(''); router.push('/admin/repuestos'); router.refresh(); }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al guardar.');
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit(save)}>
      <section>
        <details open>
          <summary><span>1</span><div><b>Accesorio o repuesto por modelo</b><small>Foto, nombre, precio y stock</small></div></summary>
          <div className="form-grid">
            <label>Modelo<select {...register('modelo')}><option value="">Seleccionar</option>{modelosVehiculo.map(m => <option key={m} value={m}>{m}</option>)}</select>{errors.modelo && <em>{errors.modelo.message}</em>}</label>
            <label>Nombre<input {...register('nombre')} placeholder="Ej. Faro delantero" />{errors.nombre && <em>{errors.nombre.message}</em>}</label>
            <label>Precio en soles<input type="number" step="any" {...register('precio')} placeholder="Ej. 180" /></label>
            <label>Stock<select value={stock} onChange={e => setStock(e.target.value as any)}><option value="Disponible">Disponible</option><option value="Bajo pedido">Bajo pedido</option><option value="Agotado">Agotado</option></select></label>
            <label className="full">Descripción opcional<textarea rows={3} {...register('descripcion')} placeholder="Detalle interno o compatibilidad" /></label>
          </div>
        </details>
      </section>
      <section>
        <details open>
          <summary><span>2</span><div><b>Foto y publicación</b><small>Sube imagen y deja listo para venta</small></div></summary>
          <div className="details-body">
            <label className="dropzone"><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos} /><b>Subir foto o imagen</b><span>JPG, PNG o WebP · Máximo 5 MB por archivo</span></label>
            <div className="photo-previews">{photos.map((photo, i) => <figure key={photo.url}><img src={photo.url} alt={`Vista previa ${i + 1}`} />{i === 0 && <b>Portada</b>}<button type="button" onClick={() => removePhoto(i)}>×</button></figure>)}</div>
            <div className="checks" style={{ marginTop: '20px' }}><label><input type="checkbox" checked={publicado} onChange={e => setPublicado(e.target.checked)} /> Publicado</label></div>
          </div>
        </details>
      </section>
      {errorMsg && <p className="form-error" role="alert" style={{ color: 'red', marginTop: '15px' }}>{errorMsg}</p>}
      {saved && <div className="toast">{saved}</div>}
      <div className="form-actions"><button type="button" onClick={() => router.back()}>Cancelar</button><button className="admin-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando…' : 'Guardar'}</button></div>
    </form>
  );
}
