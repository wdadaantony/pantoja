'use client';

import { useState } from 'react';

export function VehicleGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="gallery-wrap">
      <img
        className="main-detail-image"
        src={images[selected]}
        alt={name}
        style={{ width: '100%', height: 'auto', maxHeight: '450px', borderRadius: '8px', objectFit: 'contain' }}
      />
      {images.length > 1 && (
        <div className="gallery-thumbs" style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto' }}>
          {images.map((imgUrl, i) => (
            <img
              key={i}
              src={imgUrl}
              alt={`${name} ${i + 1}`}
              onClick={() => setSelected(i)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '4px',
                objectFit: 'cover',
                cursor: 'pointer',
                border: i === selected ? '2px solid #b91c1c' : '2px solid transparent'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
