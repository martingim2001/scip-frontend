import { useState, useEffect } from 'react';

const HistoryTable = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/historial');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setHistorial(datos);
        }
      } catch (error) {
        console.error("Error cargando historial:", error);
      }
    };

    cargarHistorial();
  }, []); // Se ejecuta al cargar, o cuando App.jsx fuerza el cambio con la 'key'

  return (
    <div className="historial-container" style={{ marginTop: '40px' }}>
      <h3 style={{ color: 'white', borderBottom: '1px solid #34495e', paddingBottom: '10px', textAlign: 'center' }}>
        Historial de Consultas de Dependencia
      </h3>
      
      <table style={{ width: '100%', color: 'white', marginTop: '15px', textAlign: 'center', borderCollapse: 'collapse', fontSize: '14px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #34495e' }}>
            <th style={{ padding: '10px' }}>Fecha/Hora</th>
            <th style={{ padding: '10px' }}>Dominio</th>
            <th style={{ padding: '10px' }}>Estado</th>
            <th style={{ padding: '10px' }}>Operador</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((item) => {
            // Formatear la hora para que quede prolija (ej: 16:06)
            const fecha = new Date(item.fecha_hora);
            const horaFormateada = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute:'2-digit' });
            
            // Si el estado dice SECUESTRO o ROBO, lo pintamos de rojo. Si no, verde.
            const esPeligro = item.estado_resultado.includes('ROBO') || item.estado_resultado.includes('SECUESTRO');

            return (
              <tr key={item.id} style={{ borderBottom: '1px solid #2c3e50' }}>
                <td style={{ padding: '12px' }}>{horaFormateada}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.dominio_consultado}</td>
                <td style={{ padding: '12px', color: esPeligro ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }}>
                  {item.estado_resultado}
                </td>
                <td style={{ padding: '12px' }}>{item.operador}</td>
              </tr>
            );
          })}
          
          {historial.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding: '20px', color: '#888' }}>Cargando consultas...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;