import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code'; // Importamos la librería del QR que ya tenés instalada

const ListadoVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Función para traer los vehículos de la base de datos
    const obtenerVehiculos = async () => {
      try {
        // Usamos la misma lógica que en Personas, pero apuntando a vehículos
        const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/vehiculos');
        const datos = await respuesta.json();
        setVehiculos(datos);
      } catch (error) {
        console.error("Error al cargar vehículos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerVehiculos();
  }, []);

  return (
    <div className="panel-listado">
      
      {/* --- CABECERA CON TÍTULO Y BOTÓN DE IMPRIMIR --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'white', margin: 0 }}>
          🚗 LISTADO GENERAL DE VEHÍCULOS
        </h3>
        
        {/* Este botón hace el trabajo que antes hacía el menú lateral */}
        <button 
          onClick={() => window.open('/imprimir-todas', '_blank')}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
          }}
        >
          🖨️ Imprimir Registros (QR)
        </button>
      </div>

      {/* --- TABLA DE DATOS --- */}
      {cargando ? (
        <p style={{ color: 'white', textAlign: 'center', marginTop: '30px' }}>
          ⏳ Cargando base de datos automotor...
        </p>
      ) : (
        <div className="tabla-contenedor-scroll">
          <table className="tabla-scip">
            <thead>
              <tr>
                <th>Dominio</th>
                <th>Marca y Modelo</th>
                <th>Titular</th>
                <th>Código QR</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 'bold', color: '#3498db', fontSize: '1.1em' }}>
                    {v.dominio}
                  </td>
                  <td>{v.marca} {v.modelo}</td>
                  <td>{v.titular_nombre} <br/> <span style={{fontSize: '0.8em', color: '#aaa'}}>DNI: {v.titular_dni}</span></td>
                  <td>
                    {/* Generamos el QR en miniatura dentro de la tabla */}
                    <div style={{ background: 'white', padding: '5px', display: 'inline-block', borderRadius: '5px' }}>
                      <QRCode 
                        value={`DOMINIO: ${v.dominio}\nMARCA: ${v.marca}\nCHASIS: ${v.numero_chasis}`} 
                        size={50} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListadoVehiculos;