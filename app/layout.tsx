import type { Metadata } from 'next';
import { Archivo, Oswald } from 'next/font/google';
import { SiteExperience } from '@/components/SiteExperience';
import './globals.css';
import './experience.css';
import './catalog-images.css';
import './technical-sheet.css';

const archivo = Archivo({ variable: '--font-archivo', subsets: ['latin'] });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://pantojachina.com'),
  title: { default: 'PANTOJA MOTORS | Vehículos y repuestos en Arequipa', template: '%s | PANTOJA MOTORS' },
  applicationName: 'PANTOJA MOTORS',
  description: 'PANTOJA MOTORS: minivans, vehículos de pasajeros y repuestos en Arequipa. Consulta modelos, stock y cotizaciones por WhatsApp.',
  icons: { icon:'/logo-dorado.png',apple:'/logo-dorado.png' },
  openGraph: { title:'PANTOJA MOTORS | Vehículos y repuestos', description:'Nuestra marca exclusiva es la diferencia. Vehículos y repuestos en Arequipa.', images:[{url:'/og.png',width:1200,height:630,alt:'Pantoja, vehículos exclusivos'}],locale:'es_PE',type:'website' },
  twitter: { card:'summary_large_image', title:'PANTOJA MOTORS | Vehículos y repuestos', description:'Nuestra marca exclusiva es la diferencia.', images:['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const dealer={
    '@context':'https://schema.org','@type':'AutoDealer',name:'PANTOJA MOTORS',alternateName:'Pantoja',url:process.env.NEXT_PUBLIC_SITE_URL||'https://pantojachina.com',
    telephone:'+51 952 885588',slogan:'NUESTRA MARCA EXCLUSIVA ES LA DIFERENCIA',
    areaServed:['Arequipa'],address:[
      {'@type':'PostalAddress',streetAddress:'Calle Puno N.° 310',addressLocality:'Miraflores, Arequipa',addressCountry:'PE'},
    ],
  };
  return <html lang="es"><body className={`${archivo.variable} ${oswald.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(dealer)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'PANTOJA MOTORS',alternateName:'Pantoja Motors',url:'https://pantojachina.com'})}}/><SiteExperience/>{children}</body></html>;
}
