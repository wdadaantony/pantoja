import type { Metadata } from 'next';
import { Archivo, Oswald } from 'next/font/google';
import { SiteExperience } from '@/components/SiteExperience';
import './globals.css';
import './experience.css';

const archivo = Archivo({ variable: '--font-archivo', subsets: ['latin'] });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Pantoja | Vehículos exclusivos en Arequipa',
  description: 'Minivans, combis, vans de pasajeros y repuestos originales Pantoja. Atención directa en Arequipa.',
  icons: { icon:'/logo-dorado.png',apple:'/logo-dorado.png' },
  openGraph: { title:'Pantoja | Vehículos exclusivos', description:'Nuestra marca exclusiva es la diferencia. Vehículos y repuestos en Arequipa.', images:[{url:'/og.png',width:1200,height:630,alt:'Pantoja, vehículos exclusivos'}],locale:'es_PE',type:'website' },
  twitter: { card:'summary_large_image', title:'Pantoja | Vehículos exclusivos', description:'Nuestra marca exclusiva es la diferencia.', images:['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const dealer={
    '@context':'https://schema.org','@type':'AutoDealer',name:'PANTOJA',url:process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000',
    telephone:'+51 952 885588',slogan:'NUESTRA MARCA EXCLUSIVA ES LA DIFERENCIA',
    areaServed:['Arequipa'],address:[
      {'@type':'PostalAddress',streetAddress:'Calle Puno N.° 310',addressLocality:'Miraflores, Arequipa',addressCountry:'PE'},
    ],
  };
  return <html lang="es"><body className={`${archivo.variable} ${oswald.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(dealer)}}/><SiteExperience/>{children}</body></html>;
}
