import { useState, useEffect } from "react";
import NuevoLibroModal from "../components/nuevoLibroModal";

export default function Books() {
  const [libros, setLibros] = useState([]);
  const [mensajeEliminar, setMensajeEliminar] = useState("");
  const isadmin = true;
  const id = "Titulo del libro";

  // Listar libros
  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/libros");
        const data = await response.json();
        setLibros(data);
      } catch (error) {
        console.error("Error al obtener los libros:", error);
      }
    };
    fetchLibros();
  }, []);

  //modal para agregar un nuevo libro
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveLibro = (nuevoLibro) => {
    console.log("Nuevo Libro:", nuevoLibro);
  };

  //eliminar un libro
  const handleDelete = async (id_libro) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/libros/${id_libro}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMensajeEliminar("Libro eliminado con éxito.");
      } else {
        setMensajeEliminar("Hubo un error al eliminar el libro.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensajeEliminar("Error al conectar con el servidor.");
    }
  };

  return (
    <>
      <div className="container">
        <h1>Libros</h1>
        <div className="row libros">
          <div className="col">
            {isadmin ? (
              <button className="btn btn-primary" onClick={handleOpenModal}>
                Agregar libro
              </button>
            ) : null}
            <NuevoLibroModal
              show={showModal}
              handleClose={handleCloseModal}
              handleSave={handleSaveLibro}
            />
            <button className="btn btn-primary">
              Ver libros disponibles
            </button>
          </div>
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
              {isadmin ? <th>Eliminar</th> : null}
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.id_libro}>
                <td>{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>{libro.editorial}</td>
                <td>{libro.anio_publicacion}</td>
                <td>{libro.genero}</td>
                {isadmin ? (
                  <td>
                    <button className="btn btn-secondary">Editar</button>
                  </td>
                ) : null}
                {isadmin ? (
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete()}
                    >
                      Eliminar
                    </button>
                  </td>
                ) : null}
                {mensajeEliminar && <p>{mensajeEliminar}</p>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
