import { useState, useEffect } from 'react';

const ListadoPersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Función que busca a todos en la base de datos
    const obtenerPersonas = async () => {
      try {
        // Usamos tu misma URL del backend, pero sin pasarle un DNI específico
        const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/personas');
        const datos = await respuesta.json();
        setPersonas(datos);
      } catch (error) {
        console.error("Error al cargar personas:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPersonas();
  }, []);

  return (
    <div className="panel-listado">
      <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
        📋 LISTADO GENERAL DE PERSONAS
      </h3>

      {/* Acá le damos uso a la variable 'cargando' */}
      {cargando ? (
        <p style={{ color: 'white', textAlign: 'center', marginTop: '30px' }}>
          ⏳ Cargando datos del servidor policial...
        </p>
      ) : (
        <div className="tabla-contenedor-scroll">
          <table className="tabla-scip">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Apellido y Nombre</th>
                <th>Estado</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {personas.map(persona => (
                <tr key={persona.dni}>
                  <td>{persona.dni}</td>
                  <td>{persona.apellido}, {persona.nombre}</td>
                  <td>
                    {persona.pedido_captura === 1 || persona.pedido_captura === true || persona.estado === 'CAPTURA' ? (
                      <span className="badge-rojo">CAPTURA</span>
                    ) : (
                      <span className="badge-verde">LIMPIO</span>
                    )}
                  </td>
                  <td>{persona.motivo_captura || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListadoPersonas;