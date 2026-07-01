import { useState } from 'react';

// Recibimos la función 'onBuscar' como una propiedad (prop)
function SearchPanel({ onBuscar }) {
  const [patente, setPatente] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (!patente.trim()) return; // Si está vacío, no hace nada
    
    // Ejecutamos la función del padre pasándole la patente en mayúsculas
    onBuscar(patente.toUpperCase());
  };

  return (
    <div className="panel-busqueda">
      <h3>CONSULTA DE DOMINIO</h3>
      <form onSubmit={manejarEnvio} className="input-group">
        <input 
          type="text" 
          placeholder="Ej: AB 123 CD" 
          value={patente}
          onChange={(e) => setPatente(e.target.value)}
        />
        <button type="submit">CONSULTAR</button>
      </form>
    </div>
  );
}

export default SearchPanel;