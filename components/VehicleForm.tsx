'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import type { Vehiculo } from '@/lib/data';
import { fichaVehicularCampos, fichaVehicularSecciones } from '@/lib/data';
import { fichaCamposBase, valorTecnico } from '@/lib/technical-sheet';
import { createClient } from '@/lib/supabase/client';

function fichaDefault(vehicle: Vehiculo | undefined) {
  const ficha = (vehicle as any)?.ficha_tecnica as Record<string, string> | undefined;
  return { ...ficha, ...Object.fromEntries(fichaVehicularCampos.map(([name]) => [name, valorTecnico(vehicle, name)])) };
}


const schema = z.object({
  nombre: z.string().min(3, 'Ingresa un nombre de al menos 3 caracteres'),
  slug: z.string().min(3, 'Ingresa un slug válido').regex(/^[a-z0-9-]+$/, 'Usa solo minúsculas, números y guiones'),
  modelo: z.string().min(1, 'Selecciona un modelo'),
  categoria: z.string().min(1, 'Selecciona una categoría'),
  anio: z.string().min(4, 'Ingresa el año'),
  carroceria: z.string().min(1, 'Selecciona una carrocería'),
  color: z.string().optional().or(z.literal('')),
  caja: z.string().optional().or(z.literal('')),
  carga: z.string().optional().or(z.literal('')),
  euro: z.string().optional().or(z.literal('')),
  descripcion: z.string().min(20, 'Describe el vehículo con al menos 20 caracteres'),
  precio: z.string().optional().or(z.literal('')),
  moneda: z.string(),
  pasajeros: z.string().optional().or(z.literal('')),
  motor: z.string().optional().or(z.literal('')),
  cilindrada: z.string().optional().or(z.literal('')),
  potencia: z.string().optional().or(z.literal('')),
  transmision: z.string(),
  combustible: z.string(),
  ficha: z.record(z.string(), z.string().optional().or(z.literal(''))).optional()
});

type Values = z.infer<typeof schema>;

