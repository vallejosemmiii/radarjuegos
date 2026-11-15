import Navbar from './components/Navbar';
import CookieBanner from './components/CookieBanner';

export const metadata = {
  metadataBase: new URL('https://radarjuegos.lat'),
  title: {
    default: 'RadarJuegos | Comparador de Precios, Juegos Gratis y Lanzamientos',
    template: '%s | RadarJuegos',
  },
  description:
    'Compara precios de videojuegos en Steam, Epic Games, GOG y tiendas oficiales. Descubre juegos gratuitos activos, ofertas diarias y calendario de próximos lanzamientos AAA.',
  keywords: [
    'ofertas videojuegos',
    'juegos gratis',
    'comparador precios juegos',
    'proximos lanzamientos',
    'epic games gratis',
    'descuentos steam',
  ],
  openGraph: {
    title: 'RadarJuegos | Ofertas, Juegos Gratis y Próximos Lanzamientos',
    description:
      'Encuentra el mejor precio para tus videojuegos favoritos, reclama juegos gratuitos por tiempo limitado y sigue la cuenta regresiva de los estrenos más esperados.',
    url: 'https://radarjuegos.lat',
    siteName: 'RadarJuegos',
    locale: 'es_ES',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6055882420759450"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        style={{
          backgroundColor: '#0f111a',
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navbar />

        <main style={{ flexGrow: 1 }}>{children}</main>

        <footer style={{ backgroundColor: '#05060a', borderTop: '1px solid #1f293d', padding: '40px 20px', marginTop: '60px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#fff', fontStyle: 'italic' }}>
                RADAR<span style={{ color: '#a855f7' }}>JUEGOS</span>
              </h2>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', maxWidth: '420px', lineHeight: '1.5' }}>
                Plataforma independiente de seguimiento de precios, juegos gratuitos y lanzamientos de videojuegos en PC y consolas.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
              <a href="/nosotros" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Sobre Nosotros</a>
              <a href="/privacidad" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Privacidad</a>
              <a href="/terminos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Términos</a>
              <a href="/contacto" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Contacto</a>
            </div>
          </div>
        </footer>

        <CookieBanner />
      </body>
    </html>
  );
}
