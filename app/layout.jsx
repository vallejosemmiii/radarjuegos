'use client'; // Necesario para que el banner de cookies pueda cerrarse con un botón
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [cookiesAceptadas, setCookiesAceptadas] = useState(true);

  // Comprobar si el usuario ya aceptó las cookies al cargar
  useEffect(() => {
    const consentimiento = localStorage.getItem('cookiesAceptadas');
    if (!consentimiento) {
      setCookiesAceptadas(false);
    }
  }, []);

  const aceptarCookies = () => {
    localStorage.setItem('cookiesAceptadas', 'true');
    setCookiesAceptadas(true);
  };

  return (
    <html lang="es">
      <body style={{ backgroundColor: '#0f111a', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* BANNER / NAVBAR GLOBAL */}
        <header style={{ 
          backgroundColor: 'rgba(22, 25, 43, 0.85)', backdropFilter: 'blur(10px)',
          padding: '15px 40px', borderBottom: '1px solid #1f293d', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 1000 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>🎯</span>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', letterSpacing: '1px' }}>
              <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>RADAR<span style={{ color: '#2dd4bf' }}>JUEGOS</span></a>
            </h1>
          </div>
          <nav style={{ display: 'flex', gap: '30px' }}>
            <a href="/" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Inicio</a>
            <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Próximos</a>
            <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Ofertas</a>
          </nav>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>

        {/* FOOTER OBLIGATORIO PARA GOOGLE ADSENSE */}
        <footer style={{ backgroundColor: '#0b0d17', borderTop: '1px solid #1f293d', padding: '40px 20px', marginTop: '60px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            
            {/* Información del sitio */}
            <div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#fff' }}>RADAR<span style={{ color: '#2dd4bf' }}>JUEGOS</span></h2>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', maxWidth: '400px' }}>
                El portal definitivo para descubrir próximos lanzamientos, comparar precios de videojuegos y encontrar las mejores ofertas.
              </p>
            </div>

            {/* Enlaces Legales AdSense */}
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/privacidad" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Política de Privacidad</a>
              <a href="/terminos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Términos y Condiciones</a>
              <a href="/contacto" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Contacto</a>
            </div>
            
          </div>
          <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.8rem', marginTop: '30px' }}>
            &copy; {new Date().getFullYear()} RadarJuegos.lat. Todos los derechos reservados.
          </div>
        </footer>

        {/* BANNER DE CONSENTIMIENTO DE COOKIES (Requisito estricto de AdSense) */}
        {!cookiesAceptadas && (
          <div style={{ 
            position: 'fixed', bottom: 0, left: 0, right: 0, 
            backgroundColor: 'rgba(15, 17, 26, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid #2dd4bf',
            padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', zIndex: 9999, flexWrap: 'wrap'
          }}>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.95rem', maxWidth: '800px' }}>
              Utilizamos cookies propias y de terceros, así como servicios de Google AdSense, para personalizar el contenido, mostrar anuncios relevantes y analizar nuestro tráfico. Al continuar navegando, aceptas nuestra <a href="/privacidad" style={{ color: '#2dd4bf' }}>Política de Privacidad y Cookies</a>.
            </p>
            <button 
              onClick={aceptarCookies}
              style={{ backgroundColor: '#2dd4bf', color: '#0f111a', border: 'none', padding: '10px 25px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
              Aceptar y Cerrar
            </button>
          </div>
        )}
        
      </body>
    </html>
  );
}
