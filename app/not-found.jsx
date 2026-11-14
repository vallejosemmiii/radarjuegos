import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#e2e8f0', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: '6rem', margin: '0', color: '#a855f7', fontWeight: '900', textShadow: '0 0 25px rgba(168, 85, 247, 0.5)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '2rem', color: '#fff', margin: '10px 0 20px 0' }}>
        Game Over: Página no encontrada
      </h2>
      <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '35px', fontSize: '1.1rem', lineHeight: '1.6' }}>
        Parece que el enlace al que intentas acceder se perdió en otra dimensión o el juego fue movido de servidor.
      </p>
      <Link href="/" style={{ backgroundColor: '#2dd4bf', color: '#0f111a', padding: '14px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
        Volver al Catálogo Principal
      </Link>
    </div>
  );
}
