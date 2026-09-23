export function waLink(mensaje: string, numero = '51952885588') {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
}

export const mensajesWhatsapp = {
  general: 'Hola PANTOJA 👋, quisiera información sobre sus vehículos.',
  vehiculo: (nombre: string) => `Hola PANTOJA 👋, estoy interesado en la ${nombre}. ¿Me pueden dar más información sobre precio y disponibilidad?`,
  repuesto: (nombre: string, sku: string) => `Hola PANTOJA 👋, quiero cotizar el repuesto: ${nombre} (código ${sku}). ¿Tienen stock?`,
};
