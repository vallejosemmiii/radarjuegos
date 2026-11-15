import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import ShareButtons from '../../components/ShareButtons';
import SafeImage from '../../components/SafeImage';

export const revalidate = 3600;

const supabase = createClient(
  'https://iqndiyuhcjxrugzfyjaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM',
  { auth: { persistSession: false } }
);

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80';

const formatearFechaLarga = (isoString) => {
  if (!isoString) return 'Publicado recientemente';
  return new Date(isoString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: noticia } = await supabase
    .from('noticias')
    .select('title, summary, cover_image')
    .eq('slug', slug)
    .single();

  if (!noticia) {
    return { title: 'Noticia no encontrada' };
  }

  return {
    title: noticia.title,
    description: noticia.summary || noticia.title,
    openGraph: {
      title: noticia.title,
      description: noticia.summary || noticia.title,
      url: `https://radarjuegos.lat/noticias/${slug}`,
      images: [noticia.cover_image || FALLBACK_IMG],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: noticia.title,
      description: noticia.summary || noticia.title,
      images: [noticia.cover_image || FALLBACK_IMG],
    },
  };
}

export default async function DetalleNoticia({ params }) {
  const { slug } = await params;

  const { data: noticia } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!noticia) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Noticia no encontrada</h2>
        <Link href="/noticias" style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver a Noticias
        </Link>
      </div>
    );
  }

  const { data: relacionadas } = await supabase
    .from('noticias')
    .select('id, title, slug, cover_image, source_name, published_at')
    .neq('id', noticia.id)
    .order('published_at', { ascending: false })
    .limit(3);

  const urlCompleta = `https://radarjuegos.lat/noticias/${noticia.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.title,
    description: noticia.summary || noticia.title,
    image: [noticia.cover_image || FALLBACK_IMG],
    datePublished: noticia.published_at || noticia.created_at,
    dateModified: noticia.published_at || noticia.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': urlCompleta,
    },
    author: {
      '@type': 'Organization',
      name: noticia.source_name || 'RadarJuegos',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RadarJuegos',
      logo: {
        '@type': 'ImageObject',
        url: 'https://radarjuegos.lat/icon.svg',
      },
    },
  };

  return (
    <article style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', color: '#e2e8f0' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ marginBottom: '25px' }}>
        <Link href="/noticias" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem' }}>
          ← Volver a todas las noticias
        </Link>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ backgroundColor: '#a855f7', color: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {noticia.category}
        </span>
        <span style={{ color: '#2dd4bf', fontWeight: 'bold', fontSize: '0.92rem' }}>
          Fuente: {noticia.source_name}
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          • {formatearFechaLarga(noticia.published_at)}
        </span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', color: '#fff', lineHeight: '1.2', margin: '0 0 25px 0' }}>
        {noticia.title}
      </h1>

      <SafeImage
        src={noticia.cover_image || FALLBACK_IMG}
        alt={noticia.title}
        style={{
          width: '100%',
          maxHeight: '460px',
          objectFit: 'cover',
          borderRadius: '14px',
          border: '1px solid #1f293d',
          marginBottom: '30px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
        }}
      />

      <div
        style={{
          backgroundColor: '#0b0d17',
          padding: '32px',
          borderRadius: '14px',
          border: '1px solid #1f293d',
          lineHeight: '1.85',
          fontSize: '1.08rem',
          color: '#cbd5e1',
          marginBottom: '30px',
          whiteSpace: 'pre-line',
        }}
      >
        {noticia.content || noticia.summary}

        {noticia.source_url && (
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #1f293d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Cobertura original publicada por <strong>{noticia.source_name}</strong>.
            </span>
            <a
              href={noticia.source_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#2dd4bf',
                color: '#0f111a',
                padding: '10px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.92rem',
              }}
            >
              Leer artículo completo en {noticia.source_name} ↗
            </a>
          </div>
        )}
      </div>

      {/* COMPARTIR ARTÍCULO */}
      <div style={{ marginBottom: '50px', maxWidth: '420px' }}>
        <p style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>
          Compartir noticia:
        </p>
        <ShareButtons url={urlCompleta} texto={noticia.title} />
      </div>

      {/* NOTICIAS RELACIONADAS */}
      {relacionadas && relacionadas.length > 0 && (
        <section>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', borderBottom: '2px solid #a855f7', display: 'inline-block', paddingBottom: '6px', marginBottom: '20px' }}>
            Más noticias recientes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {relacionadas.map((rel) => (
              <Link href={`/noticias/${rel.slug}`} key={rel.id} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: '#0b0d17', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1f293d', height: '100%' }}>
                  <SafeImage
                    src={rel.cover_image || FALLBACK_IMG}
                    alt={rel.title}
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '15px' }}>
                    <span style={{ color: '#2dd4bf', fontSize: '0.78rem', fontWeight: 'bold' }}>{rel.source_name}</span>
                    <h3 style={{ color: '#fff', fontSize: '1rem', margin: '6px 0 0 0', lineHeight: '1.35' }}>{rel.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
