export type Vehiculo = {
  id: string; slug: string; nombre: string; modelo: string; categoria: string; anio: number | null;
  precio: number | null; moneda: 'USD' | 'PEN'; carroceria?: string; color?: string; caja?: string;
  carga?: string; euro?: string; pasajeros: number | null; motor: string; cilindrada: string;
  potencia: string; transmision: string; combustible: string; equipamiento: string[]; accesorios?: string[];
  autopartes?: string[]; ficha_tecnica?: Record<string, string>; descripcion: string;
  imagenes: string[]; destacado: boolean; publicado: boolean; disponible_en: string[];
};

export type Repuesto = {
  id: string; slug: string; nombre: string; sku: string; categoria: string; marca: string;
  precio: number | null; moneda: 'USD' | 'PEN'; compatible_con: string[]; descripcion: string;
  imagenes: string[]; stock: 'Disponible' | 'Bajo pedido' | 'Agotado'; destacado: boolean; publicado: boolean;
};

export const categoriasVehiculo = ['M1', 'M2', 'M3', 'L1', 'L2', 'L3'] as const;
export const carroceriasVehiculo = ['Ómnibus', 'Couster', 'Minibus', 'Microbus', 'Minivan'] as const;
export const modelosVehiculo = ['BUFALIN', 'BUFALIN-FOTON', 'COUSTER-URBANO', 'MUDAM', 'PANTERA', 'PANTERA-TOANO', 'PANTERA-BUFALIN', 'VICTORY', 'ZEUS'] as const;

export const imagenesPorModelo: Record<string, string[]> = {
  BUFALIN: ['/catalogo/bufalin.webp'],
  'BUFALIN-FOTON': ['/catalogo/bufalin-foton.webp'],
  'COUSTER-URBANO': ['/catalogo/couster-urbano.webp'],
  PANTERA: ['/catalogo/pantera.webp'],
  ZEUS: [
    '/catalogo/zeus.webp',
    '/vehiculos/zeus/zeus-01.jpeg',
    '/vehiculos/zeus/zeus-02.jpeg',
    '/vehiculos/zeus/zeus-03.jpeg',
    '/vehiculos/zeus/zeus-04.jpeg',
    '/vehiculos/zeus/zeus-05.jpeg',
    '/vehiculos/zeus/zeus-06.jpeg',
    '/vehiculos/zeus/zeus-07.jpeg'
  ],
  'PANTERA-TOANO': [
    '/catalogo/pantera-toano.webp',
    '/vehiculos/pantera-toano/pantera-toano-01.jpeg',
    '/vehiculos/pantera-toano/pantera-toano-02.jpeg',
    '/vehiculos/pantera-toano/pantera-toano-03.jpeg',
    '/vehiculos/pantera-toano/pantera-toano-04.jpeg',
    '/vehiculos/pantera-toano/pantera-toano-05.jpeg',
    '/vehiculos/pantera-toano/pantera-toano-06.jpeg',
    '/vehiculos/pantera-toano/pantera-toano-07.jpeg'
  ],
  'PANTERA-BUFALIN': [
    '/catalogo/bufalin.webp',
    '/vehiculos/pantera-bufalin/pantera-bufalin-01.jpeg',
    '/vehiculos/pantera-bufalin/pantera-bufalin-02.jpeg',
    '/vehiculos/pantera-bufalin/pantera-bufalin-03.jpeg',
    '/vehiculos/pantera-bufalin/pantera-bufalin-04.jpeg',
    '/vehiculos/pantera-bufalin/pantera-bufalin-05.jpeg',
    '/vehiculos/pantera-bufalin/pantera-bufalin-06.jpeg',
    '/vehiculos/pantera-bufalin/pantera-bufalin-07.jpeg',
    '/vehiculos/pantera-bufalin/pantera-bufalin-08.jpeg'
  ],
  VICTORY: [
    '/catalogo/victory.webp',
    '/vehiculos/victory/victory-01.jpeg',
    '/vehiculos/victory/victory-02.jpeg'
  ]
};

export { fichaVehicularSecciones, fichaVehicularCampos } from './technical-sheet';

export const accesoriosPorModelo = [
  'Faros delanteros',
  'Faro posterior',
  'Espejos retrovisores',
  'Parachoque delantero',
  'Parachoque posterior',
  'Tablero',
  'Puertas laterales',
  'Puerta posterior',
  'Capot delantero',
  'Neblinero',
  'Rejilla delantera',
  'Pisadera R-L'
];

