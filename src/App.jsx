import { useState, useEffect } from 'react';
import SearchPanel from './components/SearchPanel';
import HistoryTable from './components/HistoryTable';
import Login from './components/Login';
import QRCode from 'react-qr-code';
import CedulaPrint from './components/CedulaPrint';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {
  // Estado de Autenticación: Guardará el objeto del usuario que devuelva la base de datos
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Estado del Reloj en Tiempo Real
  const [fechaHora, setFechaHora] = useState(new Date());

  // Estado del Vehículo Activo en Pantalla (Inicia con un estado de espera)
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState({
    estado: "gris",
    titulo: "ESPERANDO CONSULTA",
    marca: "-",
    modelo: "-",
    anio: "-",
    tipo: "-",
    color: "-",
    titular_nombre: "-",
    titular_dni: "-",
    domicilio: "-",
    numero_chasis: "-",
    numero_motor: "-",
    icono: "🔍"
});
  // Estado para controlar si el menú del perfil está abierto o cerrado
  const [menuPerfilAbierto, setMenuPerfilAbierto] = useState(false);

  // Efecto para hacer correr el reloj segundo a segundo
  useEffect(() => {
    const temporizador = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(temporizador);
  }, []);

  // Formateadores de fecha y hora para la región de Argentina
  const fechaFormateada = fechaHora.toLocaleDateString('es-AR', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
  const horaFormateada = fechaHora.toLocaleTimeString('es-AR');

  // Lógica para realizar la búsqueda conectada al Backend
  const realizarBusqueda = async (patenteIngresada) => {
    try {
      const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/vehiculos/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dominio: patenteIngresada, 
          usuarioId: usuarioLogueado.id // Envía el ID del usuario logueado para la auditoría
        })
      });

      const datos = await respuesta.json();
      setVehiculoSeleccionado(datos);
    } catch (error) {
      console.error("Error al consultar el backend:", error);
    }
  };

  // Lógica para procesar el inicio de sesión con la Base de Datos
  const manejarLogin = async (datosCredenciales) => {
    try {
      const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCredenciales)
      });

      // Si el servidor responde con un error interno (ej: error de sintaxis SQL)
      if (!respuesta.ok) {
        const errorServidor = await respuesta.json();
        alert(`Error del servidor: ${errorServidor.mensaje}`);
        return;
      }

      const resultado = await respuesta.json();

      if (resultado.loginExitoso) {
        setUsuarioLogueado(resultado.usuario); 
      } else {
        alert(resultado.mensaje || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en la conexión con el servidor de login:", error);
      // Esta alerta saltará inmediatamente si el backend de Node.js está apagado
      alert("No se pudo establecer conexión con el servidor operativo. Verifica que el backend esté encendido en el puerto 5000.");
    }
  };

  // 2. Panel Principal con Sistema de Rutas
