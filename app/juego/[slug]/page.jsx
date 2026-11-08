import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Conexión a Supabase (reemplaza con tu URL y llave pública)
const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

// Convertir enlace normal de YouTube a formato Embed
const obtenerEmbedUrl = (url) => {
  if (!url) return null;
  const videoId = url.split('v=')[1]?.split('&')[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : null;
};

export default async function DetalleJuego({ params }) {
  const { slug } = params;

  // Buscar el juego y sus precios en Supabase
  const { data: game, error } = await supabase
    .from('games')
    .select('*, game_prices(*)')
    .eq('slug', slug)
    .single();

  if (error || !game) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
        <h2>Juego no encontrado</h2>
        <Link href="/" style={{ color: '#2dd4bf', textDecoration: 'none' }}>← Volver al inicio</Link>
      </div>
    );
  }

  const trailerEmbed = obtenerEmbedUrl(game.trailer_url);
  const precios = game.game_prices?.sort((a, b) => Number(a.price) - Number(b.price)) || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0' }}>
      <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Volver al catálogo
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
        
        {/* COLUMNA IZQUIERDA: Tráiler y Detalles */}
        <div>
          <h1 style={{ fontSize: '3rem', color: '#fff', margin: '0 0 10px 0' }}>{game.title}</h1>
          <p style={{ fontSize: '1.2rem', color: '#a855f7', margin: '0 0 30px 0', fontWeight: 'bold' }}>
            Lanzamiento: {game.release_date || 'Por confirmar'}
          </p>

          {/* Reproductor de Video */}
          {trailerEmbed ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom: '30px' }}>
              <iframe 
                src={trailerEmbed} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          ) : (
            <img src={game.cover_image} alt={game.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '30px' }} />
          )}

          <h3 style={{ color: '#fff', fontSize: '1.5rem', borderBottom: '1px solid #1f293d', paddingBottom: '10px' }}>Sobre el juego</h3>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#cbd5e1' }}>{game.summary}</p>
        </div>

        {/* COLUMNA DERECHA: Precios y Ficha Técnica */}
        <div>
          {/* Ficha Técnica */}
          <div style={{ backgroundColor: '#16192b', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #1f293d' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>Ficha Técnica</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8', lineHeight: '2' }}>
              <li><strong style={{ color: '#fff' }}>Desarrollador:</strong> {game.developer || 'Desconocido'}</li>
              <li><strong style={{ color: '#fff' }}>Editor:</strong> {game.publisher || 'Desconocido'}</li>
              <li><strong style={{ color: '#fff' }}>Plataforma:</strong> {game.platform || 'No especificada'}</li>
              <li><strong style={{ color: '#fff' }}>Géneros:</strong> {game.genres || 'Varios'}</li>
              <li><strong style={{ color: '#fff' }}>Motor Gráfico:</strong> {game.game_engine || 'Propio'}</li>
            </ul>
          </div>

          {/* Tabla de Precios */}
          <div style={{ backgroundColor: '#16192b', padding: '25px', borderRadius: '12px', border: '1px solid #2dd4bf' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2dd4bf', textAlign: 'center' }}>💰 Mejores Ofertas</h3>
            
            {precios.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {precios.map(precio => (
                  <div key={precio.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f111a', padding: '15px', borderRadius: '8px' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{precio.store_name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>${precio.price}</span>
                      <a href={precio.affiliate_url || '#'} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#a855f7', color: '#fff', padding: '8px 15px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold', transition: 'background 0.3s' }}>
                        Comprar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>Aún no hay ofertas disponibles o el juego no ha salido.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
