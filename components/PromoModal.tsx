'use client';

import { useEffect, useState } from 'react';

type PromoModalProps = {
  active: boolean;
  image: string;
  url: string;
};

export function PromoModal({ active, image, url }: PromoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!active || !image) return;

    // Verificar si el usuario ya cerró la promoción en esta sesión
    const isClosed = sessionStorage.getItem('promo-closed');
    if (!isClosed) {
      // Pequeño retardo para mostrar el pop-up suavemente después de cargar la página
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [active, image]);

  function close() {
    sessionStorage.setItem('promo-closed', 'true');
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        transition: 'opacity 0.3s ease'
      }}
      onClick={close}
    >
      <div 
        style={{
          position: 'relative',
          maxWidth: '500px',
          width: '100%',
          backgroundColor: '#111',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(242, 204, 91, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalSlideIn 0.4s ease-out'
        }}
        onClick={e => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro del contenido
      >
        {/* Estilo local para animación de entrada */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes modalSlideIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}} />

        {/* Botón de cerrar "X" */}
        <button 
          onClick={close}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            fontSize: '20px',
            fontWeight: 'bold',
            lineHeight: '34px',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            transition: 'background-color 0.2s, color 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#c1121f';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.color = '#fff';
          }}
          aria-label="Cerrar promoción"
        >
          ×
        </button>

        {/* Contenido de la Promoción */}
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%' }}>
            <img 
              src={image} 
              alt="Promoción Especial Pantoja" 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
            />
          </a>
        ) : (
          <img 
            src={image} 
            alt="Promoción Especial Pantoja" 
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} 
          />
        )}
      </div>
    </div>
  );
}
