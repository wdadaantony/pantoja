import type { Vehiculo } from './data';

// The same ordered categories drive the editor and the public technical sheet.
export const fichaVehicularSecciones = [
  { titulo: 'Identificación', campos: [
    ['marca', 'Marca', 'Ej. PANTOJA'],
    ['modelo_comercial', 'Modelo', 'Ej. MUDAN-MD6708'],
    ['color_1', 'Color', 'Ej. Blanco'],
    ['anio_fabricacion', 'Año de fabricación', 'Ej. 2020'],
    ['anio_modelo', 'Año del modelo', 'Ej. 2020'],
    ['version', 'Grado / versión', 'Ej. GL'],
  ] },
  { titulo: 'Motor', campos: [
    ['motor', 'Motor', 'Código / fabricante del motor'],
    ['sistema_inyeccion', 'Sistema de inyección', 'Ej. Common rail'],
    ['aspiracion', 'Aspiración', 'Ej. Turbo intercooler'],
    ['nro_cilindros', 'Cilindros', 'Ej. 4 cilindros en línea, 16 V'],
    ['cilindrada', 'Cilindrada', 'Indica valor y unidad: cc o L'],
    ['combustible', 'Combustible', 'Ej. Diésel'],
    ['potencia', 'Potencia', 'Indica HP, kW y RPM si corresponde'],
    ['torque', 'Torque', 'Indica valor y unidad: N·m'],
    ['norma_gases', 'Norma de emisión', 'Ej. Euro IV'],
    ['capacidad_tanque', 'Capacidad del tanque', 'Indica valor y unidad: galones o L'],
  ] },
  { titulo: 'Suspensión', campos: [
    ['suspension_delantera', 'Delantera', 'Tipo de suspensión delantera'],
    ['suspension_posterior', 'Posterior', 'Tipo de suspensión posterior'],
  ] },
  { titulo: 'Transmisión', campos: [
    ['transmision', 'Tipo', 'Ej. Mecánica'],
    ['caja', 'Velocidades / caja', 'Ej. 5 marchas y 1 retroceso'],
    ['formula_rodante', 'Tracción', 'Ej. 4 × 2'],
  ] },
  { titulo: 'Carrocería', campos: [
    ['categoria_vehicular', 'Categoría', 'Ej. M3-C2, de acuerdo al SIT'],
    ['clase_vehicular', 'Tipo', 'Ej. Minibús'],
    ['largo_mm', 'Longitud (mm)', 'Ej. 7000'],
    ['ancho_mm', 'Ancho (mm)', 'Ej. 2260'],
    ['altura_mm', 'Alto (mm)', 'Ej. 2800'],
    ['alto_interior_mm', 'Alto interior (mm)', 'Ej. 1800'],
    ['nro_ejes', 'N.º de ejes', 'Ej. 2'],
    ['pasajeros', 'Pasajeros', 'Capacidad de pasajeros'],
    ['nro_asientos', 'N.º de asientos', 'Cantidad de asientos'],
  ] },
  { titulo: 'Peso', campos: [
    ['peso_bruto_kg', 'Peso bruto (kg)', 'Ej. 7000, de acuerdo al SIT'],
    ['peso_neto_kg', 'Peso neto (kg)', 'Ej. 4400'],
    ['carga_util_kg', 'Carga útil (kg)', 'Ej. 2600'],
  ] },
  { titulo: 'Dirección', campos: [
    ['sistema_direccion', 'Sistema de dirección', 'Ej. Hidráulica'],
  ] },
  { titulo: 'Frenos', campos: [
    ['frenos', 'Delanteros / posteriores', 'Describe ambos sistemas y ABS si corresponde'],
  ] },
  { titulo: 'Neumáticos / aros', campos: [
    ['med_neumatico1', 'Medidas', 'Ej. 7.5 R16C'],
    ['med_aros_pulg', 'Aros', 'Ej. Aros sin pestañas'],
  ] },
  { titulo: 'Seguridad', campos: [
    ['puertas', 'Puertas', 'Ej. Cierre con bomba eléctrica'],
    ['cinturones', 'Cinturones', 'Ej. En todos los asientos'],
  ] },
  { titulo: 'Interior', campos: [
    ['pantalla', 'Pantalla', 'Ej. Cámara de retroceso, radio, USB'],
    ['ventilador', 'Ventilador', 'Ej. Techo del chofer'],
    ['parabrisas', 'Parabrisas', 'Ej. Con protector UV'],
    ['tablero', 'Tablero', 'Ej. Tacómetro simétrico'],
    ['sistema_aire_ac', 'Aire acondicionado', 'Sistema de aire acondicionado'],
    ['lunas_delanteras', 'Lunas delanteras', 'Tipo de accionamiento'],
    ['sensor_posterior', 'Sensor posterior', 'Sistema de ayuda al estacionamiento'],
    ['equipo_sonido', 'Equipo de sonido', 'Radio y conexiones disponibles'],
  ] },
] as const;

export const fichaVehicularCampos = fichaVehicularSecciones.flatMap(
  section => section.campos as readonly (readonly [string, string, string])[]
);

export const fichaCamposBase = {
  modelo_comercial: 'modelo', categoria_vehicular: 'categoria',
  clase_vehicular: 'carroceria', color_1: 'color', anio_modelo: 'anio',
  motor: 'motor', cilindrada: 'cilindrada', potencia: 'potencia',
  transmision: 'transmision', caja: 'caja', combustible: 'combustible',
  pasajeros: 'pasajeros', norma_gases: 'euro',
} as const;

export function valorTecnico(vehicle: Vehiculo | undefined, key: string): string {
  if (!vehicle) return key === 'marca' ? 'PANTOJA' : '';
  const stored = vehicle.ficha_tecnica?.[key];
  const baseKey = fichaCamposBase[key as keyof typeof fichaCamposBase];
  const value = stored ?? (baseKey ? vehicle[baseKey] : key === 'marca' ? 'PANTOJA' : '');
  return value === null || value === undefined ? '' : String(value);
}
