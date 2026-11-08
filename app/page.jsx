'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Conexión a Supabase
const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

const RelojRegresivo = ({ fechaDestino }) => {
  const calcularTiempo = () => {
    const diferencia = +new Date(fechaDestino) - +new Date();
    let tiempo = { dias: 0, horas: 0, minutos: 0 };
    if (diferencia > 0) {
      tiempo = {
        dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diferencia / 1000 / 60) % 60)
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
    return <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#a855f7', textShadow: '0 0 10px rgba(168,85,247,0.5)' }}>¡Ya disponible!</span>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'monospace', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
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
      const { data } = await supabase.from('games').select('*, game_prices(*)').order('release_date', { ascending: true });
      if (data) setGames(data);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const hoy = new Date('2026-11-08'); 

  const futuros = games.filter(game => game.release_date && new Date(game.release_date) > hoy);
  const mostAnticipated = futuros.slice(0, 4); 
  const comingSoon = futuros.slice(4); 
  
  const catalogoDisponible = games.filter(game => !game.release_date || new Date(game.release_date) <= hoy);
  const juegosFiltrados = games.filter(game => game.title.toLowerCase().includes(busqueda.toLowerCase()));

  const formatearFecha = (fechaString) => {
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#e2e8f0' }}>
      
      {/* SECCIÓN 1: MOST ANTICIPATED (AQUÍ ATERRIZA EL BOTÓN "PRÓXIMOS") */}
      {mostAnticipated.length > 0 && !busqueda && (
        <div id="proximos" style={{ marginBottom: '60px', marginTop: '20px', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', borderBottom: '3px solid #a855f7', display: 'inline-block', paddingBottom: '5px', marginBottom: '25px', letterSpacing: '1px' }}>
            🔥 Más Esperados
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '25px' }}>
            {mostAnticipated.map(game => (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  position: 'relative', height: '260px', borderRadius: '12px', overflow: 'hidden',
                  backgroundImage: `url(${game.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer',
                  border: '1px solid #1f293d'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(168,85,247,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.6)'; }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(11, 13, 23, 0.95) 15%, rgba(11, 13, 23, 0.4) 100%)', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ margin: '0', color: '#fff', fontSize: '1.8rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{game.title}</h3>
                    <p style={{ color: '#cbd5e1', margin: '5px 0 20px 0', fontSize: '1rem', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
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

      {/* SECCIÓN 2: BUSCADOR INTELIGENTE (AQUÍ ATERRIZA EL BOTÓN "OFERTAS") */}
      <h2 id="ofertas" style={{ fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', borderBottom: '3px solid #2dd4bf', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px', letterSpacing: '1px', scrollMarginTop: '100px' }}>
        🔍 Explorar Catálogo y Ofertas
      </h2>
      <div style={{ marginBottom: '40px', position: 'relative', zIndex: 50 }}>
        <input 
          type="text" 
          placeholder="Busca cualquier juego (Ej: Grand Theft Auto VI, Fable)..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setTimeout(() => setSearchFocus(false), 200)} 
          style={{
            width: '100%', padding: '18px 25px', fontSize: '1.2rem', backgroundColor: '#0b0d17',
            border: '2px solid #1f293d', borderRadius: '10px', color: '#fff', outline: 'none',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)', transition: 'border-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = '#a855f7'}
          onMouseLeave={(e) => { if(!searchFocus) e.target.style.borderColor = '#1f293d'; }}
        />
        
        {/* CAJA FLOTANTE DE RESULTADOS */}
        {searchFocus && busqueda && (
          <div style={{ 
            position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#16192b', 
            border: '1px solid #a855f7', borderRadius: '8px', marginTop: '5px', 
            overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.8)' 
          }}>
            {juegosFiltrados.slice(0, 5).map(game => (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ 
                display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px', 
                textDecoration: 'none', color: '#fff', borderBottom: '1px solid #1f293d', transition: 'background 0.2s' 
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f293d'} 
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <img src={game.cover_image} alt={game.title} style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{game.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#2dd4bf' }}>{game.platform || 'Multiplataforma'}</div>
                </div>
              </Link>
            ))}
            {juegosFiltrados.length === 0 && (
              <div style={{ padding: '20px', color: '#94a3b8', textAlign: 'center' }}>No se encontraron juegos con ese nombre.</div>
            )}
            {juegosFiltrados.length > 5 && (
              <div style={{ padding: '10px', backgroundColor: '#0b0d17', color: '#a855f7', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Mostrando 5 de {juegosFiltrados.length} resultados. Presiona Enter para ver todos.
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECCIÓN 3: COMING SOON Y CATÁLOGO EN CUADRÍCULA */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#a855f7', fontSize: '1.2rem', padding: '50px' }}>Cargando la base de datos...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {(busqueda ? juegosFiltrados : comingSoon.concat(catalogoDisponible)).map(game => {
            const precios = game.game_prices || [];
            let mejorPrecio = 'Buscando...';
            if (precios.length > 0) {
              precios.sort((a, b) => Number(a.price) - Number(b.price));
              mejorPrecio = `$${Number(precios[0].price).toFixed(2)}`;
            }

            return (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  backgroundColor: '#0b0d17', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1f293d', 
                  display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.3s, border-color 0.3s' 
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = '#2dd4bf'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1f293d'; }}>
                  <img src={game.cover_image} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'; }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' }}>{game.title}</h3>
                    
                    {new Date(game.release_date) > hoy ? (
                      <p style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 15px 0' }}>
                        Llega el: {formatearFecha(game.release_date)}
                      </p>
                    ) : (
                       <div style={{ marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Mejor oferta</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>{mejorPrecio}</span>
                      </div>
                    )}
                    
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ backgroundColor: '#2dd4bf', color: '#0f111a', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>Ver Info</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {busqueda && juegosFiltrados.length === 0 && (
             <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '40px', fontSize: '1.2rem' }}>No encontramos ningún juego con ese nombre.</p>
          )}
        </div>
      )}
    </div>
  );
}
