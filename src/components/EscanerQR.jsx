import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const EscanerQR = ({ onEscaneoExitoso }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    // 1. Vaciamos el contenedor para evitar duplicados
    const contenedor = document.getElementById("lector-qr");
    if (contenedor) {
      contenedor.innerHTML = ""; 
    }

    // 2. Creamos el escáner fijando el aspecto para que no salte de tamaño
    const scanner = new Html5QrcodeScanner(
      "lector-qr",
      { 
        fps: 10, 
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0 // Fuerza a que sea un cuadro perfecto y estable
      },
      false
    );

    // 3. Iniciamos
    scanner.render(
      (textoDecodificado) => {
        scanner.clear().then(() => {
          onEscaneoExitoso(textoDecodificado);
        }).catch(err => console.error("Error al apagar:", err));
      },
      () => {
        // Dejar vacío para no saturar la consola
      }
    );

    scannerRef.current = scanner;

    // 4. Limpieza al cerrar
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.warn("Cámara cerrada correctamente.", error);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // <--- ¡CLAVE: Queda vacío [] para que NO se reinicie en bucle!

  return (
    <div className="contenedor-escaner" style={{ minHeight: '280px', display: 'flex', alignItems: 'center' }}>
      <div 
        id="lector-qr" 
        style={{ 
          width: '100%', 
          maxWidth: '320px', 
          margin: '0 auto', 
          backgroundColor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      ></div>
    </div>
  );
};

export default EscanerQR;