export const autopartesPorModelo = [
  'Cables de transmisión L y R',
  'Pedal electrónico de acelerador',
  'Manija jalador de puertas',
  'Manija jalador de puerta trasera',
  'Depósito de rebose de agua de radiador',
  'Filtro de combustible',
  'Filtro de aire',
  'Filtro de aceite',
  'Bobina de encendido',
  'Cables de alto voltaje de encendido',
  'Horquilla',
  'Collarín',
  'Memoria ECU',
  'Tacómetro',
  'Mando mixto de dirección',
  'Turbo',
  'Bomba de combustible',
  'Alternador',
  'Arrancador',
  'Sensor de oxígeno',
  'Tapa de cárter',
  'Cárter',
  'Relay de puertas'
];

export const vehiculos: Vehiculo[] = [
  { id:'1',slug:'pantoja-zeus',nombre:'Pantoja Zeus',modelo:'ZEUS',categoria:'M2',carroceria:'Minivan',anio:2026,precio:null,moneda:'USD',pasajeros:17,motor:'Gasolina 4 cilindros',cilindrada:'2.4 L',potencia:'134 HP',transmision:'Manual',caja:'Mecánica',combustible:'Gasolina',carga:'Consultar',euro:'Euro IV',color:'A elección',equipamiento:['Aire acondicionado','Dirección asistida','Frenos ABS','Pantalla multimedia','Cámara de retroceso'],accesorios:accesoriosPorModelo,autopartes:autopartesPorModelo,descripcion:'Una minivan amplia y robusta, diseñada para el transporte de pasajeros y las rutas exigentes del Perú.',imagenes:imagenesPorModelo.ZEUS,destacado:true,publicado:true,disponible_en:['Arequipa'] },
  { id:'2',slug:'pantoja-pantera',nombre:'Pantoja Pantera',modelo:'PANTERA-TOANO',categoria:'M3',carroceria:'Minibus',anio:2026,precio:null,moneda:'USD',pasajeros:19,motor:'Turbo diésel',cilindrada:'2.8 L',potencia:'150 HP',transmision:'Manual',caja:'Mecánica',combustible:'Diésel',carga:'Consultar',euro:'Euro V',color:'A elección',equipamiento:['Aire acondicionado','Asientos reclinables','Frenos ABS','Amplio maletero'],accesorios:accesoriosPorModelo,autopartes:autopartesPorModelo,descripcion:'Van alargada de gran capacidad, comodidad y presencia para servicios interprovinciales y turismo.',imagenes:imagenesPorModelo['PANTERA-TOANO'],destacado:true,publicado:true,disponible_en:['Arequipa'] },
  { id:'3',slug:'pantoja-bufalin',nombre:'Pantoja Bufalin',modelo:'PANTERA-BUFALIN',categoria:'M2',carroceria:'Microbus',anio:2026,precio:null,moneda:'USD',pasajeros:16,motor:'Turbo diésel',cilindrada:'2.5 L',potencia:'136 HP',transmision:'Manual',caja:'Mecánica',combustible:'Diésel',carga:'Consultar',euro:'Euro IV',color:'A elección',equipamiento:['Techo alto','Estribos laterales','Frenos ABS','Radio Bluetooth'],accesorios:accesoriosPorModelo,autopartes:autopartesPorModelo,descripcion:'Combi de techo alto y gran rendimiento, pensada para convertir cada jornada en productividad.',imagenes:imagenesPorModelo['PANTERA-BUFALIN'],destacado:true,publicado:true,disponible_en:['Arequipa'] },
  { id:'4',slug:'pantoja-victory',nombre:'Pantoja Victory',modelo:'VICTORY',categoria:'M1',carroceria:'Minivan',anio:2026,precio:null,moneda:'USD',pasajeros:11,motor:'Gasolina',cilindrada:'1.5 L',potencia:'105 HP',transmision:'Manual',caja:'Mecánica',combustible:'Gasolina',carga:'Consultar',euro:'Euro IV',color:'A elección',equipamiento:['Aire acondicionado','Cierre centralizado','Pantalla multimedia','Sensores de retroceso'],accesorios:accesoriosPorModelo,autopartes:autopartesPorModelo,descripcion:'Compacta, ágil y económica. La aliada ideal para transporte urbano y emprendimientos en crecimiento.',imagenes:imagenesPorModelo.VICTORY,destacado:true,publicado:true,disponible_en:['Arequipa'] },
];