export function VehicleForm({ vehicle }: { vehicle?: Vehiculo }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<Array<{ file?: File; url: string }>>(
    vehicle?.imagenes?.map(url => ({ url })) ?? []
  );
  const [equipment, setEquipment] = useState<string[]>(vehicle?.equipamiento ?? []);
  const [tag, setTag] = useState('');
  const [saved, setSaved] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Disponibilidad y publicación states
  const [aqp, setAqp] = useState(vehicle ? vehicle.disponible_en.includes('Arequipa') : true);
  const [publicado, setPublicado] = useState(vehicle?.publicado ?? true);
  const [destacado, setDestacado] = useState(vehicle?.destacado ?? false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: vehicle?.nombre ?? '',
      slug: vehicle?.slug ?? '',
      modelo: vehicle?.modelo ?? '',
      categoria: vehicle?.categoria ?? '',
      anio: String(vehicle?.anio ?? 2026),
      carroceria: vehicle?.carroceria ?? '',
      color: vehicle?.color ?? '',
      caja: vehicle?.caja ?? '',
      carga: vehicle?.carga ?? '',
      euro: vehicle?.euro ?? '',
      descripcion: vehicle?.descripcion ?? '',
      precio: vehicle?.precio !== null && vehicle?.precio !== undefined ? String(vehicle.precio) : '',
      moneda: vehicle?.moneda ?? 'USD',
      pasajeros: vehicle?.pasajeros !== null && vehicle?.pasajeros !== undefined ? String(vehicle.pasajeros) : '',
      motor: vehicle?.motor ?? '',
      cilindrada: vehicle?.cilindrada ?? '',
      potencia: vehicle?.potencia ?? '',
      transmision: vehicle?.transmision ?? 'Manual',
      combustible: vehicle?.combustible ?? 'Gasolina',
      ficha: fichaDefault(vehicle),
      ...(vehicle ? Object.fromEntries(Object.entries(fichaCamposBase).map(([key, field]) => [field, valorTecnico(vehicle, key)])) : {})
    }
  });

  const nombre = watch('nombre');

  useEffect(() => {
    if (!vehicle && nombre) {
      setValue(
        'slug',
        nombre
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        { shouldDirty: true }
      );
    }
  }, [nombre, setValue, vehicle]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && tag.trim()) {
      e.preventDefault();
      if (!equipment.includes(tag.trim())) {
        setEquipment(x => [...x, tag.trim()]);
      }
      setTag('');
    }
  }

  function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter(
      f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) && f.size <= 5 * 1024 * 1024
    );
    const newPhotos = valid.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setPhotos(old => [...old, ...newPhotos]);
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
      // 1. Subir imágenes nuevas a Supabase Storage
      const uploadedUrls: string[] = [];

      for (const photo of photos) {
        if (photo.file) {
          const extension = photo.file.name.split('.').pop() ?? 'jpg';
          const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
          const filepath = `vehiculos/${values.slug}/${filename}`;

          const { error: uploadError } = await client.storage
            .from('productos')
            .upload(filepath, photo.file);

          if (uploadError) {
            throw new Error(`Error al subir imagen: ${uploadError.message}`);
          }

          const { data } = client.storage.from('productos').getPublicUrl(filepath);
          uploadedUrls.push(data.publicUrl);
        } else {
          uploadedUrls.push(photo.url);
        }
      }

      // 2. Construir disponibilidad
      const disponible_en = [];
      if (aqp) disponible_en.push('Arequipa');

      // 3. Preparar payload
      const ficha_tecnica = Object.fromEntries(
        Object.entries({ ...values.ficha, ...Object.fromEntries(Object.entries(fichaCamposBase).map(([key, field]) => [key, values[field]])) }).filter(([, value]) => String(value ?? '').trim().length > 0)
      );

      const payload = {
        nombre: values.nombre,
        slug: values.slug,
        modelo: values.modelo,
        categoria: values.categoria,
        anio: parseInt(values.anio) || 2026,
        carroceria: values.carroceria,
        color: values.color || null,
        caja: values.caja || null,
        carga: values.carga || null,
        euro: values.euro || null,
        descripcion: values.descripcion,
        precio: values.precio ? parseFloat(values.precio) : null,
        moneda: values.moneda,
        pasajeros: values.pasajeros ? parseInt(values.pasajeros) : null,
        motor: values.motor || null,
        cilindrada: values.cilindrada || null,
        potencia: values.potencia || null,
        transmision: values.transmision,
        combustible: values.combustible,
        ficha_tecnica,
        equipamiento: equipment,
        disponible_en,
        publicado,
        destacado,
        imagenes: uploadedUrls
      };

      // 4. Guardar en Base de Datos
      if (vehicle?.id) {
        const { error } = await client
          .from('vehiculos')
          .update(payload)
          .eq('id', vehicle.id);
        
        if (error) throw error;
      } else {
        const { error } = await client
          .from('vehiculos')
          .insert([payload]);

        if (error) throw error;
      }

      setSaved('Vehículo guardado ✓');
      setTimeout(() => {
        setSaved('');
        router.push('/admin/vehiculos');
        router.refresh();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al guardar el vehículo en el servidor.');
    }
  }

  return (
    <form className="product-form single-block" onSubmit={handleSubmit(save)}>
      <section>
        <div className="form-section-title"><b>Fotos</b><small>La primera imagen será la portada</small></div>
        <div className="details-body">
          <label className="dropzone">
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addPhotos} />
            <b>Arrastra fotos aquí o toca para elegir</b>
            <span>JPG, PNG o WebP · Máximo 5 MB por archivo</span>
          </label>
          <div className="photo-previews">
            {photos.map((photo, i) => (
              <figure key={photo.url}>
                <img src={photo.url} alt={`Vista previa ${i + 1}`} />
                {i === 0 && <b>Portada</b>}
                <button type="button" onClick={() => removePhoto(i)}>×</button>
              </figure>
            ))}
          </div>
        </div>

        <div className="form-section-title"><b>Información básica</b><small>Nombre, modelo y descripción del vehículo</small></div>
        <div className="form-grid">
          <label>
            Nombre del vehículo
            <input {...register('nombre')} placeholder="Ej. Pantoja Zeus" />
            {errors.nombre && <em>{errors.nombre.message}</em>}
          </label>
          <label>
            Slug
            <input {...register('slug')} placeholder="pantoja-zeus" />
            {errors.slug && <em>{errors.slug.message}</em>}
          </label>
          <label className="full">
            Descripción
            <textarea rows={5} {...register('descripcion')} placeholder="Describe las principales ventajas..." />
            {errors.descripcion && <em>{errors.descripcion.message}</em>}
          </label>
        </div>

        <div className="form-section-title"><b>Precio</b><small>Monto y moneda para mostrar</small></div>
        <div className="form-grid price-grid">
          <label>
            Monto
            <input type="number" step="any" {...register('precio')} placeholder="Dejar vacío para consultar" />
          </label>
          <label>
            Moneda
            <select {...register('moneda')}>
              <option value="USD">Dólares (USD)</option>
              <option value="PEN">Soles (PEN)</option>
            </select>
          </label>
          <label className="check full">
            <input
              type="checkbox"
              checked={!watch('precio')}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue('precio', '', { shouldDirty: true });
                }
              }}
            />
            Mostrar “Consultar precio” en vez del monto
          </label>
        </div>

        <div className="form-section-title"><b>Ficha técnica</b><small>Una sola ficha con todas las categorías del vehículo. Completa únicamente los datos confirmados.</small></div>
        <div className="technical-sheet-editor">
          {fichaVehicularSecciones.map(seccion => (
            <div className="technical-sheet-category" key={seccion.titulo}>
              <h3>{seccion.titulo}</h3>
              <div className="form-grid">
                {seccion.campos.map(([name, label, placeholder]) => {
                  const field = fichaCamposBase[name as keyof typeof fichaCamposBase];
                  return <label key={name}>{label}<input {...register((field ?? `ficha.${name}`) as any)} placeholder={placeholder} />{field && errors[field] && <em>{errors[field]?.message}</em>}</label>;
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="form-section-title"><b>Equipamiento</b><small>Agrega cada característica con Enter</small></div>
        <div className="details-body">
          <label>
            Nuevo ítem (Presiona Enter para agregar)
            <input value={tag} onChange={e => setTag(e.target.value)} onKeyDown={addTag} placeholder="Ej. Aire acondicionado" />
          </label>
          <div className="chips">
            {equipment.map((x, i) => (
              <button type="button" key={`${x}-${i}`} onClick={() => setEquipment(a => a.filter((_, j) => j !== i))}>
                {x} ×
              </button>
            ))}
          </div>
        </div>

        <div className="form-section-title"><b>Disponibilidad y publicación</b><small>Sedes y visibilidad en el sitio</small></div>
        <div className="details-body checks">
          <label>
            <input type="checkbox" checked={aqp} onChange={e => setAqp(e.target.checked)} /> Arequipa
          </label>
          <label>
            <input type="checkbox" checked={publicado} onChange={e => setPublicado(e.target.checked)} /> Publicado
          </label>
          <label>
            <input type="checkbox" checked={destacado} onChange={e => setDestacado(e.target.checked)} /> Destacado en portada
          </label>
        </div>
      </section>

      {errorMsg && <p className="form-error" role="alert" style={{ color: 'red', marginTop: '15px' }}>{errorMsg}</p>}
      {saved && <div className="toast">{saved}</div>}

      <div className="form-actions">
        <button type="button" onClick={() => router.back()}>Cancelar</button>
        <button className="admin-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Guardar vehículo'}
        </button>
      </div>
    </form>
  );
}


