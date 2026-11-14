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

// Clasificador inteligente para detectar lanzamientos y éxitos AAA
const ESTUDIOS_AAA = [
  'rockstar', 'bethesda', 'sony', 'playstation', 'microsoft', 'xbox', 'square enix',
  'capcom', 'ubisoft', 'electronic arts', 'ea ', 'bandai namco', 'sega', 'nintendo',
  'cd projekt', 'take-two', '2k', 'warner bros', 'kojima', 'remedy', 'blizzard',
  'activision', 'konami', 'fromsoftware', 'naughty dog', 'insomniac', 'santa monica',
  'guerrilla', 'larian', 'bioware', 'obsidian', 'playground games', 'id software',
  'machinegames', 'arkane', 'bungie', 'valve', 'pearl abyss', 'shift up', 'game science',
  'focus entertainment', 'saber interactive', 'deep silver', 'thq nordic', 'io interactive',
  'techland', 'gearbox', 'firaxis', 'ninja theory', 'coalition', 'netherrealm',
  'rocksteady', 'crystal dynamics', 'atlus', 'koei tecmo', 'team ninja', 'platinumgames'
];

const FRANQUICIAS_AAA = [
  'grand theft auto', 'gta', 'fable', 'witcher', 'elder scrolls', 'fallout', 'starfield',
  'doom', 'wolfenstein', 'wolverine', 'spider-man', 'god of war', 'last of us',
  'ghost of', 'death stranding', 'horizon', 'uncharted', 'bloodborne', 'returnal',
  'final fantasy', 'kingdom hearts', 'dragon quest', 'nier', 'tomb raider', 'resident evil',
  'monster hunter', 'devil may cry', 'street fighter', 'pragmata', 'onimusha',
  'assassin\'s creed', 'far cry', 'prince of persia', 'splinter cell', 'rainbow six',
  'star wars', 'mass effect', 'dragon age', 'battlefield', 'need for speed', 'dead space',
  'fc 2', 'fifa', 'elden ring', 'dark souls', 'sekiro', 'tekken', 'dragon ball',
  'persona', 'metaphor', 'sonic', 'yakuza', 'like a dragon', 'civilization', 'bioshock',
  'borderlands', 'mafia', 'max payne', 'control', 'alan wake', 'judas', 'metro',
  'stalker', 's.t.a.l.k.e.r', 'dying light', 'kingdom come', 'cyberpunk', 'baldur\'s gate',
  'gears of war', 'gears', 'halo', 'forza', 'state of decay', 'perfect dark', 'avowed',
  'hellblade', 'black myth', 'crimson desert', 'dune', 'subnautica', 'silksong',
  'diablo', 'world of warcraft', 'overwatch', 'call of duty', 'metal gear', 'silent hill',
  'mortal kombat', 'batman', 'hogwarts', 'james bond', '007', 'indiana jones',
  'warhammer', 'space marine', 'helldivers', 'destiny', 'red dead', 'hitman',
  'phantom blade', 'stellar blade', 'lies of p', 'exodus', 'intergalactic', 'saros'
];

function calcularPuntajeAAA(game) {
  let puntos = 0;
  const titulo = (game.title || '').toLowerCase();
  const estudio = `${game.developer || ''} ${game.publisher || ''}`.toLowerCase();
  const plataformas = (game.platform || '').toLowerCase();

  if (FRANQUICIAS_AAA.some((f) => titulo.includes(f))) puntos += 100;
  if (ESTUDIOS_AAA.some((e) => estudio.includes(e))) puntos += 70;
  if (game.trailer_url) puntos += 25;
  if (game.cover_image && !game.cover_image.includes('unsplash')) puntos += 20;
  if (plataformas.includes('playstation 5') || plataformas.includes('xbox series')) puntos += 20;
  if (game.summary && game.summary.length > 120 && !game.summary.startsWith('Sin descripción')) puntos += 10;

  return puntos;
}

