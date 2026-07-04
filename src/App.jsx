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
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [fechaHora, setFechaHora] = useState(new Date());
  const [moduloActivo, setModuloActivo] = useState('inicio');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [historialTrigger, setHistorialTrigger] = useState(0);
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);
  const [menuImpresionAbierto, setMenuImpresionAbierto] = useState(false);
  const [menuLateralAbierto, setMenuLateralAbierto] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const manejarLogin = (usuario) => {
    setUsuarioLogueado(usuario);
  };

  const manejarBuscarVehiculo = async (patente) => {
    try {
      const patenteMayuscula = patente.toUpperCase();
      const idAgente = usuarioLogueado?.id || usuarioLogueado?.usuario?.id || 1;
      
      const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/vehiculos/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dominio: patenteMayuscula,
          usuarioId: idAgente
        })
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        
        if (datos.encontrado === false) {
           alert('Vehículo no encontrado en la base de datos.');
           setVehiculoSeleccionado(null);
           return;
        }

        setVehiculoSeleccionado(datos);
        localStorage.setItem('vehiculoParaImprimir', JSON.stringify(datos));
        
        // ⚡ NUEVO: Si la consulta fue exitosa, sumamos 1 para forzar el refresco del historial
        setHistorialTrigger(prev => prev + 1);

      } else {
        alert('Error de conexión con el servidor.');
        setVehiculoSeleccionado(null);
      }
    } catch (error) {
      console.error("Error al buscar vehículo:", error);
    }
  };

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
                
                {/* Fondo oscuro que aparece cuando el menú está abierto */}
{menuLateralAbierto && (
  <div className="overlay-menu" onClick={() => setMenuLateralAbierto(false)}></div>
)}

{/* La barra lateral ahora usa la variable para agregar la clase 'abierta' */}
<aside className={`sidebar ${menuLateralAbierto ? 'abierta' : ''}`}>
  
  {/* Botón cruz para cerrar el menú en móviles */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <h2 style={{ color: '#fff', margin: 0 }}>S.C.I.P.</h2>
    <button className="btn-cerrar-menu" onClick={() => setMenuLateralAbierto(false)}>✖</button>
  </div>

  <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
    <p onClick={() => { setModuloActivo('inicio'); setMenuLateralAbierto(false); }} style={{ color: moduloActivo === 'inicio' ? '#3498db' : '#888', fontWeight: 'bold', cursor: 'pointer' }}>
      🏠 Panel Principal
    </p>
    <p onClick={() => { setModuloActivo('vehiculos'); setMenuLateralAbierto(false); }} style={{ color: moduloActivo === 'vehiculos' ? '#3498db' : '#888', fontWeight: 'bold', cursor: 'pointer' }}>
      🚗 Consulta Vehículos
    </p>
    <p onClick={() => { setModuloActivo('personas'); setMenuLateralAbierto(false); }} style={{ color: moduloActivo === 'personas' ? '#3498db' : '#888', fontWeight: 'bold', cursor: 'pointer' }}>
      👤 Consulta Personas
    </p>
    
    {/* Menú desplegable de impresiones */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p onClick={() => setMenuImpresionAbierto(!menuImpresionAbierto)} style={{ color: '#888', fontWeight: 'bold', cursor: 'pointer' }}>
        🖨️ Impresión Tarjeta <span style={{ float: 'right', fontSize: '10px', marginTop: '4px' }}>{menuImpresionAbierto ? '▲' : '▼'}</span>
      </p>
      
      {menuImpresionAbierto && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '15px', marginTop: '5px' }}>
          <button onClick={() => window.open('/imprimir', '_blank')} className="btn-sidebar-print">
            📄 Imprimir Cédula
          </button>
          <button onClick={() => window.open('/imprimir-todas', '_blank')} className="btn-sidebar-print">
            📑 Imprimir Registro
          </button>
        </div>
      )}
    </div>

    <p style={{ color: '#888', cursor: 'not-allowed' }}>📁 ABM Novedades</p>
    <p style={{ color: '#888', cursor: 'not-allowed' }}>📊 Auditoría</p>
  </nav>
</aside>

                <div className="contenedor-derecho">
                <header className="cabecera-superior">
  
  {/* 1. Espacio izquierdo (para balancear el diseño) */}
  <div className="cabecera-espaciador"></div>

  {/* 2. Título Central Absoluto */}
  <div className="cabecera-centro">
    <h2 className="titulo-operativo">Panel de Control Operativo</h2>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    <button className="btn-hamburguesa" onClick={() => setMenuLateralAbierto(true)}>
      ☰
    </button>
    <h2 className="titulo-operativo">Panel de Control Operativo</h2>
  </div>

  
  {/* 3. Lado Derecho: Perfil + Reloj (Orden Invertido) */}
  <div className="cabecera-derecha">
    
    {/* Perfil del Agente (AHORA VA PRIMERO) */}
    <div className="perfil-agente" onClick={() => setMenuPerfilAbierto(!menuPerfilAbierto)}>
      <div className="perfil-agente-contenido">
        <div className="avatar-circulo">👤</div>
        <div className="info-agente">
          <span className="rol-agente">AGENTE</span>
          <span className="nombre-agente">
            {/* Buscamos en las dos posibles rutas y si falla todo, ponemos 'Operador' */}
            {usuarioLogueado?.usuario?.nombre_completo || usuarioLogueado?.nombre_completo || 'Operador'} ▼
          </span>
        </div>
      </div>

      {/* Menú Desplegable */}
      {menuPerfilAbierto && (
        <div className="menu-desplegable">
          <button className="btn-cerrar-sesion" onClick={() => setUsuarioLogueado(null)}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>

    {/* Contenedor de Fecha y Hora (AHORA VA AL FINAL, PEGADO AL BORDE DERECHO) */}
    <div className="contenedor-reloj">
      <div className="fecha-sistema">
        {fechaHora.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      <div className="hora-sistema">
        {fechaHora.toLocaleTimeString('es-AR')}
      </div>
    </div>

  </div>
</header>
<p onClick={() => setModuloActivo('inicio')} style={{ color: moduloActivo === 'inicio' ? '#3498db' : '#888', fontWeight: 'bold', cursor: 'pointer' }}>
    🏠 Panel Principal
  </p>

                  {moduloActivo === 'vehiculos' && (
                    <div className="modulo-vehiculos" style={{ marginTop: '20px' }}>
                      <SearchPanel onBuscar={manejarBuscarVehiculo} />
                      
                      {vehiculoSeleccionado && (
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                          <div style={{ 
                            border: vehiculoSeleccionado.estado === 'rojo' ? '2px solid #e74c3c' : '2px solid #2ecc71',
                            padding: '20px', 
                            borderRadius: '10px', 
                            backgroundColor: '#1a252f',
                            color: 'white',
                            width: '100%',
                            maxWidth: '350px',
                            textAlign: 'center',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                          }}>
                             <h2 style={{ color: vehiculoSeleccionado.estado === 'rojo' ? '#e74c3c' : '#2ecc71', marginBottom: '5px' }}>
                               {vehiculoSeleccionado.estado === 'rojo' ? `❌ ${vehiculoSeleccionado.titulo}` : '✅ SIN IMPEDIMENTOS'}
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
              
                          </div>
                        </div>
                      )}
                      
                      {/* ⚡ CAMBIO ACÁ: Le agregamos la key vinculada al trigger para obligarla a actualizarse */}
                      <HistoryTable key={historialTrigger} />
                    </div>
                  )}

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