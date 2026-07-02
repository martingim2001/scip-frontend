import { useState } from 'react';

const ConsultaPersonas = () => {
  const [dni, setDni] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const buscarCiudadano = async (e) => {
    e.preventDefault();
    if (!dni.trim()) return;

    setCargando(true);
    setError('');
    setResultado(null);

    try {
      // Reemplaza con tu URL de Render cuando lo subas
      const respuesta = await fetch(`https://scip-backend-yktr.onrender.com/api/personas/${dni}`);
      
      if (!respuesta.ok) {
        const datosError = await respuesta.json();
        throw new Error(datosError.mensaje || 'Error en la búsqueda');
      }

      const datos = await respuesta.json();
      setResultado(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="panel-busqueda">
      <h3>CONSULTA DE IDENTIDAD (DNI)</h3>
      
      <form onSubmit={buscarCiudadano} className="caja-buscador">
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Ingrese DNI del ciudadano..."
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Buscando...' : 'Verificar'}
        </button>
      </form>

      {error && <p className="mensaje-error-alerta">{error}</p>}

      {resultado && (
        <div className={`tarjeta-resultado-persona ${resultado.pedido_captura ? 'alerta-captura' : 'estado-limpio'}`}>
          <div className="cabecera-resultado">
            <h4>{resultado.apellido}, {resultado.nombre}</h4>
            <p><strong>DNI:</strong> {resultado.dni}</p>
          </div>
          
          <div className="cuerpo-resultado">
            {resultado.pedido_captura ? (
              <div className="bloque-peligro">
                <span className="alerta-icono">🚨</span>
                <div>
                  <h5>PEDIDO DE CAPTURA ACTIVO</h5>
                  <p><strong>Motivo:</strong> {resultado.motivo_captura || 'No especificado'}</p>
                  <p className="instruccion-policial">Proceder con el protocolo de detención preventiva.</p>
                </div>
              </div>
            ) : (
              <div className="bloque-seguro">
                <span className="seguro-icono">✅</span>
                <div>
                  <h5>SIN NOVEDAD / ESTADO SIN SOLICITUD</h5>
                  <p>El ciudadano no posee impedimentos legales vigentes en el sistema.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaPersonas;