'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header
      style={{
        background: 'linear-gradient(90deg, #0b0d17 0%, #1a1025 50%, #0b0d17 100%)',
        borderBottom: '2px solid #a855f7',
        boxShadow: '0 4px 20px rgba(168, 85, 247, 0.2)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <style>{`
        .rj-nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rj-nav-links {
          display: flex;
          gap: 26px;
          align-items: center;
        }
        .rj-menu-btn {
          display: none;
          background: transparent;
          border: 1px solid #a855f7;
          color: #fff;
          font-size: 1.4rem;
          padding: 4px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .rj-menu-btn {
            display: block;
          }
          .rj-nav-links {
            display: ${menuAbierto ? 'flex' : 'none'};
            flex-direction: column;
            width: 100%;
            padding-top: 18px;
            margin-top: 14px;
            border-top: 1px solid #1f293d;
            gap: 16px;
          }
          .rj-nav-container {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="rj-nav-container">
        <Link
          href="/"
          onClick={() => setMenuAbierto(false)}
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1.9rem',
            fontWeight: '900',
            fontStyle: 'italic',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
          }}
        >
          RADAR<span style={{ color: '#a855f7' }}>JUEGOS</span>
        </Link>

        <button
          className="rj-menu-btn"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú de navegación"
        >
          {menuAbierto ? '✕' : '☰'}
        </button>

        <nav className="rj-nav-links">
          <Link href="/" onClick={() => setMenuAbierto(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Inicio
          </Link>
          <Link href="/noticias" onClick={() => setMenuAbierto(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Noticias
          </Link>
          <Link href="/proximos" onClick={() => setMenuAbierto(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Próximos
          </Link>
          <Link href="/ofertas" onClick={() => setMenuAbierto(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Ofertas
          </Link>
          <Link href="/gratuitos" onClick={() => setMenuAbierto(false)} style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Gratuitos
          </Link>
        </nav>
      </div>
    </header>
  );
}
