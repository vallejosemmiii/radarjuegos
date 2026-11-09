export const metadata = {
  title: 'Términos y Condiciones | RadarJuegos',
};

export default function Terminos() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#cbd5e1', lineHeight: '1.8' }}>
      <h1 style={{ color: '#fff', borderBottom: '2px solid #2dd4bf', paddingBottom: '10px' }}>Términos de Uso</h1>
      
      <h3 style={{ color: '#a855f7', marginTop: '30px' }}>1. Propósito del Sitio</h3>
      <p>RadarJuegos es un portal informativo y agregador de ofertas. No vendemos videojuegos directamente ni procesamos pagos. Toda transacción financiera ocurre en las plataformas de terceros (Steam, Epic Games, PlayStation, Xbox, etc.).</p>
      
      <h3 style={{ color: '#a855f7', marginTop: '30px' }}>2. Precisión de Precios</h3>
      <p>Los precios y la disponibilidad mostrados están sujetos a cambios sin previo aviso. Extraemos la información en tiempo real a través de APIs de terceros (CheapShark), pero no podemos garantizar que el precio final no haya variado al momento de procesar la compra en la tienda destino.</p>

      <h3 style={{ color: '#a855f7', marginTop: '30px' }}>3. Propiedad Intelectual</h3>
      <p>Las carátulas, tráilers y nombres de los videojuegos pertenecen a sus respectivos desarrolladores y distribuidores (obtenidos a través de la API de IGDB para fines informativos y periodísticos). El diseño, logo y código fuente de RadarJuegos son propiedad de la administración del sitio.</p>
    </div>
  );
}
