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

const PALABRAS_AAA = [
  'rockstar', 'bethesda', 'sony', 'playstation', 'microsoft', 'xbox', 'square enix',
  'capcom', 'ubisoft', 'electronic arts', 'bandai namco', 'sega', 'nintendo',
  'cd projekt', 'take-two', '2k', 'warner bros', 'kojima', 'remedy', 'blizzard',
  'activision', 'konami', 'fromsoftware', 'naughty dog', 'insomniac', 'santa monica',
  'guerrilla', 'playground games', 'id software', 'grand theft auto', 'gta', 'fable',
  'witcher', 'elder scrolls', 'doom', 'wolverine', 'spider-man', 'god of war',
  'death stranding', 'ghost of', 'final fantasy', 'resident evil', 'monster hunter',
  'assassin\'s creed', 'star wars', 'mass effect', 'elden ring', 'persona', 'mafia',
  'max payne', 'control', 'judas', 'metro', 'gears', 'halo', 'forza', 'state of decay',
  'perfect dark', 'crimson desert', 'subnautica', 'silksong', 'metal gear', '007',
  'phantom blade', 'exodus', 'intergalactic', 'saros'
];

const esJuegoAAA = (game) => {
  const texto = `${game.title || ''} ${game.developer || ''} ${game.publisher || ''}`.toLowerCase();
  return PALABRAS_AAA.some((palabra) => texto.includes(palabra));
};

export default function Proximos() {
  const [games, setGames] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [soloAAA, setSoloAAA] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const hoy = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('games')
        .select('*')
        .gt('release_date', hoy)
        .order('release_date', { ascending: true });
      if (data) setGames(data);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Por confirmar';
    const soloFecha = fecha.split('T')[0];
    return new Date(`${soloFecha}T12:00:00`).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const filtrados = games.filter((game) => {
    const coincideTexto = game.title.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro = !soloAAA || esJuegoAAA(game);
    return coincideTexto && coincideFiltro;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '3px solid #a855f7', display: 'inline-block', paddingBottom: '8px', margin: 0 }}>
          🚀 Todos los Próximos Lanzamientos ({filtrados.length})
        </h1>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setSoloAAA(false)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #a855f7',
              backgroundColor: !soloAAA ? '#a855f7' : 'transparent',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Todos ({games.length})
          </button>
          <button
            onClick={() => setSoloAAA(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #2dd4bf',
              backgroundColor: soloAAA ? '#2dd4bf' : 'transparent',
              color: soloAAA ? '#0f111a' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ⭐ Solo AAA
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Buscar próximo lanzamiento..."
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
        <p style={{ textAlign: 'center', color: '#a855f7', fontSize: '1.2rem' }}>Cargando calendario de lanzamientos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '25px' }}>
          {filtrados.map((game) => {
            const aaa = esJuegoAAA(game);
            return (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    backgroundColor: '#0b0d17',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: aaa ? '1px solid #a855f7' : '1px solid #1f293d',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
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
                    <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' }}>{game.title}</h3>
                    <p style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 15px 0' }}>
                      📅 {formatearFecha(game.release_date)}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {aaa ? '⭐ Título AAA' : 'Lanzamiento'}
                      </span>
                      <span style={{ backgroundColor: '#2dd4bf', color: '#0f111a', padding: '6px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 'bold' }}>
                        Ver Ficha
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
