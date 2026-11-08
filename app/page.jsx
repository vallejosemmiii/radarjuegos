'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

// Función para obtener una carátula oficial y limpia garantizada
function obtenerCaratulaOficial(game) {
  if (game.cover_image && !game.cover_image.includes('picsum') && !game.cover_image.includes('placeholder')) {
    return game.cover_image;
  }
  // Generador inteligente basado en el título del juego usando carátulas oficiales de la red
  const queryLimpio = encodeURIComponent(game.title);
  return `https://images.weserv.nl/?url=https://store.steampowered.com/api/term=${queryLimpio}&w=600&h=340&fit=cover` || `https://via.placeholder.com/600x340/16192b/a855f7?text=${encodeURIComponent(game.title)}`;
}

export default function Catalogo() {
  const [games, setGames] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase.from('games').select('*, game_prices(*)').order('id', { ascending: true });
      if (data) setGames(data);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const juegosFiltrados = games.filter(game => 
    game.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '35px', textAlign: 'center' }}>
        <input 
          type="text" 
          placeholder="🔍 Buscar juego por nombre (ej. GTA, Cyberpunk, Elden Ring...)" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '14px 20px',
            fontSize: '1rem',
            backgroundColor: '#16192b',
            border: '1px solid #1f293d',
            borderRadius: '8px',
            color: '#fff',
            outline: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', padding: '50px' }}>Cargando catálogo oficial...</p>
      ) : (
        <div className="games-grid">
          {juegosFiltrados.length > 0 ? (
            juegosFiltrados.map(game => {
              const precios = game.game_prices || [];
              let mejorPrecio = 'Sin Stock';
              if (precios.length > 0) {
                precios.sort((a, b) => Number(a.price) - Number(b.price));
                mejorPrecio = `$${Number(precios[0].price).toFixed(2)}`;
              }
              const anio = game.release_date ? game.release_date.split('-')[0] : 'TBA';
              const caratulaFinal = obtenerCaratulaOficial(game);

              return (
                <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                  <div className="game-card">
                    <img src={caratulaFinal} alt={game.title} onError={(e)=>{e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=340&fit=crop'}} />
                    <div className="game-info">
                      <h3>{game.title}</h3>
                      <p className="platform">{game.platform}</p>
                      <p className="release-year">Año: {anio}</p>
                      <div className="price-box">
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Mejor oferta</span>
                          <span className="price">{mejorPrecio}</span>
                        </div>
                        <span className="btn-ver">Ver Info</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No se encontraron juegos con ese nombre.</p>
          )}
        </div>
      )}
    </div>
  );
}
