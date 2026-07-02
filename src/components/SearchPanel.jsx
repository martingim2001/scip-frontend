import { useState } from 'react';
import EscanerQR from './EscanerQR';

const SearchPanel = ({ onBuscar }) => {
  // 1. Estados de la memoria
  const [busqueda, setBusqueda] = useState('');
  const [mostrarCamara, setMostrarCamara] = useState(false);

  // 2. Función para la búsqueda manual (botón buscar)
  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (busqueda.trim() !== '') {
      onBuscar(busqueda.toUpperCase());
    }
  };

  // 3. Función para cuando el escáner lee un QR con éxito
  const procesarQR = (textoQR) => {
    // Extraemos la patente del texto del QR 
    const coincidencia = textoQR.match(/DOMINIO:\s*([A-Z0-9]+)/i);
    
    if (coincidencia && coincidencia[1]) {
      const patenteExtraida = coincidencia[1];
      setBusqueda(patenteExtraida); // Llenamos la barra de búsqueda
      setMostrarCamara(false); // Ocultamos la cámara
      onBuscar(patenteExtraida.toUpperCase()); // Buscamos automáticamente en la BD
    } else {
      alert("No se pudo leer la patente del QR. Intente de nuevo.");
    }
  };

  return (
    <div className="panel-busqueda">
      <h3>CONSULTA DE DOMINIO</h3>
      
      {/* --- BARRA DE BÚSQUEDA --- */}
      <form onSubmit={manejarBusqueda} className="caja-buscador">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar patente o DNI..."
        />
        <button type="submit">Buscar</button>
        
        {/* Botón para abrir la cámara */}
        <button 
          type="button" 
          className="btn-camara" 
          onClick={() => setMostrarCamara(!mostrarCamara)}
        >
          📷 Escanear QR
        </button>
      </form>

      {/* --- MODAL DE LA CÁMARA (Solo se ve si se hizo clic en Escanear) --- */}
      {mostrarCamara && (
        <div className="modal-camara" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#2c3e50', borderRadius: '8px' }}>
          <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '10px' }}>Apunta al QR de la cédula</h3>
          
          <EscanerQR onEscaneoExitoso={procesarQR} />
          
          <button 
            onClick={() => setMostrarCamara(false)} 
            style={{ display: 'block', margin: '15px auto 0', padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            ❌ Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;