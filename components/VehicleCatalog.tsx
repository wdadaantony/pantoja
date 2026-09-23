'use client';

import { useMemo, useState } from 'react';
import type { Vehiculo } from '@/lib/data';
import { carroceriasVehiculo, categoriasVehiculo, modelosVehiculo, ordenarVehiculosPorModelo } from '@/lib/data';
import { VehicleCard } from './VehicleCard';

export function VehicleCatalog({ items }: { items: Vehiculo[] }) {
  const [query, setQuery] = useState('');
  const [model, setModel] = useState('Todos');
  const [category, setCategory] = useState('Todos');
  const [body, setBody] = useState('Todos');
  const [fuel, setFuel] = useState('Todos');
  const [order, setOrder] = useState('modelo');

  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase('es');
    const result = items.filter(v => {
      const text = `${v.nombre} ${v.modelo} ${v.categoria} ${v.carroceria ?? ''}`.toLocaleLowerCase('es');
      return (!q || text.includes(q))
        && (model === 'Todos' || v.modelo === model)
        && (category === 'Todos' || v.categoria === category)
        && (body === 'Todos' || v.carroceria === body)
        && (fuel === 'Todos' || v.combustible === fuel);
    });

    if (order === 'recientes') return [...result].sort((a, b) => b.anio - a.anio);
    if (order === 'precio') return [...result].sort((a, b) => (a.precio ?? Infinity) - (b.precio ?? Infinity));
    return ordenarVehiculosPorModelo(result);
  }, [items, query, model, category, body, fuel, order]);

  function clearFilters() {
    setQuery('');
    setModel('Todos');
    setCategory('Todos');
    setBody('Todos');
    setFuel('Todos');
  }

  return (
    <div className="catalog-layout">
      <aside className="filters">
        <div className="filters-title">
          <h2>Filtrar</h2>
          <button onClick={clearFilters}>Limpiar</button>
        </div>
        <label>Buscar<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre, modelo o categoría" /></label>
        <label>Modelo<select value={model} onChange={e => setModel(e.target.value)}>{['Todos', ...modelosVehiculo].map(x => <option key={x}>{x}</option>)}</select></label>
        <label>Categoría<select value={category} onChange={e => setCategory(e.target.value)}>{['Todos', ...categoriasVehiculo].map(x => <option key={x}>{x}</option>)}</select></label>
        <label>Carrocería<select value={body} onChange={e => setBody(e.target.value)}>{['Todos', ...carroceriasVehiculo].map(x => <option key={x}>{x}</option>)}</select></label>
        <label>Combustible<select value={fuel} onChange={e => setFuel(e.target.value)}>{['Todos', 'Gasolina', 'Diésel', 'GNV', 'GLP'].map(x => <option key={x}>{x}</option>)}</select></label>
        <div className="filter-note"><b>¿Necesitas ayuda?</b><p>Un asesor puede recomendarte el vehículo ideal para tu ruta.</p><a href="https://wa.me/51952885588" target="_blank" rel="noreferrer">Hablar con un asesor</a></div>
      </aside>
      <section className="catalog-results">
        <div className="results-bar"><span>{filtered.length} vehículos encontrados</span><label>Ordenar por <select value={order} onChange={e => setOrder(e.target.value)}><option value="modelo">Modelo (A-Z)</option><option value="recientes">Más recientes</option><option value="precio">Menor precio</option></select></label></div>
        {filtered.length ? <div className="catalog-grid">{filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}</div> : <div className="empty-state"><b>No encontramos vehículos</b><p>Prueba con otros filtros o escríbenos por WhatsApp.</p></div>}
      </section>
    </div>
  );
}


