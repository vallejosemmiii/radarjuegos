import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '90px 20px',
        textAlign: 'center',
        color: '#e2e8f0',
      }}
    >
      <div
        style={{
          fontSize: '5rem',
          fontWeight: '900',
          fontStyle: 'italic',
          color: '#a855f7',
          lineHeight: 1,
          marginBottom: '15px',
          textShadow: '0 0 25px rgba(168, 85, 247, 0.45)',
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: '2rem', color: '#fff', margin: '0 0 14px 0' }}>
        Esta página salió del radar
      </h1>

      <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6', margin: '0 0 35px 0' }}>
        El enlace que buscas ya no existe, cambió de dirección o la promoción finalizó. Puedes explorar nuestras secciones actualizadas:
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            backgroundColor: '#a855f7',
            color: '#fff',
            padding: '12px 22px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Ir al Inicio
        </Link>
        <Link
          href="/ofertas"
          style={{
            backgroundColor: '#2dd4bf',
            color: '#0f111a',
            padding: '12px 22px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Ver Ofertas
        </Link>
        <Link
          href="/gratuitos"
          style={{
            backgroundColor: '#10b981',
            color: '#0f111a',
            padding: '12px 22px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Juegos Gratis
        </Link>
        <Link
          href="/noticias"
          style={{
            backgroundColor: '#16192b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            padding: '12px 22px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Noticias
        </Link>
      </div>
    </div>
  );
}