return (
  <Router>
    <Routes>
      {/* Ruta para la vista de impresión limpia */}
      <Route path="/imprimir" element={<CedulaPrint />} />

      {/* Ruta principal del Dashboard */}
      <Route 
        path="/" 
        element={
          !usuarioLogueado ? (
            <Login onLoginExitoso={manejarLogin} />
          ) : (
            <div className="layout-principal">
      {/* BARRA LATERAL IZQUIERDA */}
      <aside className="sidebar">
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>S.C.I.P.</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ color: '#3498db', fontWeight: 'bold', cursor: 'pointer' }}>🔹 Dashboard</p>
          <p style={{ color: '#888', cursor: 'not-allowed' }}>📁 ABM Novedades</p>
          <p style={{ color: '#888', cursor: 'not-allowed' }}>📊 Auditoría</p>
        </nav>
      </aside>

      {/* SECCIÓN DE CONTENIDO DERECHO */}
      <div className="contenedor-derecho">
        {/* CABECERA SUPERIOR */}
        {/* CABECERA SUPERIOR */}
        <header className="topbar">
          
          <div className="topbar-titulo">
            <p>Panel de Control Operativo</p>
          </div>

          <div className="topbar-info">
            
            {/* 1. INFORMACIÓN DEL PERFIL Y MENÚ DESPLEGABLE */}
            <div className="perfil-usuario-contenedor">
              <div 
                className="perfil-usuario" 
                onClick={() => setMenuPerfilAbierto(!menuPerfilAbierto)}
              >
                <div className="avatar-circulo">👤</div>
                <div className="datos-agente">
                  <span className="rol-agente">{usuarioLogueado.rol}</span>
                  <span className="nombre-agente">{usuarioLogueado.nombre_completo} ▼</span>
                </div>
              </div>

              {menuPerfilAbierto && (
                <div className="dropdown-perfil">
                  <div className="dropdown-item">⚙️ Configuración</div>
                  <div 
                    className="dropdown-item logout" 
                    onClick={() => setUsuarioLogueado(null)}
                  >
                    🚪 Cerrar Sesión
                  </div>
                </div>
              )}
            </div>

            {/* 2. RELOJ DIGITAL */}
            <div className="reloj-sistema">
              <span className="fecha-texto">{fechaFormateada}</span>
              <span className="hora-texto">{horaFormateada}</span>
            </div>

          </div>
          
        </header>

        {/* CONTENIDO DEL DASHBOARD */}
        <main className="dashboard-content">
          <div className="grid-dashboard">
            
            {/* Bloques de la izquierda: Buscador e Historial */}
            <div className="columna-izquierda">
              <SearchPanel onBuscar={realizarBusqueda} />
              <HistoryTable />
            </div>

            {/* Bloque de la derecha: Tarjeta del Estado del Vehículo */}
            <div className={`tarjeta-resultado estado-${vehiculoSeleccionado.estado}`}>
              <div className="icono-estado">{vehiculoSeleccionado.icono}</div>
              <h2>{vehiculoSeleccionado.titulo}</h2>
              {/* --- INICIO DE LA CÉDULA TIPO DNRPA --- */}
          <div className="contenedor-cedulas">
            {/* FRENTE DE LA CÉDULA */}
            <div className="cedula-fisica">
              <div className="cedula-fondo-agua">DNRPA</div>
              <div className="cedula-cabecera">
                <p className="republica">REPÚBLICA ARGENTINA</p>
                <p className="titulo-cedula">CÉDULA DE IDENTIFICACIÓN DE VEHÍCULOS</p>
              </div>
              <div className="cedula-contenido">
                <div className="cedula-datos">
                  <p><span>MARCA:</span> <strong>{vehiculoSeleccionado.marca}</strong></p>
                  <p><span>MODELO:</span> <strong>{vehiculoSeleccionado.modelo}</strong></p>
                  <p><span>TIPO:</span> <strong>{vehiculoSeleccionado.tipo}</strong></p>
                  <p><span>CHASIS:</span> <strong>{vehiculoSeleccionado.numero_chasis}</strong></p>
                  <p><span>MOTOR:</span> <strong>{vehiculoSeleccionado.numero_motor}</strong></p>
                </div>
                <div className="cedula-qr-contenedor">
                  {/* Generamos el QR en vivo solo si el sistema no está "esperando" */}
                  {vehiculoSeleccionado.marca !== "-" && (
                    <QRCode 
                      value={`DOMINIO: ${vehiculoSeleccionado.titulo === 'SIN REGISTRO EN SISTEMA' ? '-' : vehiculoSeleccionado.titulo}\nMARCA: ${vehiculoSeleccionado.marca}\nCHASIS: ${vehiculoSeleccionado.numero_chasis}\nMOTOR: ${vehiculoSeleccionado.numero_motor}\nTITULAR: ${vehiculoSeleccionado.titular_nombre}`} 
                      size={70} 
                      level="L"
                    />
                  )}
                </div>
              </div>
            </div>
            {/* DORSO DE LA CÉDULA */}
            <div className="cedula-fisica dorso">
              <div className="cedula-fondo-agua">DNRPA</div>
              <div className="cedula-cabecera">
                <p className="titulo-cedula" style={{textAlign: 'right'}}>IDENTIFICACIÓN DEL TITULAR</p>
              </div>
              <div className="cedula-datos">
                <p><span>TITULAR:</span> <strong>{vehiculoSeleccionado.titular_nombre}</strong></p>
                <p><span>D.N.I.:</span> <strong>{vehiculoSeleccionado.titular_dni}</strong></p>
                <p><span>DOMICILIO:</span> <strong>{vehiculoSeleccionado.domicilio}</strong></p>
              </div>
            </div>
          </div>
          {/* --- FIN DE LA CÉDULA TIPO DNRPA --- */}
          {/* Botón para imprimir la cédula física */}
          <button 
  className="btn-imprimir" 
  onClick={() => {
    // Guardamos los datos en la memoria temporal del navegador
    localStorage.setItem('vehiculoParaImprimir', JSON.stringify(vehiculoSeleccionado));
    // Abrimos una pestaña nueva
    window.open('/imprimir', '_blank');
  }}
>
  🖨️ GENERAR CÉDULA EN VENTANA NUEVA
</button>
            </div>

          </div>
        </main>
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