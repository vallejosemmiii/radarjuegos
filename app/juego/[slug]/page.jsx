'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const supabase = createClient(
  'https://iqndiyuhcjxrugzfyjaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM',
  { auth: { persistSession: false } }
);

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80';

const obtenerEstiloTienda = (nombreTienda) => {
  const nombre = (nombreTienda || '').toLowerCase();
  if (nombre.includes('steam')) return { bg: '#1b2838', icon: '💨', textColor: '#fff' };
  if (nombre.includes('epic')) return { bg: '#2a2a2a', icon: '🎮', textColor: '#fff' };
  if (nombre.includes('gog')) return { bg: '#4c1d95', icon: '🌌', textColor: '#fff' };
  if (nombre.includes('humble')) return { bg: '#991b1b', icon: '❤️', textColor: '#fff' };
  if (nombre.includes('greenman')) return { bg: '#15803d', icon: '🟢', textColor: '#fff' };
  if (nombre.includes('fanatical')) return { bg: '#c2410c', icon: '🔥', textColor: '#fff' };
  if (nombre.includes('free-to-play')) return { bg: '#047857', icon: '🎁', textColor: '#fff' };
  if (nombre.includes('playstation') || nombre.includes('psn')) return { bg: '#00439c', icon: '🔵', textColor: '#fff' };
  if (nombre.includes('xbox')) return { bg: '#107c10', icon: '🟢', textColor: '#fff' };
  return { bg: '#a855f7', icon: '🛒', textColor: '#fff' };
};

const obtenerEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&mute=0` : null;
};

const formatearFecha = (fechaString) => {
  if (!fechaString) return 'Por confirmar';
  const soloFecha = fechaString.split('T')[0];
  return new Date(`${soloFecha}T12:00:00`).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function DetalleJuego() {
  const params = useParams();
  const slug = params?.slug;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function cargarJuego() {
      const { data } = await supabase
        .from('games')
        .select('*, game_prices(*)')
        .ilike('slug', slug)
        .single();

      if (data) setGame(data);
      setLoading(false);
    }
    cargarJuego();
  }, [slug]);

  const copiarEnlace = () => {
    const urlActual = `https://radarjuegos.lat/juego/${slug}`;
    navigator.clipboard.writeText(urlActual);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', color: '#a855f7', fontSize: '1.2rem' }}>
        Cargando ficha del juego...
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Juego no encontrado</h2>
        <Link href="/" style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver al catálogo principal
        </Link>
      </div>
    );
  }

  const trailerEmbed = obtenerEmbedUrl(game.trailer_url);
  const precios = [...(game.game_prices || [])].sort((a, b) => Number(a.price) - Number(b.price));
  const urlCompartir = encodeURIComponent(`https://radarjuegos.lat/juego/${game.slug}`);
  const textoCompartir = encodeURIComponent(`Mira las ofertas y detalles de ${game.title} en RadarJuegos:`);

  const detallesTecnicos = [
    { etiqueta: 'Lanzamiento', valor: formatearFecha(game.release_date) },
    { etiqueta: 'Desarrollador', valor: game.developer },
    { etiqueta: 'Editor', valor: game.publisher },
    { etiqueta: 'Géneros', valor: game.genres },
    { etiqueta: 'Modos de juego', valor: game.game_modes },
    { etiqueta: 'Motor gráfico', valor: game.game_engine },
    { etiqueta: 'Temáticas', valor: game.themes },
  ].filter((item) => item.valor && item.valor !== 'No especificado');

  return (
    <article style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* FONDO DIFUMINADO */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${game.cover_image || FALLBACK_IMG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(45px)',
          opacity: 0.22,
          zIndex: -1,
          transform: 'scale(1.1)',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '35px 20px', color: '#e2e8f0', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '25px' }}>
          <Link
            href="/"
            style={{
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Volver al catálogo
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start' }}>
          {/* COLUMNA IZQUIERDA */}
          <div style={{ flex: '1 1 300px', maxWidth: '100%' }}>
            <img
              src={game.cover_image || FALLBACK_IMG}
              alt={game.title}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
              style={{
                width: '100%',
                borderRadius: '12px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
                marginBottom: '25px',
                border: '1px solid #1f293d',
              }}
            />

            {/* COMPARADOR DE PRECIOS */}
            <section
              style={{
                backgroundColor: 'rgba(11, 13, 23, 0.85)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #2dd4bf',
                backdropFilter: 'blur(10px)',
                marginBottom: '25px',
              }}
            >
              <h3 style={{ margin: '0 0 18px 0', color: '#2dd4bf', textAlign: 'center', fontSize: '1.2rem' }}>
                💰 Dónde Conseguirlo
              </h3>
              {precios.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {precios.map((precio) => {
                    const estilo = obtenerEstiloTienda(precio.store_name);
                    const esGratis = Number(precio.price) === 0;
                    return (
                      <a
                        key={precio.id}
                        href={precio.affiliate_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: estilo.bg,
                          padding: '12px 15px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: estilo.textColor,
                          fontWeight: 'bold',
                          transition: 'transform 0.2s',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{estilo.icon}</span>
                          <span>{precio.store_name}</span>
                        </div>
                        <span style={{ backgroundColor: 'rgba(0,0,0,0.45)', padding: '4px 10px', borderRadius: '4px', color: '#10b981' }}>
                          {esGratis ? 'GRATIS' : `$${Number(precio.price).toFixed(2)}`}
                        </span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                  Aún no hay ofertas digitales disponibles para este título.
                </p>
              )}
            </section>

            {/* COMPARTIR EN REDES */}
            <section
              style={{
                backgroundColor: 'rgba(11, 13, 23, 0.85)',
                padding: '18px',
                borderRadius: '12px',
                border: '1px solid #1f293d',
                marginBottom: '25px',
              }}
            >
              <h4 style={{ margin: '0 0 12px 0', color: '#cbd5e1', fontSize: '0.9rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Compartir Ficha
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${urlCompartir}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, textAlign: 'center', backgroundColor: '#1877f2', color: '#fff', padding: '9px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}
                >
                  Facebook
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${textoCompartir}%20${urlCompartir}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, textAlign: 'center', backgroundColor: '#25d366', color: '#0f111a', padding: '9px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}
                >
                  WhatsApp
                </a>
                <button
                  onClick={copiarEnlace}
                  style={{ flex: 1, backgroundColor: '#1f293d', color: '#fff', border: '1px solid #334155', padding: '9px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {copiado ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </section>

            {/* FICHA TÉCNICA */}
            {detallesTecnicos.length > 0 && (
              <section
                style={{
                  backgroundColor: 'rgba(11, 13, 23, 0.85)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #1f293d',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h3 style={{ margin: '0 0 15px 0', color: '#a855f7', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Ficha Técnica
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {detallesTecnicos.map((item) => (
                    <div key={item.etiqueta} style={{ borderBottom: '1px solid #1f293d', paddingBottom: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                        {item.etiqueta}
                      </span>
                      <span style={{ color: '#f1f5f9', fontSize: '0.95rem', fontWeight: '500' }}>
                        {item.valor}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* COLUMNA DERECHA */}
          <div style={{ flex: '2 1 550px', minWidth: '0' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#fff', margin: '0 0 12px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', lineHeight: '1.15' }}>
              {game.title}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '28px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid #a855f7',
                  color: '#e9d5ff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                }}
              >
                📅 {formatearFecha(game.release_date)}
              </span>
              {game.platform && (
                <span style={{ color: '#2dd4bf', fontSize: '1rem', fontWeight: 'bold' }}>
                  {game.platform}
                </span>
              )}
            </div>

            {trailerEmbed && (
              <div
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #1f293d',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                  marginBottom: '30px',
                  aspectRatio: '16 / 9',
                }}
              >
                <iframe
                  src={trailerEmbed}
                  title={`Tráiler de ${game.title}`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <section
              style={{
                backgroundColor: 'rgba(11, 13, 23, 0.8)',
                padding: '28px',
                borderRadius: '12px',
                border: '1px solid #1f293d',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3 style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '1.3rem', borderBottom: '2px solid #a855f7', display: 'inline-block', paddingBottom: '5px' }}>
                Acerca del juego
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0, whiteSpace: 'pre-line' }}>
                {game.summary || 'Sin descripción disponible en este momento.'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
