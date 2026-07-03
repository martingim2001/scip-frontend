import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPanel from './components/SearchPanel';
import HistoryTable from './components/HistoryTable';
import Login from './components/Login';
import CedulaPrint from './components/CedulaPrint';
import ImprimirTodas from './components/ImprimirTodas';
import ConsultaPersonas from './components/ConsultaPersonas';
import './App.css';

function App() {
  // --- 1. ESTADOS DE LA APLICACIÓN ---
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [fechaHora, setFechaHora] = useState(new Date());
  const [moduloActivo, setModuloActivo] = useState('vehiculos'); 
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  // --- 2. RELOJ EN TIEMPO REAL ---
  useEffect(() => {
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 3. FUNCIONES DE LÓGICA ---
  const manejarLogin = (usuario) => {
    setUsuarioLogueado(usuario);
  };

  const manejarBuscarVehiculo = async (patente) => {
    try {
      const patenteMayuscula = patente.toUpperCase();
      
      // Hacemos un POST a /consulta enviando la patente y el ID del agente
      const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/vehiculos/consulta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dominio: patenteMayuscula,
          usuarioId: usuarioLogueado ? usuarioLogueado.id : 1 // Mandamos el ID para tu auditoría
        })
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        
        // Como tu backend devuelve "encontrado: false" si no existe, lo atajamos acá:
        if (datos.encontrado === false) {
           alert('Vehículo no encontrado en la base de datos.');
           setVehiculoSeleccionado(null);
           return;
        }

        setVehiculoSeleccionado(datos);
        localStorage.setItem('vehiculoParaImprimir', JSON.stringify(datos));
      } else {
        alert('Error de conexión con el servidor.');
        setVehiculoSeleccionado(null);
      }
    } catch (error) {
      console.error("Error al buscar vehículo:", error);
    }
  };

  // --- 4. RENDERIZADO VISUAL ---
  return (
    <Router>
      <Routes>
        <Route path="/imprimir" element={<CedulaPrint />} />
        <Route path="/imprimir-todas" element={<ImprimirTodas />} />

        <Route 
          path="/" 
          element={
            !usuarioLogueado ? (
              <Login onLoginExitoso={manejarLogin} />
            ) : (
              <div className="layout-principal">
                
                {/* --- BARRA LATERAL --- */}
                <aside className="sidebar">
                  <h2 style={{ color: '#fff', marginBottom: '20px' }}>S.C.I.P.</h2>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p 
                      onClick={() => setModuloActivo('vehiculos')}
                      style={{ color: moduloActivo === 'vehiculos' ? '#3498db' : '#888', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      🚗 Consulta Vehículos
                    </p>
                    <p 
                      onClick={() => setModuloActivo('personas')}
                      style={{ color: moduloActivo === 'personas' ? '#3498db' : '#888', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      👤 Consulta Personas
                    </p>
                    <p style={{ color: '#888', cursor: 'not-allowed' }}>📁 ABM Novedades</p>
                    <p style={{ color: '#888', cursor: 'not-allowed' }}>📊 Auditoría</p>
                  </nav>
                </aside>

                {/* --- CONTENIDO CENTRAL --- */}
                <div className="contenedor-derecho">
                  
                  <header className="cabecera-superior" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #34495e', color: 'white' }}>
                    <span>{fechaHora.toLocaleTimeString()}</span>
                    <span>Agente: <strong>{usuarioLogueado.nombre_completo || 'Martín Giménez'}</strong></span>
                  </header>

                  {/* PANTALLA: VEHÍCULOS */}
                  {moduloActivo === 'vehiculos' && (
                    <div className="modulo-vehiculos" style={{ marginTop: '20px' }}>
                      <SearchPanel onBuscar={manejarBuscarVehiculo} />
                      
                      {/* TARJETA VISUAL DEL VEHÍCULO RECUPERADA */}
                      {vehiculoSeleccionado && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                          <div style={{ 
                            border: vehiculoSeleccionado.estado === 'Robado' ? '2px solid #e74c3c' : '2px solid #2ecc71',
                            padding: '20px', 
                            borderRadius: '10px', 
                            backgroundColor: '#1a252f',
                            color: 'white',
                            width: '100%',
                            maxWidth: '350px',
                            textAlign: 'center',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                          }}>
                             <h2 style={{ color: vehiculoSeleccionado.estado === 'Robado' ? '#e74c3c' : '#2ecc71', marginBottom: '5px' }}>
                               {vehiculoSeleccionado.estado === 'Robado' ? '❌ SECUESTRO ACTIVO' : '✅ SIN IMPEDIMENTOS'}
                             </h2>
                             <p style={{ fontSize: '11px', color: '#bdc3c7', marginBottom: '15px' }}>
                               DNRPA - CÉDULA DE IDENTIFICACIÓN
                             </p>
                             
                             <div style={{ textAlign: 'left', lineHeight: '1.6', fontSize: '14px', borderTop: '1px solid #34495e', borderBottom: '1px solid #34495e', padding: '15px 0' }}>
                               <p><strong>DOMINIO:</strong> {vehiculoSeleccionado.dominio}</p>
                               <p><strong>MARCA:</strong> {vehiculoSeleccionado.marca}</p>
                               <p><strong>MODELO:</strong> {vehiculoSeleccionado.modelo}</p>
                               <p><strong>TIPO:</strong> {vehiculoSeleccionado.tipo}</p>
                               <p><strong>CHASIS:</strong> {vehiculoSeleccionado.numero_chasis || vehiculoSeleccionado.chasis}</p>
                               <p><strong>MOTOR:</strong> {vehiculoSeleccionado.numero_motor || vehiculoSeleccionado.motor}</p>
                               <p><strong>TITULAR:</strong> {vehiculoSeleccionado.titular_nombre}</p>
                             </div>
              
                             <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button onClick={() => window.open('/imprimir', '_blank')} style={{ padding: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                  🖨️ IMPRIMIR CÉDULA
                                </button>
                                <button onClick={() => window.open('/imprimir-todas', '_blank')} style={{ padding: '10px', backgroundColor: '#006064', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                                  🖨️ IMPRIMIR REGISTRO
                                </button>
                             </div>
                          </div>
                        </div>
                      )}
                      
                      <HistoryTable />
                    </div>
                  )}

                  {/* PANTALLA: PERSONAS */}
                  {moduloActivo === 'personas' && (
                    <div className="modulo-personas" style={{ marginTop: '20px' }}>
                      <ConsultaPersonas />
                    </div>
                  )}

                </div>
              </div>
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;