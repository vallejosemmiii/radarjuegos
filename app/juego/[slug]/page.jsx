'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

// Función para detectar la tienda y darle un color corporativo
const obtenerEstiloTienda = (nombreTienda) => {
  const nombre = nombreTienda.toLowerCase();
  if (nombre.includes('steam')) return { bg: '#1b2838', icon: '💨', textColor: '#fff' };
  if (nombre.includes('epic')) return { bg: '#2a2a2a', icon: '🎮', textColor: '#fff' };
  if (nombre.includes('playstation') || nombre.includes('psn')) return { bg: '#00439c', icon: '🔵', textColor: '#fff' };
  if (nombre.includes('xbox')) return { bg: '#107c10', icon: '🟢', textColor: '#fff' };
  return { bg: '#a855f7', icon: '🛒', textColor: '#fff' }; // Por defecto
};

const obtenerEmbedUrl = (url) => {
  if (!url) return null;
  const videoId = url.split('v=')[1]?.split('&')[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0` : null;
};

export default function DetalleJuego() {
  const params = useParams();
  const slug = params?.slug;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function cargarJuego() {
      const { data } = await supabase.from('games').select('*, game_prices(*)').eq('slug', slug).single();
      if (data) setGame(data);
      setLoading(false);
    }
    cargarJuego();
  }, [slug]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>Cargando...</div>;
  if (!game) return <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>Juego no encontrado</div>;

  const trailerEmbed = obtenerEmbedUrl(game.trailer_url);
  const precios = game.game_prices?.sort((a, b) => Number(a.price) - Number(b.price)) || [];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* FONDO DIFUMINADO ESPECTACULAR */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundImage: `url(${game.cover_image})`, 
        backgroundSize: 'cover', backgroundPosition: 'center', 
        filter: 'blur(40px)', opacity: 0.2, zIndex: -1, transform: 'scale(1.1)' 
      }} />

      {/* CONTENIDO DE LA PÁGINA */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0', zIndex: 1, position: 'relative' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
          
          {/* Columna Izquierda: Carátula y Botones de Compra */}
          <div>
            <img src={game.cover_image} alt={game.title} style={{ width: '100%', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.6)', marginBottom: '30px' }} />
            
            {/* SECCIÓN DE VENTAS (BOTONES ESTILIZADOS) */}
            <div style={{ backgroundColor: 'rgba(22, 25, 43, 0.8)', padding: '20px', borderRadius: '12px', border: '1px solid #2dd4bf', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#2dd4bf', textAlign: 'center' }}>Dónde Comprar</h3>
              {precios.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {precios.map(precio => {
                    const estilo = obtenerEstiloTienda(precio.store_name);
                    return (
                      <a key={precio.id} href={precio.affiliate_url || '#'} target="_blank" rel="noopener noreferrer" 
                         style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: estilo.bg, padding: '12px 15px', borderRadius: '8px', textDecoration: 'none', color: estilo.textColor, fontWeight: 'bold', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                         onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                         onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{estilo.icon}</span>
                          <span>{precio.store_name}</span>
                        </div>
                        <span style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px' }}>${precio.price}</span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Aún no hay ofertas de tiendas disponibles.</p>
              )}
            </div>
          </div>

          {/* Columna Derecha: Tráiler, Título y Ficha */}
          <div>
            <h1 style={{ fontSize: '3.5rem', color: '#fff', margin: '0 0 10px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{game.title}</h1>
            <p style={{ color: '#2dd4bf', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 30px 0' }}>{game.platform}</p>

            {trailerEmbed && (
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #1f293d', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', marginBottom: '30px', height: '450px' }}>
                <iframe src={trailerEmbed} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
              </div>
            )}

            <div style={{ backgroundColor: 'rgba(11, 13, 23, 0.7)', padding: '25px', borderRadius: '12px', border: '1px solid #1f293d', backdropFilter: 'blur(10px)' }}>
              <h3 style={{ color: '#fff', margin: '0 0 15px 0' }}>Resumen</h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem' }}>{game.summary}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
