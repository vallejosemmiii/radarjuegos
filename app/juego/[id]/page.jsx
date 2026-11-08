import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Conexión a Supabase
const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

function obtenerLogoTienda(nombreTienda) {
    const logos = { 'Steam': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg', 'Instant Gaming': 'https://www.instant-gaming.com/themes/ig-light/images/ig-logo-round.svg', 'Epic Games': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg', 'Eneba': 'https://www.eneba.com/favicon.ico', 'CDKeys': 'https://www.cdkeys.com/media/favicon/default/cdkeys-favicon.png' };
    return logos[nombreTienda] || 'https://cdn-icons-png.flaticon.com/512/1170/1170679.png';
}

// Función para transformar links de YouTube en reproductores integrados
function obtenerVideoIncrustado(url) {
    if (!url) return null; // Si no hay URL, no mostramos nada falso
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?]*)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1` : null;
}
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { data: game } = await supabase.from('games').select('title').eq('slug', resolvedParams.id).single();
  return { title: game ? `${game.title} - Radar Juegos` : 'Juego no encontrado' };
}

export const revalidate = 0;

export default async function JuegoDetalle({ params }) {
  const resolvedParams = await params;
  const { data: game, error } = await supabase.from('games').select('*, game_prices(*)').eq('slug', resolvedParams.id).single();
  
  if (error || !game) return <h2 style={{ textAlign: 'center', color: '#fff', marginTop: '60px' }}>Juego no encontrado</h2>;

  const precios = game.game_prices || [];
  precios.sort((a, b) => Number(a.price) - Number(b.price));
  const anioLanzamiento = game.release_date || 'TBA';
  const urlVideo = obtenerVideoIncrustado(game.trailer_url);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#e2e8f0' }}>
      <Link href="/" style={{ color: '#a855f7', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>← Volver al catálogo</Link>
      
      {/* SECCIÓN SUPERIOR: CARÁTULA Y VIDEO INCRUSTADO */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        <img 
          src={game.cover_image} 
          alt={game.title} 
          style={{ width: '300px', height: '420px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} 
        />
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#0f111a', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {urlVideo ? (
            <iframe 
              width="100%" 
              height="100%" 
              style={{ minHeight: '420px' }} 
              src={urlVideo} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          ) : (
            <p style={{ color: '#64748b', fontSize: '1.2rem' }}>🎬 Tráiler oficial no disponible</p>
          )}
        </div>
      </div>

      {/* TÍTULO Y PESTAÑAS (Estilo IGDB) */}
      <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#fff' }}>{game.title}</h1>
      <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '20px' }}>Plataformas: {game.platform}</p>
      
      <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #1f293d', paddingBottom: '10px', marginBottom: '20px' }}>
        <span style={{ borderBottom: '3px solid #a855f7', paddingBottom: '11px', color: '#fff', fontWeight: 'bold' }}>Acerca de</span>
        <span style={{ color: '#64748b', cursor: 'pointer' }}>Comunidad</span>
        <span style={{ color: '#64748b', cursor: 'pointer' }}>Multimedia</span>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: FICHA TÉCNICA Y SINOPSIS */}
        <div style={{ flex: '2', minWidth: '60%' }}>
          {/* CUADRÍCULA DE DATOS TÉCNICOS (GRID) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', backgroundColor: '#16192b', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #1f293d' }}>
            <div>
              <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Desarrollador</h4>
              <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '500' }}>{game.developer || 'No especificado'}</p>
            </div>
            <div>
              <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Distribuidor</h4>
              <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '500' }}>{game.publisher || 'No especificado'}</p>
            </div>
            <div>
              <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Géneros</h4>
              <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '500' }}>{game.genres || 'No especificado'}</p>
            </div>
            <div>
              <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Modos de Juego</h4>
              <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '500' }}>{game.game_modes || 'Un jugador'}</p>
            </div>
            <div>
              <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Temáticas</h4>
              <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '500' }}>{game.themes || 'Acción'}</p>
            </div>
            <div>
              <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Motor Gráfico</h4>
              <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '500' }}>{game.game_engine || 'Propio'}</p>
            </div>
            <div>
              <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Fecha de Lanzamiento</h4>
              <p style={{ margin: '0', fontSize: '0.95rem', fontWeight: '500' }}>{anioLanzamiento}</p>
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid #1f293d', paddingBottom: '10px' }}>Sinopsis</h3>
          <p style={{ lineHeight: '1.7', color: '#cbd5e1', fontSize: '1.05rem' }}>{game.summary || `Descubre los mejores precios para ${game.title}.`}</p>
        </div>

        {/* COLUMNA DERECHA: COMPARADOR DE PRECIOS */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#16192b', padding: '25px', borderRadius: '12px', border: '1px solid #1f293d', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#a855f7' }}>Mejores Ofertas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {precios.length > 0 ? precios.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f111a', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={obtenerLogoTienda(p.store_name)} alt={p.store_name} style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                  <span style={{ fontWeight: '500' }}>{p.store_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>${Number(p.price).toFixed(2)}</span>
                  <a href={p.affiliate_url} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#a855f7', color: '#fff', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Ver ↗</a>
                </div>
              </div>
            )) : <p style={{ textAlign: 'center', color: '#64748b' }}>Buscando ofertas...</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
