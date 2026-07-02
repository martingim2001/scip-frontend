import { useEffect } from 'react';
import QRCode from 'react-qr-code';

const CedulaPrint = () => {
  // Recuperamos los datos que guardamos temporalmente en el navegador
  const vehiculo = JSON.parse(localStorage.getItem('vehiculoParaImprimir'));

  useEffect(() => {
    // Al abrirse la ventana, lanzamos la impresión automáticamente
    if (vehiculo) {
      window.print();
    }
  }, [vehiculo]);

  if (!vehiculo) return <p>Cargando datos...</p>;

  return (
    <div className="contenedor-cedulas-print">
      {/* FRENTE */}
      <div className="cedula-fisica">
        <div className="cedula-fondo-agua">DNRPA</div>
        <div className="cedula-cabecera">
          <p className="republica">REPÚBLICA ARGENTINA</p>
          <p className="titulo-cedula">CÉDULA DE IDENTIFICACIÓN DE VEHÍCULOS</p>
        </div>
        <div className="cedula-contenido">
          <div className="cedula-datos">
            <p><span>MARCA:</span> <strong>{vehiculo.marca}</strong></p>
            <p><span>MODELO:</span> <strong>{vehiculo.modelo}</strong></p>
            <p><span>TIPO:</span> <strong>{vehiculo.tipo}</strong></p>
            <p><span>CHASIS:</span> <strong>{vehiculo.numero_chasis}</strong></p>
            <p><span>MOTOR:</span> <strong>{vehiculo.numero_motor}</strong></p>
          </div>
          <div className="cedula-qr-contenedor">
            <QRCode value={`DOMINIO: ${vehiculo.titulo}\nMARCA: ${vehiculo.marca}\nCHASIS: ${vehiculo.numero_chasis}`} size={60} />
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
          <p><span>TITULAR:</span> <strong>{vehiculo.titular_nombre}</strong></p>
          <p><span>D.N.I.:</span> <strong>{vehiculo.titular_dni}</strong></p>
          <p><span>DOMICILIO:</span> <strong>{vehiculo.domicilio}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default CedulaPrint;