const RelojRegresivo = ({ fechaDestino }) => {
  const calcularTiempo = () => {
    if (!fechaDestino) return { dias: 0, horas: 0, minutos: 0 };
    const soloFecha = fechaDestino.split('T')[0];
    const diferencia = +new Date(`${soloFecha}T00:00:00`) - +new Date();
    let tiempo = { dias: 0, horas: 0, minutos: 0 };
    if (diferencia > 0) {
      tiempo = {
        dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diferencia / 1000 / 60) % 60),
      };
    }
    return tiempo;
  };

  const [tiempoFaltante, setTiempoFaltante] = useState(calcularTiempo());

  useEffect(() => {
    const timer = setInterval(() => setTiempoFaltante(calcularTiempo()), 60000);
    return () => clearInterval(timer);
  }, [fechaDestino]);

  if (tiempoFaltante.dias === 0 && tiempoFaltante.horas === 0 && tiempoFaltante.minutos === 0) {
    return (
      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7', textShadow: '0 0 10px rgba(168,85,247,0.5)' }}>
        ¡Ya disponible!
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'monospace', fontSize: '2.3rem', fontWeight: 'bold', color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
      <div style={{ textAlign: 'center' }}>
        <span>{String(tiempoFaltante.dias).padStart(3, '0')}</span>
        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', letterSpacing: '1px', fontFamily: 'sans-serif' }}>DÍAS</span>
      </div>
      <span style={{ fontSize: '2rem', opacity: 0.5, paddingBottom: '15px', color: '#a855f7' }}>|</span>
      <div style={{ textAlign: 'center' }}>
        <span>{String(tiempoFaltante.horas).padStart(2, '0')}</span>
        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', letterSpacing: '1px', fontFamily: 'sans-serif' }}>HORAS</span>
      </div>
      <span style={{ fontSize: '2rem', opacity: 0.5, paddingBottom: '15px', color: '#a855f7' }}>|</span>
      <div style={{ textAlign: 'center' }}>
        <span>{String(tiempoFaltante.minutos).padStart(2, '0')}</span>
        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', letterSpacing: '1px', fontFamily: 'sans-serif' }}>MINS</span>
      </div>
    </div>
  );
};

