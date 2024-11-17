import { useState, useEffect, useRef } from "react";
import NuevoLibroModal from "../components/NuevoLibroModal";
import EditarLibroModal from "../components/EditarLibroModal";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Books() {
  const [libros, setLibros] = useState([]);
  const [librosDisponibles, setLibrosDisponibles] = useState([]);
  const [mensajeEliminar, setMensajeEliminar] = useState("");
  const token = sessionStorage.getItem("token");
  const decode = jwtDecode(token);
  const { titulo } = useParams();

  /*Si decode.rol == 1 es admin 
  si decode.rol ==2 es bibliotecario y 
  se habilita el boton de agregar libro, borrar y editar.*/
  const isadmin = decode.rol == 1 || decode.rol == 2; 
  const mensajeExitoToastRef = useRef(false); // Referencia para evitar mostrar el toast más de una vez (contrarrestar el strict mode)

  // Listar libros
  useEffect(() => {
    const fetchLibros = async () => {
      let url ="http://localhost:8080/api/libros";
      if (titulo) {
        url += `/titulo/${titulo}`;
      }
      try {
        const response = await fetch(url);
        const data = await response.json();
        setLibros(data);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener los libros:", error);
      }
    };
    fetchLibros();
  }, [titulo]);
  
  // Mostrar solo libros disponibles
  const mostrarLibrosDisponibles = () => {
    const disponibles = libros.filter((libro) => libro.estado === "disponible");
    setLibrosDisponibles(disponibles);
  };
 
  //modal para agregar un nuevo libro
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveLibro = (nuevoLibro) => {
    // Guardamos el mensaje de éxito en localStorage
    localStorage.setItem('mensajeExitoToast', 'Libro publicado');
    localStorage.setItem('mensajeExitoConsola', `Libro publicado exitosamente: ${JSON.stringify(nuevoLibro, null, 2)}`);
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
  const handleDelete = async (libro) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/libros/${libro.id_libro}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setLibros((prevLibros) =>
          prevLibros.filter((item) => item.id_libro !== libro.id_libro)
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

// useEffect para mostrar el mensaje de éxito después de recargar la página
useEffect(() => {
  const mensajeExitoToast = localStorage.getItem('mensajeExitoToast');
  const mensajeExitoConsola = localStorage.getItem('mensajeExitoConsola');

  if (mensajeExitoToast && !mensajeExitoToastRef.current) {
    mensajeExitoToastRef.current = true; // Marcar que el mensaje ya fue mostrado
    setTimeout(() => {
      toast.success(mensajeExitoToast); // Mostrar el mensaje de éxito
      console.log(mensajeExitoConsola); // Mostrar en consola
      localStorage.removeItem('mensajeExitoToast', 'mensajeExitoConsola'); // Limpiar los mensajes para que no se repitan
    }, 500); // Retraso de 500 ms (así se conserva tras la recarga)
  }
}, []); // Ejecutarse solo una vez después de cargar el componente

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
            <button className="btn btn-primary" onClick={mostrarLibrosDisponibles}>Ver libros disponibles</button>
          </div>
        </div>
        <div className="table-responsive">
        {libros.length === 0 ? (
          // Si no hay libros
          decode.rol !== 1 && decode.rol !== 2 ? (
            // Si es cliente y no hay libros, mostramos el mensaje para clientes
            <p>No hay libros disponibles.</p>
          ) : (
            // Si es admin o bibliotecario y no hay libros, mostramos el mensaje para admin/bibliotecario
            <div>
              <p>No hay libros disponibles aún.</p>
              {isadmin && (
                <p>Como administrador o bibliotecario, puedes agregar nuevos libros.</p>
              )}
            </div>
          )
        ) : (
          // Si hay libros, renderizamos la tabla
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
              {(librosDisponibles.length > 0 ? librosDisponibles : libros).map((libro) => (
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
                        onClick={() => handleDelete(libro)}
                      >
                        Eliminar
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
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