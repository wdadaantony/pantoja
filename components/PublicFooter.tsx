import Image from 'next/image';
import Link from 'next/link';
import { configuracion } from '@/lib/data';
import { mensajesWhatsapp, waLink } from '@/lib/whatsapp';

export function PublicFooter() {
  return <>
    <footer><div className="container footer-wrap"><Image src="/logo-dorado.png" alt="Pantoja" width={150} height={112}/><p>NUESTRA MARCA EXCLUSIVA ES LA DIFERENCIA</p><div className="footer-links"><Link href="/vehiculos">Vehículos</Link><Link href="/repuestos">Repuestos</Link><Link href="/flash">Flash</Link><Link href="/contacto">Contacto</Link></div><span>© 2026 PANTOJA</span></div></footer>
    <a className="wa-float" href={waLink(mensajesWhatsapp.general,configuracion.whatsapp)} target="_blank" rel="noreferrer" aria-label="Conversar con Pantoja por WhatsApp"><span aria-hidden="true" className="wa-mark">☎</span><span>¿En qué podemos ayudarte?</span></a>
  </>;
}
