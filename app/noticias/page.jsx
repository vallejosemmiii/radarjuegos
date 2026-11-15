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

const formatearFechaNoticia = (isoString) => {
  if (!isoString) return 'Hoy';
  return new Date(isoString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [cantidadVisible, setCantidadVisible] = useState(24);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarNoticias() {
      const { data } = await supabase
        .from('noticias')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(150);

      if (data) setNoticias(data);
      setLoading(false);
    }
    cargarNoticias();
  }, []);

  const categorias = ['Todas', 'Lanzamientos', 'PC / Steam', 'PlayStation', 'Xbox', 'Nintendo', 'Actualidad'];

  const filtradas = noticias.filter((n) => {
    const coincideTexto =
      n.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      (n.summary || '').toLowerCase().includes(busqueda.toLowerCase());
    if (!coincideTexto) return false;
    if (categoriaFiltro === 'Todas') return true;
    return n.category === categoriaFiltro;
  });

  const destacada = !busqueda && categoriaFiltro === 'Todas' && filtradas.length > 0 ? filtradas[0] : null;
  const restoNoticias = destacada ? filtradas.slice(1) : filtradas;
  const visibles = restoNoticias.slice(0, cantidadVisible);
  const restantes = restoNoticias.length - visibles.length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0' }}>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff', borderBottom: '3px solid #a855f7', display: 'inline-block', paddingBottom: '8px', margin: '0 0 10px 0' }}>
          📰 Noticias Gaming y Lanzamientos
        </h1>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem' }}>
          Las últimas novedades, anuncios, tráilers y actualizaciones de los videojuegos más jugados y esperados.
        </p>
      </div>

      {/* FILTROS POR CATEGORÍA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '22px' }}>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategoriaFiltro(cat);
              setCantidadVisible(24);
            }}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #a855f7',
              backgroundColor: categoriaFiltro === cat ? '#a855f7' : 'transparent',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="🔍 Buscar noticias (Ej: GTA VI, Steam, PlayStation, Fable)..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setCantidadVisible(24);
        }}
        style={{
          width: '100%',
          padding: '15px 22px',
          fontSize: '1.05rem',
          backgroundColor: '#0b0d17',
          border: '2px solid #1f293d',
          borderRadius: '10px',
          color: '#fff',
          outline: 'none',
          marginBottom: '35px',
        }}
      />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#a855f7', fontSize: '1.2rem', padding: '50px' }}>
          Cargando últimas noticias...
        </p>
      ) : filtradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#0b0d17', borderRadius: '12px', border: '1px solid #1f293d' }}>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
            No se encontraron noticias con ese filtro en este momento.
          </p>
        </div>
      ) : (
        <>
          {/* NOTICIA PRINCIPAL DESTACADA */}
          {destacada && (
            <Link href={`/noticias/${destacada.slug}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                  backgroundColor: '#0b0d17',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid #a855f7',
                  marginBottom: '40px',
                  boxShadow: '0 12px 30px rgba(168, 85, 247, 0.18)',
                }}
              >
                <img
                  src={destacada.cover_image || FALLBACK_IMG}
                  alt={destacada.title}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                  style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                />
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#a855f7', color: '#fff', padding: '4px 10px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {destacada.category}
                    </span>
                    <span style={{ color: '#2dd4bf', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {destacada.source_name} • {formatearFechaNoticia(destacada.published_at)}
                    </span>
                  </div>
                  <h2 style={{ color: '#fff', fontSize: '1.75rem', margin: '0 0 14px 0', lineHeight: '1.25' }}>
                    {destacada.title}
                  </h2>
                  <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                    {destacada.summary}
                  </p>
                  <span style={{ color: '#2dd4bf', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    Leer noticia completa →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* CUADRÍCULA DE NOTICIAS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '25px' }}>
            {visibles.map((item) => (
              <Link href={`/noticias/${item.slug}`} key={item.id} style={{ textDecoration: 'none' }}>
                <article
                  style={{
                    backgroundColor: '#0b0d17',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #1f293d',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.25s, border-color 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = '#a855f7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#1f293d';
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={item.cover_image || FALLBACK_IMG}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                      style={{ width: '100%', height: '190px', objectFit: 'cover', display: 'block' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(11, 13, 23, 0.9)',
                        border: '1px solid #a855f7',
                        color: '#e9d5ff',
                        padding: '4px 10px',
                        borderRadius: '5px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
                      <strong style={{ color: '#2dd4bf' }}>{item.source_name}</strong> • {formatearFechaNoticia(item.published_at)}
                    </div>
                    <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '1.12rem', lineHeight: '1.35' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.55', margin: '0 0 18px 0', flexGrow: 1 }}>
                      {item.summary}
                    </p>
                    <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.88rem' }}>
                      Leer más →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {restantes > 0 && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => setCantidadVisible((prev) => prev + 24)}
                style={{
                  backgroundColor: '#16192b',
                  color: '#a855f7',
                  border: '2px solid #a855f7',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                Cargar más noticias ({restantes} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
