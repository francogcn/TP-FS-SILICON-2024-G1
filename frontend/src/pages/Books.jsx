import { useState, useEffect } from "react";
import NuevoLibroModal from "../components/nuevoLibroModal";
import EditarLibroModal from "../components/EditarLibroModal";
import { jwtDecode } from "jwt-decode";

export default function Books() {
  const [libros, setLibros] = useState([]);
  const [mensajeEliminar, setMensajeEliminar] = useState("");
  const token = sessionStorage.getItem("token");
  const decode = jwtDecode(token);
  /*Si decode.rol == 1 es admin 
  si decode.rol ==2 es bibliotecario y 
  se habilita el boton de agregar libro, borrar y editar.*/
  const isadmin = decode.rol == 1 || decode.rol == 2; 

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

  //modal para editar un libro
  const [showEditModal, setShowEditModal] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  const handleOpenEditModal = (libro) => {
    setLibroSeleccionado(libro);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  const handleSaveEdit = async (updatedLibro) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/libros/${updatedLibro.id_libro}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedLibro),
        }
      );

      if (response.ok) {
        setLibros((prevLibros) =>
          prevLibros.map((libro) =>
            libro.id_libro === updatedLibro.id_libro ? updatedLibro : libro
          )
        );
        setShowEditModal(false);
      } else {
        console.error("Error al actualizar el libro");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
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
        setLibros((prevLibros) =>
          prevLibros.filter((libro) => libro.id_libro !== id_libro)
        );
        setMensajeEliminar("Libro eliminado con éxito.");
        console.log(mensajeEliminar);
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
            <button className="btn btn-primary">Ver libros disponibles</button>
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
                <th>Estado</th>
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
                  <td>{libro.estado}</td>
                  {isadmin ? (
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleOpenEditModal(libro)}
                      >
                        Editar
                      </button>
                    </td>
                  ) : null}
                  {isadmin ? (
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(libro.id_libro)}
                      >
                        Eliminar
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showEditModal && (
          <EditarLibroModal
            show={showEditModal}
            handleClose={handleCloseEditModal}
            handleSave={handleSaveEdit}
            libro={libroSeleccionado}
          />
        )}
      </div>
    </>
  );
}
