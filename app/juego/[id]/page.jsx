import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

function obtenerLogoTienda(nombreTienda) {
    const logos = { 'Steam': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg', 'Instant Gaming': 'https://www.instant-gaming.com/themes/ig-light/images/ig-logo-round.svg', 'Epic Games': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg', 'Eneba': 'https://www.eneba.com/favicon.ico', 'CDKeys': 'https://www.cdkeys.com/media/favicon/default/cdkeys-favicon.png' };
    return logos[nombreTienda] || 'https://cdn-icons-png.flaticon.com/512/1170/1170679.png';
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const gameSlug = resolvedParams.id;
  const { data: game } = await supabase.from('games').select('title').eq('slug', gameSlug).single();
  return { title: game ? `${game.title} - Mejor Oferta` : 'Juego no encontrado' };
}

export const revalidate = 0;

export default async function JuegoDetalle({ params }) {
  const resolvedParams = await params;
  const gameSlug = resolvedParams.id;

  const { data: game, error } = await supabase.from('games').select('*, game_prices(*)').eq('slug', gameSlug).single();
  
  if (error || !game) return <h2 style={{ textAlign: 'center', color: '#fff', marginTop: '60px' }}>Juego no encontrado</h2>;

  const precios = game.game_prices || [];
  precios.sort((a, b) => Number(a.price) - Number(b.price));
  const anioLanzamiento = game.release_date ? game.release_date.split('-')[0] : 'Desconocido';
  const linkTrailer = game.trailer_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(game.title + ' official trailer')}`;
  const sinopsis = game.summary && game.summary.trim() !== "" ? game.summary : `Descubre la mejor comparativa de precios para ${game.title}.`;
  
  // Carátula oficial garantizada de alta calidad
  const caratulaDetalle = (game.cover_image && !game.cover_image.includes('picsum') && !game.cover_image.includes('placeholder')) 
    ? game.cover_image 
    : `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop`;

  return (
    <div>
      <Link href="/" className="btn-back">← Volver al catálogo</Link>
      <div className="detail-container">
        <div className="detail-header">
          <img src={caratulaDetalle} alt={game.title} />
          <div className="detail-text">
            <h2>{game.title}</h2>
            <p className="platform">{game.platform}</p>
            <p className="release-date">Lanzamiento: <span>{anioLanzamiento}</span></p>
            <div className="summary-box">
              <p className="summary-text">{sinopsis}</p>
            </div>
            <a href={linkTrailer} target="_blank" className="btn-trailer">▶ Ver Tráiler Oficial</a>
          </div>
        </div>
        <div className="detail-prices">
          <h3>Opciones de Compra y Tiendas</h3>
          <div className="store-list">
            {precios.length > 0 ? precios.map(p => (
              <div key={p.id} className="store-item">
                <div className="store-brand">
                  <img src={obtenerLogoTienda(p.store_name)} className="store-logo" alt={p.store_name} />
                  <span className="store-name">{p.store_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span className="store-price">${Number(p.price).toFixed(2)}</span>
                  <a href={p.affiliate_url} target="_blank" className="btn-ver">Ir a la Oferta ↗</a>
                </div>
              </div>
            )) : <p style={{ color: '#94a3b8' }}>No hay ofertas disponibles.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
