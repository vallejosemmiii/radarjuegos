import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient('https://iqndiyuhcjxrugzfyjaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM', { auth: { persistSession: false } });

export const revalidate = 0; // Garantiza que los precios estén siempre actualizados

export default async function Catalogo() {
  const { data: games } = await supabase.from('games').select('*, game_prices(*)').order('id', { ascending: true });

  return (
    <div className="games-grid">
      {games?.map(game => {
        const precios = game.game_prices || [];
        let mejorPrecio = 'Sin Stock';
        if (precios.length > 0) {
          precios.sort((a, b) => Number(a.price) - Number(b.price));
          mejorPrecio = `$${Number(precios[0].price).toFixed(2)}`;
        }
        const anio = game.release_date ? game.release_date.split('-')[0] : 'TBA';

        return (
          <Link href={`/juego/${game.id}`} key={game.id} style={{ textDecoration: 'none' }}>
            <div className="game-card">
              <img src={game.cover_image} alt={game.title} />
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
      })}
    </div>
  );
}
