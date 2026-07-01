import { useState, useEffect } from 'react';
import SearchPanel from './components/SearchPanel';
import HistoryTable from './components/HistoryTable';
import Login from './components/Login';
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
      const respuesta = await fetch('http://localhost:5000/api/vehiculos/consulta', {
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
      const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/vehiculos/consulta', {
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

  // 1. Control de Acceso: Si no hay un usuario autenticado, muestra la pantalla de Login
  if (!usuarioLogueado) {
    return <Login onLoginExitoso={manejarLogin} />;
  }

  // 2. Panel Principal (Dashboard) visible solo tras un inicio de sesión correcto
  return (
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
              <div className="datos-vehiculo">
                <p>Marca: <strong>{vehiculoSeleccionado.marca}</strong></p>
                <p>Modelo: <strong>{vehiculoSeleccionado.modelo}</strong></p>
                <p>Año: <strong>{vehiculoSeleccionado.anio}</strong></p>
                <p>Tipo: <strong>{vehiculoSeleccionado.tipo}</strong></p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default App;