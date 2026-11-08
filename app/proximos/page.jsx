'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

export default function Proximos() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const hoy = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('games').select('*').gt('release_date', hoy).order('release_date', { ascending: true });
      if (data) setGames(data);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#fff', borderBottom: '3px solid #a855f7', display: 'inline-block', paddingBottom: '10px', marginBottom: '40px' }}>🚀 Próximos Lanzamientos</h1>
      
      {loading ? <p style={{ textAlign: 'center', color: '#a855f7', fontSize: '1.2rem' }}>Buscando futuros lanzamientos...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {games.map(game => (
            <Link href={`/juego/${game.slug}`} key={game.id} style={{ textDecoration: 'none' }}>
              <div style={{ backgroundColor: '#0b0d17', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.3s' }}
                   onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = '#a855f7'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1f293d'; }}>
                <img src={game.cover_image} alt={game.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'} />
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.2rem' }}>{game.title}</h3>
                  <p style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem', margin: '0 0 15px 0' }}>Llega el: {formatearFecha(game.release_date)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
