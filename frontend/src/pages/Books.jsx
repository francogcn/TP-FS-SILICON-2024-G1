import { useState, useEffect } from "react"

export default function Books() {
  const [libros, setLibros] = useState([]);
  const isadmin = false; 
   useEffect(()=>{
       const fetchLibros = async()=>{
           try{
               const response = await fetch('http://localhost:8080/api/libros');
               const data = await response.json();
               setLibros(data);
               console.log(data);

           } catch(error){
               console.error("Error al obtener los libros:", error)
           }
       };
       fetchLibros();
   },[]);

  return (
    <>
    <div className="container">
            <h1>Libros</h1>
            <div className="row libros">
              <div className="col">
              {isadmin ? <button className="btn btn-primary">
                Agregar libro
              </button> : null}
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Autor</th>
            <th>Editorial</th>
            <th>Año</th>
            <th>Genero</th>
            {isadmin ? <th>Editar</th> : null}
          </tr>
        </thead>
        <tbody>
          {libros.map(libro => (
            <tr key={libro.id_libro}>
              <td>{libro.titulo}</td>
              <td>{libro.autor}</td>
              <td>{libro.editorial}</td>
              <td>{libro.anio_publicacion}</td>
              <td>{libro.genero}</td>
              {isadmin ? <td><button className="btn btn-secondary">Editar</button></td> : null}
            </tr> 
          ))}
        </tbody>
      </table></div>
        </div>
    </>
  )
}
