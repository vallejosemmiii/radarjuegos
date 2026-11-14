import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iqndiyuhcjxrugzfyjaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM',
  { auth: { persistSession: false } }
);

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: game } = await supabase
    .from('games')
    .select('title, summary, cover_image')
    .ilike('slug', slug)
    .single();

  if (!game) {
    return {
      title: 'Juego no encontrado | RadarJuegos',
    };
  }

  return {
    title: `${game.title} - Precios, Tráiler y Lanzamiento | RadarJuegos`,
    description: game.summary ? game.summary.slice(0, 160) : `Descubre el mejor precio, fecha de lanzamiento y tráiler oficial de ${game.title}.`,
    openGraph: {
      title: `${game.title} | RadarJuegos`,
      description: game.summary ? game.summary.slice(0, 160) : `Compara precios y mira el tráiler de ${game.title}.`,
      images: game.cover_image ? [{ url: game.cover_image }] : [],
    },
  };
}

export default function JuegoLayout({ children }) {
  return <>{children}</>;
}
