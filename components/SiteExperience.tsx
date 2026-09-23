'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SiteExperience() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const progress = document.querySelector<HTMLElement>('.page-progress span');
    const updateProgress = () => {
      if (!progress) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [pathname]);

  return <>
    <div className="page-progress" aria-hidden="true"><span /></div>
    <div className={`brand-loader ${loading ? 'is-loading' : 'is-complete'}`} role="status" aria-live="polite" aria-label="Cargando Pantoja">
      <div className="loader-stage">
        <span className="loader-label">EXPERIENCIA PANTOJA</span>
        <div className="loader-logo-shell"><i className="loader-orbit orbit-one"/><i className="loader-orbit orbit-two"/><Image src="/logo-dorado.png" alt="" width={380} height={285} priority/></div>
        <p>PREPARANDO TU PRÓXIMA RUTA</p>
        <div className="loader-progress"><span/><b/></div>
        <div className="loader-meta"><span>AREQUIPA</span><i/><span>TACNA</span></div>
      </div>
    </div>
  </>;
}
