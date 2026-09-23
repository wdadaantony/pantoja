'use client';

import { useMemo, useState } from 'react';
import type { Repuesto } from '@/lib/data';
import { modelosVehiculo } from '@/lib/data';
import { PartCard } from './PartCard';

export function PartsCatalog({ items }: { items: Repuesto[] }) {
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('Todos');
  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase('es');
    return items.filter(p => (!q || p.nombre.toLocaleLowerCase('es').includes(q)) && (model === 'Todos' || p.compatible_con.includes(model)));
  }, [items, query, model]);
  const models = model === 'Todos' ? modelosVehiculo : modelosVehiculo.filter(m => m === model);

  return (
    <div className="catalog-layout parts-by-model">
      <aside className="filters">
        <div className="filters-title"><h2>Filtrar</h2><button onClick={() => { setQuery(''); setModel('Todos'); }}>Limpiar</button></div>
        <label>Buscar<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre del accesorio" /></label>
        <label>Modelo<select value={model} onChange={e => setModel(e.target.value)}>{['Todos', ...modelosVehiculo].map(x => <option key={x}>{x}</option>)}</select></label>
      </aside>
      <section className="catalog-results">
        {models.map(m => {
          const byModel = filtered.filter(p => p.compatible_con.includes(m));
          return <div className="model-parts-list" key={m}>
            <div className="results-bar"><span>Accesorios y repuestos para {m}</span></div>
            {byModel.length ? <div className="catalog-grid">{byModel.map(p => <PartCard key={p.id} part={p} />)}</div> : <div className="empty-state"><b>Sin productos registrados</b><p>Agrega mínimo 30 líneas para este modelo desde el administrador.</p></div>}
          </div>;
        })}
      </section>
    </div>
  );
}
