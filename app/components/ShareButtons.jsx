'use client';

import { useState } from 'react';

export default function ShareButtons({ url, texto }) {
  const [copiado, setCopiado] = useState(false);

  const copiarEnlace = () => {
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const urlEncoded = encodeURIComponent(url);
  const textoEncoded = encodeURIComponent(texto);

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          minWidth: '90px',
          textAlign: 'center',
          backgroundColor: '#1877f2',
          color: '#fff',
          padding: '9px 14px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '0.85rem',
        }}
      >
        Facebook
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${textoEncoded}%20${urlEncoded}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          minWidth: '90px',
          textAlign: 'center',
          backgroundColor: '#25d366',
          color: '#0f111a',
          padding: '9px 14px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '0.85rem',
        }}
      >
        WhatsApp
      </a>
      <button
        onClick={copiarEnlace}
        style={{
          flex: 1,
          minWidth: '90px',
          backgroundColor: '#1f293d',
          color: '#fff',
          border: '1px solid #334155',
          padding: '9px 14px',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          cursor: 'pointer',
        }}
      >
        {copiado ? '✓ Copiado' : 'Copiar'}
      </button>
    </div>
  );
}
