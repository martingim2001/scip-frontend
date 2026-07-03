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
      const respuesta = await fetch(`https://scip-backend-yktr.onrender.com/api/vehiculos/${patente}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setVehiculoSeleccionado(datos);
        localStorage.setItem('vehiculoParaImprimir', JSON.stringify(datos));
      } else {
        alert('Vehículo no encontrado');
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
        {/* RUTAS DE IMPRESIÓN (Ocultas del menú principal) */}
        <Route path="/imprimir" element={<CedulaPrint />} />
        <Route path="/imprimir-todas" element={<ImprimirTodas />} />

        {/* RUTA PRINCIPAL (La pantalla del sistema) */}
        <Route 
          path="/" 
          element={
            !usuarioLogueado ? (
              <Login onLoginExitoso={manejarLogin} />
            ) : (
              <div className="layout-principal">
                
                {/* --- BARRA LATERAL (SIDEBAR) --- */}
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
                  
                  {/* CABECERA (Reloj y Usuario) */}
                  <header className="cabecera-superior" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #34495e', color: 'white' }}>
                    <span>{fechaHora.toLocaleTimeString()}</span>
                    <span>Agente: <strong>{usuarioLogueado.nombre || 'Agente'}</strong></span>
                  </header>

                  {/* === PANTALLAS DINÁMICAS (Cambian según el menú) === */}
                  
                  {/* PANTALLA: VEHÍCULOS */}
                  {moduloActivo === 'vehiculos' && (
                    <div className="modulo-vehiculos" style={{ marginTop: '20px' }}>
                      <SearchPanel onBuscar={manejarBuscarVehiculo} />
                      
                      {vehiculoSeleccionado && (
                        <div className="resultado-consulta" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#2c3e50', borderRadius: '8px' }}>
                          <p style={{ color: '#fff' }}>Vehículo seleccionado listo para procesar.</p>
                          <div style={{ marginTop: '15px' }}>
                            <button className="btn-imprimir" onClick={() => window.open('/imprimir', '_blank')}>
                              🖨️ IMPRIMIR CÉDULA ACTUAL
                            </button>
                            <button 
                              className="btn-imprimir" 
                              style={{ marginLeft: '10px', backgroundColor: '#006064', color: 'white' }} 
                              onClick={() => window.open('/imprimir-todas', '_blank')}
                            >
                              🖨️ IMPRIMIR TODO EL REGISTRO
                            </button>
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