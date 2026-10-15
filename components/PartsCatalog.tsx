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
    return items.filter(p => (!q || `${p.nombre} ${p.sku} ${p.categoria}`.toLocaleLowerCase('es').includes(q)) && (model === 'Todos' || p.compatible_con.includes(model)));
  }, [items, query, model]);

  return (
    <div className="catalog-layout parts-by-model">
      <aside className="filters">
        <div className="filters-title"><h2>Filtrar</h2><button onClick={() => { setQuery(''); setModel('Todos'); }}>Limpiar</button></div>
        <label>Buscar<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre del accesorio" /></label>
        <label>Modelo<select value={model} onChange={e => setModel(e.target.value)}>{['Todos', ...modelosVehiculo].map(x => <option key={x}>{x}</option>)}</select></label>
      </aside>
      <section className="catalog-results">
        <div className="results-bar" aria-live="polite"><span>{filtered.length} repuestos encontrados{model !== 'Todos' ? ` para ${model}` : ''}</span></div>
        {filtered.length ? (
          <div className="catalog-grid">{filtered.map(p => <PartCard key={p.id} part={p} />)}</div>
        ) : (
          <div className="empty-state"><b>No encontramos repuestos</b><p>Prueba con otro nombre o modelo. Nuestro equipo puede confirmar la compatibilidad de tu pieza.</p></div>
        )}
      </section>
    </div>
  );
}
