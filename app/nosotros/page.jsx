export const metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce cómo funciona RadarJuegos, nuestras fuentes de datos oficiales y nuestra misión para ayudar a los jugadores a ahorrar.',
};

export default function Nosotros() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '50px 20px', color: '#e2e8f0', lineHeight: '1.8' }}>
      <h1 style={{ fontSize: '2.4rem', color: '#fff', borderBottom: '3px solid #a855f7', display: 'inline-block', paddingBottom: '8px', marginBottom: '25px' }}>
        Sobre RadarJuegos
      </h1>

      <div style={{ backgroundColor: '#0b0d17', padding: '30px', borderRadius: '12px', border: '1px solid #1f293d', marginBottom: '30px' }}>
        <h2 style={{ color: '#2dd4bf', marginTop: 0, fontSize: '1.4rem' }}>Nuestra Misión</h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>
          <strong>RadarJuegos</strong> nació con un objetivo claro: reunir en un solo lugar las mejores ofertas de videojuegos digitales, los juegos gratuitos por tiempo limitado y las fechas oficiales de los lanzamientos más esperados, evitando que los jugadores pierdan tiempo revisando decenas de tiendas por separado.
        </p>

        <h2 style={{ color: '#2dd4bf', marginTop: '30px', fontSize: '1.4rem' }}>¿Cómo obtenemos y verificamos los datos?</h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>
          Nuestro sistema automatizado actualiza el catálogo cada hora consultando bases de datos oficiales de la industria y distribuidores autorizados:
        </p>
        <ul style={{ color: '#cbd5e1', fontSize: '1.02rem', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Información técnica y lanzamientos:</strong> Sincronizamos fichas, estudios desarrolladores, motores gráficos, tráilers oficiales y fechas de estreno desde <strong>IGDB</strong> y <strong>Steam</strong>.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Comparación de precios:</strong> Rastreamos descuentos activos únicamente en tiendas digitales oficiales y autorizadas (como Steam, Epic Games Store, GOG, Humble Store, GreenManGaming y Fanatical) a través de <strong>CheapShark</strong>.
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Juegos gratuitos y Free-to-Play:</strong> Monitoreamos promociones semanales oficiales de Epic Games Store, sorteos verificados de GamerPower y títulos gratuitos permanentes.
          </li>
        </ul>

        <h2 style={{ color: '#2dd4bf', marginTop: '30px', fontSize: '1.4rem' }}>Transparencia Editorial</h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: 0 }}>
          RadarJuegos no vende claves directamente ni almacena datos bancarios de los usuarios. Todos los enlaces de compra o reclamo redirigen a las tiendas oficiales correspondientes. El mantenimiento del servidor y el desarrollo continuo del portal se financian mediante publicidad respetuosa (Google AdSense) y enlaces de afiliados autorizados, sin ningún costo adicional para el usuario.
        </p>
      </div>
    </div>
  );
}
