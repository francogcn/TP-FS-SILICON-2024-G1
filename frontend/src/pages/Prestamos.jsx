import { useState, useEffect } from "react"

export default function Prestamos() {
    const [prestamos, setPrestamos] = useState([]);
    useEffect(()=>{
        const fetchPrestamos = async()=>{
            try{
                const response = await fetch('http://localhost:8080/prestamos');
                const data = await response.json();
                setPrestamos(data);

            } catch(error){
                console.error("Error al obtener los préstamos:", error)
            }
        };
        fetchPrestamos();
    },[]);

    return (
        <>
        <div className="container">
            <h1>Prestamos</h1>
            <div className="row prestamos">
              <div className="col">
              <button className="btn btn-primary">
                Generar Prestamos
              </button>
              </div>
            </div>
            <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID Préstamo</th>
            <th>ID Usuario</th>
            <th>ID Libro</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map(prestamo => (
            <tr key={prestamo.id_prestamo}>
              <td>{prestamo.id_prestamo}</td>
              <td>{prestamo.id_usuario}</td>
              <td>{prestamo.id_libro}</td>
              <td>{prestamo.fecha_prestamo}</td>
              <td>{prestamo.fecha_devolucion}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
        </>
    )
}
