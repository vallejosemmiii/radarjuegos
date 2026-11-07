import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Radar Juegos - Ofertas y Lanzamientos',
  description: 'El portal definitivo para comparar precios de videojuegos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="container">
          <header>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1>Radar<span>Juegos</span>.lat</h1>
            </Link>
            <p>El portal definitivo de ofertas y lanzamientos</p>
          </header>
          <main>{children}</main>
          <footer>
            <p>&copy; 2026 radarjuegos.lat - Todos los derechos reservados.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
