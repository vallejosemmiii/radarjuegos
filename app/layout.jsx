'use client'; 
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [cookiesAceptadas, setCookiesAceptadas] = useState(true);

  useEffect(() => {
    const consentimiento = localStorage.getItem('cookiesAceptadas');
    if (!consentimiento) setCookiesAceptadas(false);
  }, []);

  const aceptarCookies = () => {
    localStorage.setItem('cookiesAceptadas', 'true');
    setCookiesAceptadas(true);
  };

  return (
    <html lang="es" style={{ scrollBehavior: 'smooth' }}>
      <body style={{ backgroundColor: '#0f111a', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* BANNER GAMER PROFESIONAL */}
        <header style={{ 
          background: 'linear-gradient(90deg, #0b0d17 0%, #1a1025 50%, #0b0d17 100%)', 
          borderBottom: '2px solid #a855f7',
          boxShadow: '0 4px 20px rgba(168, 85, 247, 0.2)',
          padding: '20px 40px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky', 
          top: 0, 
          zIndex: 1000 
        }}>
          {/* Logo Estilo eSports */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h1 style={{ 
              margin: 0, fontSize: '2.2rem', fontWeight: '900', fontStyle: 'italic', 
              letterSpacing: '2px', textTransform: 'uppercase'
            }}>
              <a href="/" style={{ color: '#fff', textDecoration: 'none', textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>
                RADAR<span style={{ color: '#a855f7' }}>JUEGOS</span>
              </a>
            </h1>
          </div>

          {/* Menú de Navegación Conectado */}
          <nav style={{ display: 'flex', gap: '35px' }}>
            <a href="/" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Inicio</a>
            <a href="/#proximos" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Próximos</a>
            <a href="/#ofertas" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Ofertas</a>
          </nav>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>

        {/* FOOTER */}
        <footer style={{ backgroundColor: '#05060a', borderTop: '1px solid #1f293d', padding: '40px 20px', marginTop: '60px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#fff', fontStyle: 'italic' }}>RADAR<span style={{ color: '#a855f7' }}>JUEGOS</span></h2>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', maxWidth: '400px' }}>
                El portal definitivo para descubrir próximos lanzamientos y comparar precios.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/privacidad" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Privacidad</a>
              <a href="/terminos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Términos</a>
            </div>
          </div>
        </footer>

        {/* BANNER COOKIES */}
        {!cookiesAceptadas && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(11, 13, 23, 0.98)', borderTop: '2px solid #a855f7', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', zIndex: 9999 }}>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem' }}>Utilizamos cookies para personalizar contenido y anuncios. Al continuar, aceptas nuestra Política.</p>
            <button onClick={aceptarCookies} style={{ backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Aceptar</button>
          </div>
        )}
      </body>
    </html>
  );
}
