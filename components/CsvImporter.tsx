'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Row = { 
  nombre: string; 
  sku: string; 
  categoria: string; 
  marca: string; 
  precio: string; 
  stock: string 
};

export function CsvImporter() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  function read(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    setSuccessMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '').trim();
        const lines = text.split(/\r?\n/);
        if (lines.length === 0) {
          setError('El archivo CSV está vacío.');
          return;
        }

        const headers = lines.shift()?.split(',').map(x => x.trim().toLowerCase()) ?? [];
        const required = ['nombre', 'sku', 'categoria', 'marca', 'precio', 'stock'];

        if (!required.every(x => headers.includes(x))) {
          setError('El archivo no tiene todas las columnas de la plantilla (nombre, sku, categoria, marca, precio, stock).');
          return;
        }

        const parsedRows = lines.filter(Boolean).map(line => {
          // simple CSV parsing splitting by comma
          const columns = line.split(',').map(x => x.trim());
          return Object.fromEntries(headers.map((h, i) => [h, columns[i] ?? ''])) as Row;
        });

        setRows(parsedRows);
      } catch (err: any) {
        setError('Error al procesar el archivo CSV.');
      }
    };
    reader.readAsText(file);
  }

  async function startImport() {
    setError('');
    setImporting(true);
    const client = createClient();
    if (!client) {
      setError('Configura las variables de Supabase para realizar la importación.');
      setImporting(false);
      return;
    }

    try {
      // 1. Preparar payloads
      const payloads = rows.map(row => {
        const baseSlug = `${row.nombre}-${row.sku}`
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        return {
          nombre: row.nombre,
          sku: row.sku,
          slug: baseSlug,
          categoria: row.categoria || 'Accesorios',
          marca: row.marca || 'PANTOJA',
          precio: row.precio ? parseFloat(row.precio) : null,
          moneda: 'PEN',
          stock: ['Disponible', 'Bajo pedido', 'Agotado'].includes(row.stock) ? row.stock : 'Disponible',
          descripcion: 'Repuesto importado vía CSV.',
          publicado: true,
          destacado: false,
          imagenes: []
        };
      });

      // 2. Realizar Upsert masivo
      const { error: upsertError } = await client
        .from('repuestos')
        .upsert(payloads, { onConflict: 'sku' });

      if (upsertError) throw upsertError;

      setSuccessMsg(`¡Éxito! Se importaron ${rows.length} repuestos correctamente.`);
      setRows([]);
      setTimeout(() => {
        setSuccessMsg('');
        router.push('/admin/repuestos');
        router.refresh();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al guardar los repuestos en la base de datos.');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="csv-importer">
      <div className="import-intro">
        <div>
          <h2>1. Prepara tu archivo</h2>
          <p>Descarga la plantilla, completa los repuestos y guárdala como CSV.</p>
        </div>
        <a className="admin-secondary" href="/repuestos-plantilla.csv" download>↓ Descargar plantilla CSV</a>
      </div>
      
      <label className="dropzone csv-drop">
        <input type="file" accept=".csv,text/csv" onChange={read} disabled={importing} />
        <b>Arrastra tu archivo CSV aquí</b>
        <span>o toca para seleccionarlo</span>
      </label>
      
      {error && <p className="form-error" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {successMsg && <p className="form-success" style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>{successMsg}</p>}
      
      {rows.length > 0 && (
        <>
          <div className="import-summary">
            <b>{rows.length} filas listas para importar</b>
            <span>Revisa la vista previa antes de confirmar. Las filas con SKUs ya existentes se actualizarán.</span>
          </div>
          
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fila</th>
                  <th>Nombre</th>
                  <th>SKU</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.sku}-${i}`}>
                    <td>{i + 1}</td>
                    <td>{r.nombre}</td>
                    <td>{r.sku}</td>
                    <td>{r.categoria}</td>
                    <td>S/ {r.precio}</td>
                    <td><span className="status-pill published">Válida</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            className="admin-primary import-button" 
            onClick={startImport} 
            disabled={importing}
            style={{ marginTop: '20px' }}
          >
            {importing ? 'Importando...' : `Confirmar e Importar ${rows.length} repuestos`}
          </button>
        </>
      )}
    </div>
  );
}
