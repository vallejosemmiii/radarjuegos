'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Conexión a Supabase
const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

// Convertir enlace normal de YouTube a formato Embed
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
  const [pestañaActiva, setPestañaActiva] = useState('acerca');

  useEffect(() => {
    if (!slug) return;
    async function cargarJuego() {
      const { data, error } = await supabase
        .from('games')
        .select('*, game_prices(*)')
        .eq('slug', slug)
        .single();
      
      if (data) setGame(data);
      setLoading(false);
    }
    cargarJuego();
  }, [slug]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>Cargando información del juego...</div>;
  }

  if (!game) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
        <h2>Juego no encontrado</h2>
        <Link href="/" style={{ color: '#a855f7', textDecoration: 'none' }}>← Volver al catálogo</Link>
      </div>
    );
  }

  const trailerEmbed = obtenerEmbedUrl(game.trailer_url);
  const precios = game.game_prices?.sort((a, b) => Number(a.price) - Number(b.price)) || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#e2e8f0', fontFamily: 'sans-serif' }}>
      
      {/* BOTÓN VOLVER */}
      <Link href="/" style={{ color: '#a855f7', textDecoration: 'none', marginBottom: '20px', display: 'inline-block', fontSize: '0.9rem' }}>
        ← Volver al catálogo
      </Link>

      {/* CABECERA: CARÁTULA Y TRÁILER */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', marginBottom: '30px' }}>
        <img 
          src={game.cover_image} 
          alt={game.title} 
          style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', objectFit: 'cover', height: '400px' }} 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=340&fit=crop'; }}
        />
        
        <div style={{ backgroundColor: '#16192b', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1f293d' }}>
          {trailerEmbed ? (
            <iframe 
              src={trailerEmbed} 
              style={{ width: '100%', height: '100%', border: 'none', minHeight: '400px' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          ) : (
            <div style={{ color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '2rem' }}>🎬</span>
              <span>Tráiler oficial no disponible</span>
            </div>
          )}
        </div>
      </div>

      {/* TÍTULO Y PLATAFORMAS */}
      <h1 style={{ fontSize: '2.5rem', color: '#fff', margin: '0 0 10px 0' }}>{game.title}</h1>
      <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 30px 0' }}>Plataformas: {game.platform || 'No especificadas'}</p>

      {/* PESTAÑAS */}
      <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #1f293d', marginBottom: '30px' }}>
        <button 
          onClick={() => setPestañaActiva('acerca')}
          style={{ background: 'none', border: 'none', color: pestañaActiva === 'acerca' ? '#fff' : '#94a3b8', borderBottom: pestañaActiva === 'acerca' ? '3px solid #a855f7' : '3px solid transparent', cursor: 'pointer', padding: '10px 0', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.3s' }}>
          Acerca de
        </button>
        <button 
          onClick={() => setPestañaActiva('comunidad')}
          style={{ background: 'none', border: 'none', color: pestañaActiva === 'comunidad' ? '#fff' : '#94a3b8', borderBottom: pestañaActiva === 'comunidad' ? '3px solid #a855f7' : '3px solid transparent', cursor: 'pointer', padding: '10px 0', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.3s' }}>
          Comunidad
        </button>
        <button 
          onClick={() => setPestañaActiva('multimedia')}
          style={{ background: 'none', border: 'none', color: pestañaActiva === 'multimedia' ? '#fff' : '#94a3b8', borderBottom: pestañaActiva === 'multimedia' ? '3px solid #a855f7' : '3px solid transparent', cursor: 'pointer', padding: '10px 0', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.3s' }}>
          Multimedia
        </button>
      </div>

      {/* CONTENIDO DE LAS PESTAÑAS */}
      {pestañaActiva === 'acerca' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }}>
          
          {/* Bloque Ficha Técnica (Izquierda) */}
          <div style={{ backgroundColor: '#0b0d17', padding: '25px', borderRadius: '12px', border: '1px solid #1f293d' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Desarrollador</h4>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{game.developer || 'No especificado'}</span>
              </div>
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Distribuidor</h4>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{game.publisher || 'No especificado'}</span>
              </div>
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Géneros</h4>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{game.genres || 'No especificado'}</span>
              </div>
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Modos de Juego</h4>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{game.game_modes || 'No especificado'}</span>
              </div>
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Temáticas</h4>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{game.themes || 'No especificado'}</span>
              </div>
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 5px 0', textTransform: 'uppercase' }}>Motor Gráfico</h4>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{game.game_engine || 'No especificado'}</span>
              </div>
            </div>
            
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '30px', borderBottom: '1px solid #1f293d', paddingBottom: '10px' }}>Resumen</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '1rem' }}>{game.summary || 'Sin descripción disponible.'}</p>
          </div>

          {/* Bloque Precios (Derecha) */}
          <div style={{ backgroundColor: '#16192b', padding: '25px', borderRadius: '12px', border: '1px solid #a855f7', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#a855f7', textAlign: 'center' }}>Mejores Ofertas</h3>
            {precios.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {precios.map(precio => (
                  <div key={precio.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f111a', padding: '15px', borderRadius: '8px' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{precio.store_name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>${precio.price}</span>
                      <a href={precio.affiliate_url || '#'} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#a855f7', color: '#fff', padding: '8px 15px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        Comprar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Buscando ofertas... (O el juego aún no se lanza)</p>
            )}
          </div>
        </div>
      )}

      {pestañaActiva === 'comunidad' && (
        <div style={{ padding: '40px', backgroundColor: '#16192b', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f293d' }}>
          <h3 style={{ color: '#fff' }}>Foros y Comunidad</h3>
          <p style={{ color: '#94a3b8' }}>Próximamente los jugadores podrán dejar sus reseñas y comentarios sobre {game.title}.</p>
        </div>
      )}

      {pestañaActiva === 'multimedia' && (
        <div style={{ padding: '40px', backgroundColor: '#16192b', borderRadius: '12px', textAlign: 'center', border: '1px solid #1f293d' }}>
          <h3 style={{ color: '#fff' }}>Galería de Imágenes</h3>
          <p style={{ color: '#94a3b8' }}>Más capturas de pantalla y material promocional estarán disponibles pronto.</p>
        </div>
      )}

    </div>
  );
}
