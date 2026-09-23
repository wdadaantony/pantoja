'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import type { Vehiculo } from '@/lib/data';
import { carroceriasVehiculo, categoriasVehiculo, fichaVehicularCampos, fichaVehicularSecciones, modelosVehiculo } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';

function fichaDefault(vehicle: Vehiculo | undefined) {
  const ficha = (vehicle as any)?.ficha_tecnica as Record<string, string> | undefined;
  return Object.fromEntries(fichaVehicularCampos.map(([name]) => [name, ficha?.[name] ?? '']));
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
      ficha: fichaDefault(vehicle)
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
        Object.entries(values.ficha ?? {}).filter(([, value]) => String(value ?? '').trim().length > 0)
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
    <form className="product-form" onSubmit={handleSubmit(save)}>
      <section>
        <details open>
          <summary>
            <span>1</span>
            <div>
              <b>Información básica</b>
              <small>Nombre, modelo y descripción del vehículo</small>
            </div>
          </summary>
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
            <label>
              Modelo
              <select {...register('modelo')}>
                <option value="">Seleccionar</option>
                {modelosVehiculo.map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              {errors.modelo && <em>{errors.modelo.message}</em>}
            </label>
            <label>
              Categoría
              <select {...register('categoria')}>
                <option value="">Seleccionar</option>
                {categoriasVehiculo.map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              {errors.categoria && <em>{errors.categoria.message}</em>}
            </label>
            <label>
              Año
              <input type="number" {...register('anio')} />
              {errors.anio && <em>{errors.anio.message}</em>}
            </label>
            <label>
              Carrocería
              <select {...register('carroceria')}>
                <option value="">Seleccionar</option>
                {carroceriasVehiculo.map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
              {errors.carroceria && <em>{errors.carroceria.message}</em>}
            </label>
            <label>
              Color
              <input {...register('color')} placeholder="Ej. Blanco, dorado o a elección" />
            </label>
            <label className="full">
              Descripción
              <textarea rows={5} {...register('descripcion')} placeholder="Describe las principales ventajas..." />
              {errors.descripcion && <em>{errors.descripcion.message}</em>}
            </label>
          </div>
        </details>
      </section>

      <section>
        <details open>
          <summary>
            <span>2</span>
            <div>
              <b>Precio</b>
              <small>Monto y moneda para mostrar</small>
            </div>
          </summary>
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
        </details>
      </section>

      <section>
        <details>
          <summary>
            <span>3</span>
            <div>
              <b>Especificaciones técnicas</b>
              <small>Motor, capacidad y rendimiento</small>
            </div>
          </summary>
          <div className="form-grid">
            <label>
              Pasajeros
              <input type="number" {...register('pasajeros')} />
            </label>
            <label>
              Motor
              <input {...register('motor')} placeholder="Ej. Turbo diésel" />
            </label>
            <label>
              Cilindrada
              <input {...register('cilindrada')} placeholder="Ej. 2.8 L" />
            </label>
            <label>
              Potencia
              <input {...register('potencia')} placeholder="Ej. 150 HP" />
            </label>
            <label>
              Transmisión
              <select {...register('transmision')}>
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </label>
            <label>
              Caja
              <input {...register('caja')} placeholder="Ej. Mecánica de 5 velocidades" />
            </label>
            <label>
              Carga
              <input {...register('carga')} placeholder="Ej. Consultar / 1 tonelada" />
            </label>
            <label>
              Norma Euro
              <input {...register('euro')} placeholder="Ej. Euro IV" />
            </label>
            <label>
              Combustible
              <select {...register('combustible')}>
                <option value="Gasolina">Gasolina</option>
                <option value="Diésel">Diésel</option>
                <option value="GNV">GNV</option>
                <option value="GLP">GLP</option>
              </select>
            </label>
          </div>
        </details>
      </section>


      {fichaVehicularSecciones.map((seccion, index) => (
        <section key={seccion.titulo}>
          <details open>
            <summary>
              <span>{index + 4}</span>
              <div>
                <b>{seccion.titulo}</b>
                <small>{seccion.resumen}</small>
              </div>
            </summary>
            <div className="form-grid technical-sheet-grid">
              {seccion.campos.map(([name, label, placeholder]) => (
                <label key={name}>{label}<input {...register(`ficha.${name}` as any)} placeholder={placeholder} /></label>
              ))}
            </div>
          </details>
        </section>
      ))}

      <section>
        <details>
          <summary>
            <span>9</span>
            <div>
              <b>Equipamiento</b>
              <small>Agrega cada característica con Enter</small>
            </div>
          </summary>
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
        </details>
      </section>

      <section>
        <details open>
          <summary>
            <span>10</span>
            <div>
              <b>Fotos</b>
              <small>La primera imagen será la portada</small>
            </div>
          </summary>
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
        </details>
      </section>

      <section>
        <details>
          <summary>
            <span>11</span>
            <div>
              <b>Disponibilidad y publicación</b>
              <small>Sedes y visibilidad en el sitio</small>
            </div>
          </summary>
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
        </details>
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


