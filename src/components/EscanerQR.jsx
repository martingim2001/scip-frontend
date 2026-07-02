import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const EscanerQR = ({ onEscaneoExitoso }) => {
  useEffect(() => {
    // 1. Configuramos el escáner
    const scanner = new Html5QrcodeScanner(
      "lector-qr",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    // 2. Iniciamos el escáner con sus dos funciones (Éxito y Error)
    scanner.render(
      (textoDecodificado) => {
        // ÉXITO: Apagamos la cámara y mandamos el texto
        scanner.clear();
        onEscaneoExitoso(textoDecodificado);
      },
      (error) => {
        // ERROR DE LECTURA: Mientras busca el QR, tira advertencias que podemos ignorar
        console.warn("Buscando QR...", error);
      }
    );

    // 3. Limpiamos la cámara si el usuario cierra el componente
    return () => {
      scanner.clear().catch(error => console.error("Error al apagar cámara", error));
    };
  }, [onEscaneoExitoso]);

  return (
    <div className="contenedor-escaner">
      <div id="lector-qr" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', backgroundColor: 'white' }}></div>
    </div>
  );
};

export default EscanerQR;