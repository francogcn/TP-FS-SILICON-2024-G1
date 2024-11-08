import { useState, useEffect } from "react"

export default function Prestamos() {
    const [prestamos, setPrestamos] = useState([]);


   //Hago el fetch a la API para traer todos los prestamos
    useEffect(()=>{
        const fetchPrestamos = async()=>{
            try{
                const response = await fetch('http://localhost:8080/api/prestamos');
                const data = await response.json();
                setPrestamos(data);
                console.log(data);

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
            <div className="table-responsive">
              <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Préstamo</th>
            <th>Usuario</th>
            <th>Libro</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map(prestamo => (
            <tr key={prestamo.id_prestamo}>
              <td>{prestamo.id_prestamo}</td>
              <td>{prestamo.nombre_usuario} {prestamo.apellido_usuario}</td>
              <td>{prestamo.titulo_libro}</td>
              <td>{prestamo.fecha_prestamo}</td>
              <td>{prestamo.fecha_devolucion}</td>
              <td><button className="btn btn-secondary">Editar</button></td>
            </tr> 
          ))}
        </tbody>
      </table></div>
        </div>
        </>
    )
}
