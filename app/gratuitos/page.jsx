'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  'https://iqndiyuhcjxrugzfyjaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM',
  { auth: { persistSession: false } }
);

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80';

const colorTienda = (tienda) => {
  const t = (tienda || '').toLowerCase();
  if (t.includes('epic')) return '#111827';
  if (t.includes('steam')) return '#1b2838';
  if (t.includes('gog')) return '#581c87';
  if (t.includes('prime')) return '#0369a1';
  if (t.includes('ubisoft')) return '#1d4ed8';
  return '#047857';
};

export default function Gratuitos() {
  const [games, setGames] = useState([]);
  const [tiendaFiltro, setTiendaFiltro] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarGratuitos() {
      const { data } = await supabase.from('games').select('*, game_prices(*)');
      if (data) {
        const gratis = data
          .filter((game) =>
            Array.isArray(game.game_prices) &&
            game.game_prices.some((p) => Number(p.price) === 0)
          )
          .map((game) => {
            const ofertasGratis = game.game_prices.filter((p) => Number(p.price) === 0);
            return {
              ...game,
              ofertasGratis,
              tiendaPrincipal: ofertasGratis[0]?.store_name || 'Tienda Oficial',
              enlaceReclamar: ofertasGratis[0]?.affiliate_url || `/juego/${game.slug}`,
            };
          });
        setGames(gratis);
      }
      setLoading(false);
    }
    cargarGratuitos();
  }, []);

  const tiendasDisponibles = ['Todas', 'Epic Games', 'Steam', 'GOG', 'Prime Gaming'];

  const filtrados = games.filter((game) => {
    const coincideNombre = game.title.toLowerCase().includes(busqueda.toLowerCase());
    if (!coincideNombre) return false;
    if (tiendaFiltro === 'Todas') return true;
    return game.ofertasGratis.some((o) =>
      (o.store_name || '').toLowerCase().includes(tiendaFiltro.toLowerCase())
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '3px solid #10b981', display: 'inline-block', paddingBottom: '8px', margin: '0 0 10px 0' }}>
            🎁 Juegos Gratuitos Activos ({filtrados.length})
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem' }}>
            Reclama juegos completos gratis por tiempo limitado en Epic Games, Steam, GOG, Prime Gaming y más.
          </p>
        </div>
      </div>

      {/* FILTROS POR TIENDA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
        {tiendasDisponibles.map((tienda) => (
          <button
            key={tienda}
            onClick={() => setTiendaFiltro(tienda)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #10b981',
              backgroundColor: tiendaFiltro === tienda ? '#10b981' : 'transparent',
              color: tiendaFiltro === tienda ? '#0f111a' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tienda}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="🔍 Buscar juego gratuito..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '16px 22px',
          fontSize: '1.1rem',
          backgroundColor: '#0b0d17',
          border: '2px solid #1f293d',
          borderRadius: '10px',
          color: '#fff',
          outline: 'none',
          marginBottom: '35px',
        }}
      />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#10b981', fontSize: '1.2rem' }}>
          Rastreando juegos gratuitos en todas las tiendas...
        </p>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#0b0d17', borderRadius: '12px', border: '1px solid #1f293d' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
            No hay juegos gratuitos activos con ese filtro en este momento.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filtrados.map((game) => (
            <div
              key={game.id}
              style={{
                backgroundColor: '#0b0d17',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #10b981',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.12)',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Link href={`/juego/${game.slug}`}>
                  <img
                    src={game.cover_image || FALLBACK_IMG}
                    alt={game.title}
                    style={{ width: '100%', height: '190px', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                </Link>
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: colorTienda(game.tiendaPrincipal),
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {game.tiendaPrincipal}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: '#0f111a',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '900',
                  }}
                >
                  100% GRATIS
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Link href={`/juego/${game.slug}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.15rem' }}>{game.title}</h3>
                </Link>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 18px 0' }}>
                  {game.platform || 'PC'}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <a
                    href={game.enlaceReclamar}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      backgroundColor: '#10b981',
                      color: '#0f111a',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Reclamar Gratis ↗
                  </a>
                  <Link
                    href={`/juego/${game.slug}`}
                    style={{
                      backgroundColor: '#1f293d',
                      color: '#e2e8f0',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Ficha
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
