import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const EscanerQR = ({ onEscaneoExitoso }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    // 1. SOLUCIÓN BUG REACT 18: Vaciamos el contenedor HTML antes de iniciar el escáner
    const contenedor = document.getElementById("lector-qr");
    if (contenedor) {
      contenedor.innerHTML = ""; 
    }

    // 2. Creamos la instancia del escáner
    const scanner = new Html5QrcodeScanner(
      "lector-qr",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    // 3. Iniciamos el renderizado
    scanner.render(
      (textoDecodificado) => {
        // Al escanear con éxito, limpiamos y mandamos el texto
        scanner.clear().then(() => {
          onEscaneoExitoso(textoDecodificado);
        }).catch(err => console.error("Error al apagar tras éxito:", err));
      },
      () => {
        // Error continuo de búsqueda (lo dejamos vacío para que no sature la consola)
      }
    );

    // Guardamos la referencia para el apagado seguro
    scannerRef.current = scanner;

    // 4. Limpieza cuando el componente se oculta o se cierra
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.warn("Aviso controlado al desmontar cámara:", error);
        });
      }
    };
  }, [onEscaneoExitoso]);

  return (
    <div className="contenedor-escaner">
      <div 
        id="lector-qr" 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
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