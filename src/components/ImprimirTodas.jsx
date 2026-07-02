import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

const ImprimirTodas = () => {
  const [vehiculos, setVehiculos] = useState([]);

  useEffect(() => {
    // Buscamos toda la base de datos al abrir la pestaña
    const fetchVehiculos = async () => {
      try {
        const respuesta = await fetch('https://scip-backend-yktr.onrender.com/api/vehiculos/todos');
        const datos = await respuesta.json();
        setVehiculos(datos);
        
        // Esperamos 1 segundo a que se dibujen los QR y lanzamos la impresión
        setTimeout(() => window.print(), 1000);
      } catch (error) {
        console.error("Error al cargar los vehículos:", error);
      }
    };
    fetchVehiculos();
  }, []);

  if (vehiculos.length === 0) return <h2 style={{padding: '20px'}}>Cargando Lote de Cédulas...</h2>;

  return (
    <div className="contenedor-impresion-masiva">
      {vehiculos.map((v) => (
        <div key={v.id} className="par-cedulas">
          {/* FRENTE */}
          <div className="cedula-fisica">
            <div className="cedula-fondo-agua">DNRPA</div>
            <div className="cedula-cabecera">
              <p className="republica">REPÚBLICA ARGENTINA</p>
              <p className="titulo-cedula">CÉDULA DE IDENTIFICACIÓN DE VEHÍCULOS</p>
            </div>
            <div className="cedula-contenido">
              <div className="cedula-datos">
                <p><span>MARCA:</span> <strong>{v.marca}</strong></p>
                <p><span>MODELO:</span> <strong>{v.modelo}</strong></p>
                <p><span>DOMINIO:</span> <strong>{v.dominio}</strong></p>
                <p><span>CHASIS:</span> <strong>{v.numero_chasis}</strong></p>
                <p><span>MOTOR:</span> <strong>{v.numero_motor}</strong></p>
              </div>
              <div className="cedula-qr-contenedor">
                <QRCode value={`DOMINIO: ${v.dominio}\nMARCA: ${v.marca}\nCHASIS: ${v.numero_chasis}`} size={60} />
              </div>
            </div>
          </div>
          
          {/* DORSO */}
          <div className="cedula-fisica dorso">
            <div className="cedula-fondo-agua">DNRPA</div>
            <div className="cedula-cabecera">
              <p className="titulo-cedula" style={{textAlign: 'right'}}>IDENTIFICACIÓN DEL TITULAR</p>
            </div>
            <div className="cedula-datos">
              <p><span>TITULAR:</span> <strong>{v.titular_nombre}</strong></p>
              <p><span>D.N.I.:</span> <strong>{v.titular_dni}</strong></p>
              <p><span>DOMICILIO:</span> <strong>{v.domicilio}</strong></p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImprimirTodas;