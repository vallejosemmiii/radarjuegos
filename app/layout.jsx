export const metadata = {
  title: 'RadarJuegos | Lanzamientos y Ofertas',
  description: 'El portal definitivo para descubrir próximos lanzamientos y comparar precios de videojuegos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ backgroundColor: '#0f111a', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        
        {/* BANNER / NAVBAR GLOBAL */}
        <header style={{ 
          backgroundColor: 'rgba(22, 25, 43, 0.85)', 
          backdropFilter: 'blur(10px)',
          padding: '15px 40px', 
          borderBottom: '1px solid #1f293d', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky', 
          top: 0, 
          zIndex: 1000 
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }}>🎯</span>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', letterSpacing: '1px' }}>
              <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>
                RADAR<span style={{ color: '#2dd4bf' }}>JUEGOS</span>
              </a>
            </h1>
          </div>

          {/* Menú de Navegación (Corregido para Vercel) */}
          <nav style={{ display: 'flex', gap: '30px' }}>
            <a href="/" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Inicio</a>
            <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Próximos</a>
            <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>Ofertas</a>
          </nav>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
        
      </body>
    </html>
  );
}
  );
}
