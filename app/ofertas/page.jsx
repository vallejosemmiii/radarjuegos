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

export default function Ofertas() {
  const [games, setGames] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('precio'); // 'precio' | 'baratos15'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase.from('games').select('*, game_prices(*)');
      if (data) {
        // Filtrar solo juegos que tengan precios activos
        const soloConOfertas = data
          .filter((game) => Array.isArray(game.game_prices) && game.game_prices.length > 0)
          .map((game) => {
            const preciosOrdenados = [...game.game_prices].sort((a, b) => Number(a.price) - Number(b.price));
            return {
              ...game,
              mejorPrecioNum: Number(preciosOrdenados[0].price),
              tiendaTop: preciosOrdenados[0].store_name,
              cantidadTiendas: preciosOrdenados.length,
            };
          });
        setGames(soloConOfertas);
      }
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const filtrados = games
    .filter((game) => {
      const coincideNombre = game.title.toLowerCase().includes(busqueda.toLowerCase());
      const coincidePrecio = orden === 'baratos15' ? game.mejorPrecioNum <= 15 : true;
      return coincideNombre && coincidePrecio;
    })
    .sort((a, b) => a.mejorPrecioNum - b.mejorPrecioNum);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '3px solid #2dd4bf', display: 'inline-block', paddingBottom: '8px', margin: 0 }}>
          💰 Mejores Ofertas Activas ({filtrados.length})
        </h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setOrden('precio')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #2dd4bf',
              backgroundColor: orden === 'precio' ? '#2dd4bf' : 'transparent',
              color: orden === 'precio' ? '#0f111a' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Todas las Ofertas
          </button>
          <button
            onClick={() => setOrden('baratos15')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #10b981',
              backgroundColor: orden === 'baratos15' ? '#10b981' : 'transparent',
              color: orden === 'baratos15' ? '#0f111a' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🔥 Menos de $15
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Buscar juego en oferta..."
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
        <p style={{ textAlign: 'center', color: '#2dd4bf', fontSize: '1.2rem' }}>Buscando las mejores ofertas...</p>
      ) : filtrados.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.1rem', padding: '40px' }}>
          No se encontraron ofertas con ese filtro.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '25px' }}>
          {filtrados.map((game) => (
            <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  backgroundColor: '#0b0d17',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #1f293d',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'transform 0.3s, border-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = '#2dd4bf';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#1f293d';
                }}
              >
                <img
                  src={game.cover_image || FALLBACK_IMG}
                  alt={game.title}
                  style={{ width: '100%', height: '185px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.1rem' }}>{game.title}</h3>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>
                        {game.tiendaTop} ({game.cantidadTiendas} {game.cantidadTiendas === 1 ? 'tienda' : 'tiendas'})
                      </span>
                      <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        ${game.mejorPrecioNum.toFixed(2)}
                      </span>
                    </div>
                    <span style={{ backgroundColor: '#a855f7', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 'bold' }}>
                      Comparar
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
