export const metadata = {
  title: 'Contacto | RadarJuegos',
};

export default function Contacto() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', color: '#cbd5e1', lineHeight: '1.8', textAlign: 'center', minHeight: '60vh' }}>
      <h1 style={{ color: '#fff', borderBottom: '2px solid #2dd4bf', paddingBottom: '10px', display: 'inline-block' }}>Contacto</h1>
      
      <h3 style={{ color: '#a855f7', marginTop: '40px', fontSize: '1.5rem' }}>¿Tienes alguna duda o sugerencia?</h3>
      <p style={{ fontSize: '1.1rem', marginTop: '20px' }}>
        Si quieres reportar un error, sugerir un videojuego para nuestra base de datos, o realizar una consulta comercial sobre RadarJuegos, puedes escribirnos directamente a nuestro correo electrónico:
      </p>
      
      <div style={{ margin: '40px auto', backgroundColor: '#16192b', padding: '20px', borderRadius: '12px', border: '1px solid #1f293d', display: 'inline-block' }}>
        <a href="mailto:Vallejosemmiii@gmail.com" style={{ color: '#2dd4bf', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
          Vallejosemmiii@gmail.com
        </a>
      </div>
      
      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Intentamos responder a todas las consultas en un plazo de 24 a 48 horas hábiles.</p>
    </div>
  );
}
