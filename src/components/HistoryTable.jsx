function HistoryTable() {
  return (
    <div className="panel-historial">
      <h3>Historial de Consultas de Dependencia</h3>
      <table className="tabla-historial">
        <thead>
          <tr>
            <th>Fecha/Hora</th>
            <th>Dominio</th>
            <th>Estado</th>
            <th>Operador</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>16:06</td>
            <td>AB 123 CD</td>
            <td className="texto-verde">SIN IMPEDIMENTOS</td>
            <td>M. Gimenez</td>
          </tr>
          <tr>
            <td>15:30</td>
            <td>A123BCD</td>
            <td className="texto-rojo">SECUESTRO ACTIVO (Rojo)</td>
            <td>J. Pérez</td>
          </tr>
          <tr>
            <td>14:15</td>
            <td>AA999ZZ</td>
            <td className="texto-rojo">ROBO RECIENTE (Rojo)</td>
            <td>C. Ruiz</td>
          </tr>
          <tr>
            <td>12:00</td>
            <td>AB 456 EF</td>
            <td className="texto-verde">SIN NOVEDAD (Verde)</td>
            <td>M. Gimenez</td>
          </tr>
        </tbody>
      </table>
      <div className="paginacion">
        <span>Paginado |&lt; &lt; 1 2 &gt; &gt;|</span>
      </div>
    </div>
  );
}

export default HistoryTable;