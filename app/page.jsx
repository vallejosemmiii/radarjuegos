'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Conexión a Supabase
const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

export default function Catalogo() {
  const [games, setGames] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase.from('games').select('*, game_prices(*)').order('release_date', { ascending: false });
      if (data) setGames(data);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  // Fecha actual para separar lanzamientos (Usando tu fecha actual: Noviembre 2026)
  const hoy = new Date('2026-11-08');

  // Separar juegos futuros y juegos disponibles
  const proximosLanzamientos = games.filter(game => game.release_date && new Date(game.release_date) > hoy);
  const catalogoDisponible = games.filter(game => !game.release_date || new Date(game.release_date) <= hoy);

  // Filtro del buscador interactivo
  const juegosFiltrados = catalogoDisponible.filter(game => 
    game.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#e2e8f0' }}>
      
      {/* SECCIÓN 1: PRÓXIMOS LANZAMIENTOS */}
      {proximosLanzamientos.length > 0 && !busqueda && (
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2rem', color: '#fff', borderBottom: '2px solid #a855f7', paddingBottom: '10px', marginBottom: '20px' }}>
            🚀 Próximos Lanzamientos
          </h2>
          <div className="games-grid">
            {proximosLanzamientos.map(game => (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                <div className="game-card" style={{ border: '1px solid #a855f7', boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)' }}>
                  <img src={game.cover_image} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  <div className="game-info" style={{ padding: '15px', backgroundColor: '#16192b' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{game.title}</h3>
                    <p style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem', margin: '0' }}>
                      Llega el: {game.release_date}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: BUSCADOR Y CATÁLOGO */}
      <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '20px' }}>🎮 Explorar Catálogo</h2>
      <div style={{ marginBottom: '35px' }}>
        <input 
          type="text" 
          placeholder="🔍 Buscar en toda la base de datos (ej. The Witcher, Cyberpunk...)" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%', padding: '16px 20px', fontSize: '1.1rem', backgroundColor: '#16192b',
            border: '2px solid #1f293d', borderRadius: '8px', color: '#fff', outline: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#a855f7'}
          onBlur={(e) => e.target.style.borderColor = '#1f293d'}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', padding: '50px' }}>Cargando base de datos...</p>
      ) : (
        <div className="games-grid">
          {juegosFiltrados.length > 0 ? (
            juegosFiltrados.map(game => {
              const precios = game.game_prices || [];
              let mejorPrecio = 'Buscando...';
              if (precios.length > 0) {
                precios.sort((a, b) => Number(a.price) - Number(b.price));
                mejorPrecio = `$${Number(precios[0].price).toFixed(2)}`;
              }

              return (
                <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                  <div className="game-card">
                    <img src={game.cover_image} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div className="game-info" style={{ padding: '15px', backgroundColor: '#16192b' }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' }}>{game.title}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 10px 0' }}>{game.platform}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Mejor oferta</span>
                          <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>{mejorPrecio}</span>
                        </div>
                        <span style={{ backgroundColor: '#2dd4bf', color: '#0f111a', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Ver Info</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No se encontraron juegos en la base de datos actual.</p>
          )}
        </div>
      )}
    </div>
  );
}