export default function Catalogo() {
  const [games, setGames] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase
        .from('games')
        .select('*, game_prices(*)')
        .order('release_date', { ascending: true });
      if (data) setGames(data);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const parseFechaLocal = (fechaString) => {
    const soloFecha = fechaString.split('T')[0];
    return new Date(`${soloFecha}T12:00:00`);
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Por confirmar';
    return parseFechaLocal(fechaString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // 1. TOP 4 MÁS ESPERADOS AAA (Ordenados por relevancia AAA, no por indies del día siguiente)
  const futurosAAA = games
    .filter((game) => game.release_date && parseFechaLocal(game.release_date) > hoy)
    .map((game) => ({ ...game, puntajeAAA: calcularPuntajeAAA(game) }))
    .sort((a, b) => {
      if (b.puntajeAAA !== a.puntajeAAA) return b.puntajeAAA - a.puntajeAAA;
      return parseFechaLocal(a.release_date) - parseFechaLocal(b.release_date);
    });

  const mostAnticipatedAAA = futurosAAA.slice(0, 4);

  // 2. JUEGOS LANZADOS CON OFERTAS ACTIVAS
  const conOfertas = games
    .filter((game) => {
      const esLanzado = !game.release_date || parseFechaLocal(game.release_date) <= hoy;
      return esLanzado && Array.isArray(game.game_prices) && game.game_prices.length > 0;
    })
    .map((game) => {
      const preciosOrdenados = [...game.game_prices].sort((a, b) => Number(a.price) - Number(b.price));
      return {
        ...game,
        mejorPrecioNum: Number(preciosOrdenados[0].price),
        tiendaTop: preciosOrdenados[0].store_name,
        puntajeAAA: calcularPuntajeAAA(game),
      };
    });

  // Más jugados en oferta (Top 8 por popularidad AAA)
  const masJugadosEnOferta = [...conOfertas]
    .sort((a, b) => b.puntajeAAA - a.puntajeAAA || a.mejorPrecioNum - b.mejorPrecioNum)
    .slice(0, 8);

  const idsMasJugados = new Set(masJugadosEnOferta.map((g) => g.id));

  // Mejores ofertas destacadas (Top 8 más baratos que no se repitan arriba)
  const mejoresOfertasDestacadas = [...conOfertas]
    .filter((g) => !idsMasJugados.has(g.id))
    .sort((a, b) => a.mejorPrecioNum - b.mejorPrecioNum)
    .slice(0, 8);

  // Búsqueda global en todo el catálogo
  const juegosFiltrados = games.filter((game) =>
    game.title.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderTarjetaOferta = (game) => (
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
          <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.08rem', lineHeight: '1.3' }}>
            {game.title}
          </h3>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                {game.tiendaTop || 'Mejor oferta'}
              </span>
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>
                ${game.mejorPrecioNum.toFixed(2)}
              </span>
            </div>
            <span style={{ backgroundColor: '#2dd4bf', color: '#0f111a', padding: '8px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 'bold' }}>
              Ver Oferta
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#e2e8f0' }}>
      {/* SECCIÓN 1: TOP 4 MÁS ESPERADOS AAA */}
      {mostAnticipatedAAA.length > 0 && !busqueda && (
        <div style={{ marginBottom: '50px', marginTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', borderBottom: '3px solid #a855f7', display: 'inline-block', paddingBottom: '5px', margin: 0, letterSpacing: '1px' }}>
              🔥 Más Esperados AAA
            </h2>
            <Link href="/proximos" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem' }}>
              Ver todos los próximos lanzamientos →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px' }}>
            {mostAnticipatedAAA.map((game) => (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    position: 'relative',
                    height: '260px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundImage: `url(${game.cover_image || FALLBACK_IMG})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer',
                    border: '1px solid #1f293d',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(168,85,247,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.6)';
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(11, 13, 23, 0.95) 20%, rgba(11, 13, 23, 0.45) 100%)', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ backgroundColor: '#a855f7', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', alignSelf: 'flex-start', marginBottom: '10px', letterSpacing: '1px' }}>
                      DESTACADO AAA
                    </span>
                    <h3 style={{ margin: '0', color: '#fff', fontSize: '1.75rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      {game.title}
                    </h3>
                    <p style={{ color: '#cbd5e1', margin: '6px 0 18px 0', fontSize: '1rem', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                      Llega el {formatearFecha(game.release_date)}
                    </p>
                    <RelojRegresivo fechaDestino={game.release_date} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: BUSCADOR GLOBAL DE TODO EL CATÁLOGO */}
      <div style={{ marginBottom: '45px', position: 'relative', zIndex: 50 }}>
        <input
          type="text"
          placeholder="🔍 Buscar en todo el catálogo (Ej: Grand Theft Auto VI, Fable, Resident Evil 4)..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setTimeout(() => setSearchFocus(false), 200)}
          style={{
            width: '100%',
            padding: '18px 25px',
            fontSize: '1.15rem',
            backgroundColor: '#0b0d17',
            border: '2px solid #1f293d',
            borderRadius: '10px',
            color: '#fff',
            outline: 'none',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
            transition: 'border-color 0.3s',
          }}
        />

        {searchFocus && busqueda && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#16192b', border: '1px solid #a855f7', borderRadius: '8px', marginTop: '5px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.8)' }}>
            {juegosFiltrados.slice(0, 6).map((game) => (
              <Link
                href={`/juego/${game.slug}`}
                key={game.id}
                style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px', textDecoration: 'none', color: '#fff', borderBottom: '1px solid #1f293d' }}
              >
                <img src={game.cover_image || FALLBACK_IMG} alt={game.title} style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{game.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#2dd4bf' }}>{game.platform || 'Multiplataforma'}</div>
                </div>
              </Link>
            ))}
            {juegosFiltrados.length === 0 && (
              <div style={{ padding: '20px', color: '#94a3b8', textAlign: 'center' }}>No se encontraron juegos con ese nombre.</div>
            )}
          </div>
        )}
      </div>

      {/* RESULTADOS SI EL USUARIO ESTÁ BUSCANDO */}
      {busqueda ? (
        <div>
          <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '20px' }}>
            Resultados para &quot;{busqueda}&quot; ({juegosFiltrados.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
            {juegosFiltrados.slice(0, 24).map((game) => {
              const precios = game.game_prices || [];
              const mejorPrecio = precios.length > 0
                ? `$${Math.min(...precios.map((p) => Number(p.price))).toFixed(2)}`
                : null;
              return (
                <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                  <div style={{ backgroundColor: '#0b0d17', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <img src={game.cover_image || FALLBACK_IMG} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.05rem' }}>{game.title}</h3>
                      {mejorPrecio ? (
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>Desde {mejorPrecio}</span>
                      ) : (
                        <span style={{ color: '#a855f7', fontSize: '0.85rem' }}>{formatearFecha(game.release_date)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : loading ? (
        <p style={{ textAlign: 'center', color: '#a855f7', fontSize: '1.2rem', padding: '50px' }}>
          Cargando destacados y ofertas...
        </p>
      ) : (
        <>
          {/* SECCIÓN 3: MÁS JUGADOS EN OFERTA */}
          {masJugadosEnOferta.length > 0 && (
            <div style={{ marginBottom: '55px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', borderBottom: '3px solid #2dd4bf', display: 'inline-block', paddingBottom: '5px', margin: 0, letterSpacing: '1px' }}>
                  🏆 Más Jugados en Oferta
                </h2>
                <Link href="/ofertas" style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  Ver todas las ofertas →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                {masJugadosEnOferta.map(renderTarjetaOferta)}
              </div>
            </div>
          )}

          {/* SECCIÓN 4: MEJORES OFERTAS DESTACADAS (MENOR PRECIO) */}
          {mejoresOfertasDestacadas.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', borderBottom: '3px solid #10b981', display: 'inline-block', paddingBottom: '5px', margin: 0, letterSpacing: '1px' }}>
                  💎 Mejores Ofertas del Día
                </h2>
                <Link href="/ofertas" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem' }}>
                  Explorar catálogo completo de ofertas →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                {mejoresOfertasDestacadas.map(renderTarjetaOferta)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
