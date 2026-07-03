import { useState } from 'react';

function Login({ onLoginExitoso }) {
  // Estado para alternar entre Login y Registro
  const [esRegistro, setEsRegistro] = useState(false);
  const [credenciales, setCredenciales] = useState({ usuario: '', password: '' });

  const manejarCambio = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!credenciales.usuario.trim() || !credenciales.password.trim()) return;

    try {
      // Hacemos la consulta real a tu servidor en la nube
      const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credenciales)
      });

      const datos = await respuesta.json();

      if (respuesta.ok && datos.loginExitoso) {
        // ¡Acá está la magia! Le mandamos a App.jsx toda la información REAL de la base de datos
        onLoginExitoso(datos.usuario);
      } else {
        // Si puso mal la clave, le avisamos
        alert(datos.mensaje || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error al intentar conectar con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#fff' }}>S.C.I.P.</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px' }}>
          {esRegistro ? 'Crear nueva cuenta operativa' : 'Acceso al Sistema Operativo'}
        </p>

        <form onSubmit={enviarFormulario} className="login-form">
          <div className="input-group-login">
            <label>Usuario / N° de Placa</label>
            <input 
              type="text" 
              name="usuario"
              value={credenciales.usuario}
              onChange={manejarCambio}
              required 
            />
          </div>

          <div className="input-group-login">
            <label>Contraseña</label>
            <input 
              type="password" 
              name="password"
              value={credenciales.password}
              onChange={manejarCambio}
              required 
            />
          </div>

          <button type="submit" className="btn-login">
            {esRegistro ? 'REGISTRARSE' : 'INGRESAR'}
          </button>
        </form>

        <p className="toggle-registro" onClick={() => setEsRegistro(!esRegistro)}>
          {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Solicitar acceso'}
        </p>
      </div>
    </div>
  );
}

export default Login;