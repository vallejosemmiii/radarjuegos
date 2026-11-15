'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [cookiesAceptadas, setCookiesAceptadas] = useState(true);

  useEffect(() => {
    const consentimiento = localStorage.getItem('cookiesAceptadas');
    if (!consentimiento) setCookiesAceptadas(false);
  }, []);

  const aceptarCookies = () => {
    localStorage.setItem('cookiesAceptadas', 'true');
    setCookiesAceptadas(true);
  };

  if (cookiesAceptadas) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(11, 13, 23, 0.98)',
        borderTop: '2px solid #a855f7',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        zIndex: 9999,
      }}
    >
      <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>
        Utilizamos cookies propias y de terceros (Google AdSense) para analizar el tráfico y mostrar anuncios relevantes. Al continuar, aceptas nuestra Política de Privacidad.
      </p>
      <button
        onClick={aceptarCookies}
        style={{
          backgroundColor: '#a855f7',
          color: '#fff',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Aceptar
      </button>
    </div>
  );
}
