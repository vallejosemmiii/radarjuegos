'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Conexión a Supabase
const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

// Componente del Reloj Regresivo
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
    return <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>¡Ya disponible!</span>;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'monospace', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
      <div style={{ textAlign: 'center' }}>
        <span>{String(tiempoFaltante.dias).padStart(3, '0')}</span>
        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', letterSpacing: '1px', fontFamily: 'sans-serif' }}>DAYS</span>
      </div>
      <span style={{ fontSize: '2rem', opacity: 0.5, paddingBottom: '15px' }}>|</span>
      <div style={{ textAlign: 'center' }}>
        <span>{String(tiempoFaltante.horas).padStart(2, '0')}</span>
        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', letterSpacing: '1px', fontFamily: 'sans-serif' }}>HOURS</span>
      </div>
      <span style={{ fontSize: '2rem', opacity: 0.5, paddingBottom: '15px' }}>|</span>
      <div style={{ textAlign: 'center' }}>
        <span>{String(tiempoFaltante.minutos).padStart(2, '0')}</span>
        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'normal', letterSpacing: '1px', fontFamily: 'sans-serif' }}>MINUTES</span>
      </div>
    </div>
  );
};

export default function Catalogo() {
  const [games, setGames] = useState([]);
  const [busqueda, setBusqueda] = useState('');
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
  const juegosFiltrados = catalogoDisponible.filter(game => game.title.toLowerCase().includes(busqueda.toLowerCase()));

  const formatearFecha = (fechaString) => {
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fechaString).toLocaleDateString('en-GB', opciones);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#e2e8f0' }}>
      
      {/* SECCIÓN 1: MOST ANTICIPATED */}
      {mostAnticipated.length > 0 && !busqueda && (
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase', borderBottom: '2px solid #2dd4bf', display: 'inline-block', paddingBottom: '5px', marginBottom: '25px', letterSpacing: '1px' }}>
            Most Anticipated
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
            {mostAnticipated.map(game => (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  position: 'relative', height: '240px', borderRadius: '12px', overflow: 'hidden',
                  backgroundImage: `url(${game.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.5)', transition: 'transform 0.2s', cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(15, 17, 26, 0.9) 10%, rgba(15, 17, 26, 0.4) 100%)', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ margin: '0', color: '#fff', fontSize: '1.6rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{game.title}</h3>
                    <p style={{ color: '#cbd5e1', margin: '5px 0 20px 0', fontSize: '1rem', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                      {formatearFecha(game.release_date)}
                    </p>
                    <RelojRegresivo fechaDestino={game.release_date} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: COMING SOON */}
      {comingSoon.length > 0 && !busqueda && (
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase', borderBottom: '2px solid #a855f7', display: 'inline-block', paddingBottom: '5px', marginBottom: '25px', letterSpacing: '1px' }}>
            Coming Soon
          </h2>
          {/* CUADRÍCULA CORREGIDA */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {comingSoon.map(game => (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: '#16192b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <img src={game.cover_image} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=340&fit=crop'; }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' }}>{game.title}</h3>
                    <p style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.85rem', margin: '0 0 15px 0' }}>
                      Llega el: {formatearFecha(game.release_date)}
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ backgroundColor: '#2dd4bf', color: '#0f111a', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>Ver Info</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 3: RECENTLY REVIEWED Y BUSCADOR */}
      <h2 style={{ fontSize: '1.2rem', color: '#fff', textTransform: 'uppercase', borderBottom: '2px solid #2dd4bf', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px', letterSpacing: '1px' }}>
        Recently Reviewed
      </h2>
      <div style={{ marginBottom: '35px' }}>
        <input 
          type="text" 
          placeholder="🔍 Buscar juego ya lanzado..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%', padding: '16px 20px', fontSize: '1.1rem', backgroundColor: '#16192b',
            border: '1px solid #1f293d', borderRadius: '8px', color: '#fff', outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2dd4bf'}
          onBlur={(e) => e.target.style.borderColor = '#1f293d'}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', padding: '50px' }}>Cargando catálogo...</p>
      ) : (
        /* CUADRÍCULA CORREGIDA */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {juegosFiltrados.length > 0 ? (
            juegosFiltrados.map(game => {
              const precios = game.game_prices || [];
              let mejorPrecio = 'Sin Stock';
              if (precios.length > 0) {
                precios.sort((a, b) => Number(a.price) - Number(b.price));
                mejorPrecio = `$${Number(precios[0].price).toFixed(2)}`;
              }

              return (
                <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                  <div style={{ backgroundColor: '#16192b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s' }}
                       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <img src={game.cover_image} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=340&fit=crop'; }} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' }}>{game.title}</h3>
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Mejor oferta</span>
                          <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem' }}>{mejorPrecio}</span>
                        </div>
                        <span style={{ backgroundColor: '#a855f7', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>Ver Ofertas</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No se encontraron resultados.</p>
          )}
        </div>
      )}
    </div>
  );
}
