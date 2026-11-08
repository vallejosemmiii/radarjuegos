'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

export default function Ofertas() {
  const [games, setGames] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const hoy = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('games').select('*, game_prices(*)').lte('release_date', hoy);
      if (data) setGames(data);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const filtrados = games.filter(game => game.title.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#fff', borderBottom: '3px solid #2dd4bf', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>💰 Ofertas y Catálogo</h1>
      
      <input type="text" placeholder="🔍 Buscar un juego para ver su precio..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: '100%', padding: '18px 25px', fontSize: '1.2rem', backgroundColor: '#0b0d17', border: '2px solid #1f293d', borderRadius: '10px', color: '#fff', outline: 'none', marginBottom: '40px' }}
        onFocus={(e) => e.target.style.borderColor = '#2dd4bf'} onBlur={(e) => e.target.style.borderColor = '#1f293d'} />

      {loading ? <p style={{ textAlign: 'center', color: '#2dd4bf', fontSize: '1.2rem' }}>Cargando mejores precios...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filtrados.map(game => {
            const precios = game.game_prices || [];
            let mejorPrecio = 'Buscando...';
            if (precios.length > 0) {
              precios.sort((a, b) => Number(a.price) - Number(b.price));
              mejorPrecio = `$${Number(precios[0].price).toFixed(2)}`;
            }
            return (
              <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: '#0b0d17', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.3s' }}
                     onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = '#2dd4bf'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1f293d'; }}>
                  <img src={game.cover_image} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.2rem' }}>{game.title}</h3>
                    <div style={{ marginBottom: '15px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Mejor oferta</span>
                      <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>{mejorPrecio}</span>
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
