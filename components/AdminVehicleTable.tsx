'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Vehiculo } from '@/lib/data';
import { ordenarVehiculosPorModelo, precioLocal } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';

export function AdminVehicleTable({ initial }: { initial: Vehiculo[] }) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => 
    ordenarVehiculosPorModelo(items.filter(v => `${v.nombre} ${v.modelo}`.toLowerCase().includes(q.toLowerCase()))),
    [items, q]
  );

  async function toggle(id: string, key: 'publicado' | 'destacado', currentValue: boolean) {
    const client = createClient();
    if (!client) {
      alert('Configura las variables de Supabase para realizar cambios.');
      return;
    }

    // Optimistic Update
    setItems(old => old.map(x => x.id === id ? { ...x, [key]: !currentValue } : x));

    try {
      const { error } = await client
        .from('vehiculos')
        .update({ [key]: !currentValue })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error(err);
      // Revert if error
      setItems(old => old.map(x => x.id === id ? { ...x, [key]: currentValue } : x));
      alert('Error al actualizar en la base de datos de Supabase.');
    }
  }

  async function remove(v: Vehiculo) {
    if (window.prompt(`Escribe ${v.nombre} para confirmar la eliminación`) !== v.nombre) {
      return;
    }

    const client = createClient();
    if (!client) {
      alert('Configura las variables de Supabase para realizar cambios.');
      return;
    }

    // Optimistic Update
    setItems(old => old.filter(x => x.id !== v.id));

    try {
      const { error } = await client
        .from('vehiculos')
        .delete()
        .eq('id', v.id);

      if (error) throw error;
    } catch (err) {
      console.error(err);
      // Revert if error
      setItems(old => [...old, v]);
      alert('Error al eliminar el vehículo de la base de datos.');
    }
  }

  return (
    <>
      <div className="admin-tools">
        <label className="admin-search">
          ⌕ <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o modelo" />
        </label>
        <Link className="admin-primary" href="/admin/vehiculos/nuevo">+ Agregar vehículo</Link>
      </div>
      
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Vehículo</th>
              <th>Modelo</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td>
                  <div className="table-product">
                    {v.imagenes && v.imagenes.length > 0 ? (
                      <img src={v.imagenes[0]} alt="" className="table-thumb" style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      <span className="table-thumb">▰</span>
                    )}
                    <div>
                      <b>{v.nombre}</b>
                      <small>{v.categoria} · {v.anio}</small>
                    </div>
                  </div>
                </td>
                <td><span className="model-pill">{v.modelo}</span></td>
                <td>{precioLocal(v.precio, v.moneda)}</td>
                <td>
                  <button 
                    className={`status-pill ${v.publicado ? 'published' : 'draft'}`} 
                    onClick={() => toggle(v.id, 'publicado', v.publicado)}
                  >
                    {v.publicado ? 'Publicado' : 'Borrador'}
                  </button>
                </td>
                <td>
                  <button 
                    className={`star ${v.destacado ? 'on' : ''}`} 
                    onClick={() => toggle(v.id, 'destacado', v.destacado)} 
                    aria-label="Cambiar destacado"
                  >
                    ★
                  </button>
                </td>
                <td>
                  <div className="row-actions">
                    <Link href={`/admin/vehiculos/${v.id}/editar`}>Editar</Link>
                    <button onClick={() => remove(v)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!filtered.length && (
          <div className="empty-state">
            <b>No hay resultados</b>
            <p>Prueba con otra búsqueda.</p>
          </div>
        )}
      </div>
    </>
  );
}