const repuestosBase = [
  ['filtro-aceite','Filtro de aceite original','PTJ-001','Filtros',65],['pastillas-freno','Pastillas de freno delanteras','PTJ-002','Frenos',180],
  ['kit-embrague','Kit de embrague reforzado','PTJ-003','Embrague',890],['amortiguador-delantero','Amortiguador delantero','PTJ-004','Suspensión',420],
  ['faro-delantero','Faro delantero LED','PTJ-005','Eléctrico',360],['espejo-lateral','Espejo lateral completo','PTJ-006','Carrocería',280],
  ['correa-distribucion','Correa de distribución','PTJ-007','Motor',230],['filtro-aire','Filtro de aire','PTJ-008','Filtros',80],
  ['disco-freno','Disco de freno ventilado','PTJ-009','Frenos',290],['alternador','Alternador completo','PTJ-010','Eléctrico',780],
  ['radiador','Radiador de motor','PTJ-011','Motor',690],
] as const;

export const repuestos: Repuesto[] = repuestosBase.map(([slug,nombre,sku,categoria,precio],index) => ({
  id:String(index+1),slug,nombre,sku,categoria,marca:'PANTOJA',precio,moneda:'PEN',compatible_con:index%2?['ZEUS','PANTERA-TOANO']:['PANTERA-BUFALIN','VICTORY'],
  descripcion:`Repuesto original PANTOJA con ajuste preciso y respaldo de nuestra red postventa.`,imagenes:[],stock:index===10?'Bajo pedido':'Disponible',destacado:index<4,publicado:true,
}));

export function normalizarVehiculo<T extends Vehiculo>(vehiculo: T): T {
  const modelo = vehiculo.modelo;
  const porModelo: Record<string, Partial<Vehiculo>> = {
    ZEUS: { categoria: 'M2', carroceria: 'Minivan' },
    PANTERA: { categoria: 'M3', carroceria: 'Minibus' },
    'PANTERA-TOANO': { categoria: 'M3', carroceria: 'Minibus' },
    BUFALIN: { categoria: 'M2', carroceria: 'Microbus' },
    'PANTERA-BUFALIN': { categoria: 'M2', carroceria: 'Microbus' },
    VICTORY: { categoria: 'M1', carroceria: 'Minivan' },
    MUDAM: { categoria: 'M2', carroceria: 'Couster' }
  };
  const legacyCategories = ['Minivan', 'Minivan compacta', 'Combi de pasajeros', 'Van de pasajeros', 'Van de carga'];
  const fallback = porModelo[modelo] ?? {};
  const normalizedModel = (fallback.modelo ?? modelo) as string;
  return {
    ...vehiculo,
    ...fallback,
    categoria: legacyCategories.includes(vehiculo.categoria) ? fallback.categoria ?? vehiculo.categoria : vehiculo.categoria,
    carroceria: vehiculo.carroceria ?? fallback.carroceria,
    color: vehiculo.color ?? 'A elección',
    caja: vehiculo.caja ?? vehiculo.transmision,
    carga: vehiculo.carga ?? 'Consultar',
    euro: vehiculo.euro ?? 'Consultar',
    imagenes: vehiculo.imagenes?.length ? vehiculo.imagenes : imagenesPorModelo[normalizedModel] ?? [],
    accesorios: vehiculo.accesorios?.length ? vehiculo.accesorios : accesoriosPorModelo,
    autopartes: vehiculo.autopartes?.length ? vehiculo.autopartes : autopartesPorModelo
  };
}

export function ordenarVehiculosPorModelo<T extends Pick<Vehiculo, 'modelo' | 'nombre'>>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const byModel = a.modelo.localeCompare(b.modelo, 'es', { sensitivity: 'base', numeric: true });
    return byModel || a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base', numeric: true });
  });
}

export const configuracion = {
  whatsapp:'51952885588',telefono:'952 885588',horario:'Lunes a Sábado, 9:00 a.m. – 7:00 p.m.',
  sede_arequipa:{direccion:'Calle Puno N.° 310, Miraflores, Arequipa',mapa_url:'https://maps.google.com/?q=Calle+Puno+310+Miraflores+Arequipa'},
};

export function precioLocal(precio: number | null, moneda: string) {
  if (precio === null) return 'Consultar precio';
  return new Intl.NumberFormat('es-PE',{style:'currency',currency:moneda,maximumFractionDigits:0}).format(precio);
}
