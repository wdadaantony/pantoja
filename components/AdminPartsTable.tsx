'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Repuesto } from '@/lib/data';
import { modelosVehiculo, precioLocal } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';

export function AdminPartsTable({ initial }: { initial: Repuesto[] }) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState('');
  const [modelFilter, setModelFilter] = useState('');

  const filtered = useMemo(() =>
    items.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(q.toLowerCase());
      const matchesModel = modelFilter === '' || p.compatible_con.includes(modelFilter);
      return matchesSearch && matchesModel;
    }),
    [items, q, modelFilter]
  );

  async function remove(p: Repuesto) {
    if (window.prompt(`Escribe ${p.nombre} para confirmar la eliminación`) !== p.nombre) return;
    const client = createClient();
    if (!client) {
      alert('Configura las variables de Supabase para realizar cambios.');
      return;
    }
    setItems(old => old.filter(x => x.id !== p.id));
    try {
      const { error } = await client.from('repuestos').delete().eq('id', p.id);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setItems(old => [...old, p]);
      alert('Error al eliminar el accesorio o repuesto.');
    }
  }

  return (
    <>
      <div className="admin-tools">
        <label className="admin-search">⌕ <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre" /></label>
        <select value={modelFilter} onChange={e => setModelFilter(e.target.value)}>
          <option value="">Todos los modelos</option>
          {modelosVehiculo.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <Link className="admin-primary" href="/admin/repuestos/nuevo">+ Agregar accesorio o repuesto</Link>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Nombre</th><th>Precio</th><th>Stock</th><th>Modelo</th><th>Acciones</th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><div className="table-product">{p.imagenes?.length ? <img src={p.imagenes[0]} alt="" className="table-thumb" style={{ width: '44px', height: '34px', objectFit: 'cover', borderRadius: '4px' }} /> : <span className="table-thumb">⚙</span>}<b>{p.nombre}</b></div></td>
                <td>{precioLocal(p.precio, p.moneda)}</td>
                <td><span className={`status-pill ${p.stock === 'Disponible' ? 'published' : 'draft'}`}>{p.stock}</span></td>
                <td>{p.compatible_con.join(', ') || 'Sin modelo'}</td>
                <td><div className="row-actions"><Link href={`/admin/repuestos/${p.id}/editar`}>Editar</Link><button onClick={() => remove(p)}>Eliminar</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <div className="empty-state"><b>No hay resultados</b><p>Prueba con otro nombre o modelo.</p></div>}
      </div>
    </>
  );
}
