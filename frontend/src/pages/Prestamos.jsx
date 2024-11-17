import { useState, useEffect } from "react";
import NuevoPrestamoModal from "../components/NuevoPrestamo";
import { jwtDecode } from "jwt-decode";
import EditarPrestamoModal from "../components/EditarPrestamoModal";

export default function Prestamos() {
  const token = sessionStorage.getItem("token");
  const decode = jwtDecode(token);
  /*Si decode.rol == 1 es admin 
  si decode.rol ==2 es bibliotecario y se habilita 
  el boton de agregar prestamo, borrar y editar.*/
  const isadmin = decode.rol == 1 || decode.rol == 2;

  const [prestamos, setPrestamos] = useState([]);
  const [mensajeEliminar, setMensajeEliminar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  //Hago el fetch a la API para traer todos los prestamos
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/prestamos");
        const data = await response.json();
        setPrestamos(data);
      } catch (error) {
        console.error("Error al obtener los préstamos:", error);
      }
    };
    fetchPrestamos();
  }, []);

  //modal para agregar un nuevo prestamo
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleSavePrestamo = (nuevoPrestamo) => {
    console.log("Nuevo Prestamo:", nuevoPrestamo);
  };

  //modal para editar un prestamo
   const handleOpenEditModal = (prestamo) => {
     setPrestamoSeleccionado(prestamo);
     setShowEditModal(true);
   };
   const handleCloseEditModal = () => setShowEditModal(false);

   const handleSaveEdit = async (updatedPrestamo) => {
     try {
       const response = await fetch(
         `http://localhost:8080/api/prestamos/${updatedPrestamo.id_prestamo}`,
         {
           method: "PUT",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(updatedPrestamo),
         }
       );

       if (response.ok) {
        setPrestamos((prevPrestamos) =>
          prevPrestamos.map((prestamo) =>
            prestamo.id_prestamo === updatedPrestamo.id_prestamo
              ? updatedPrestamo
              : prestamo
          )
        );
        handleCloseEditModal();
      } else {
        console.error("Error al actualizar el préstamo");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  //eliminar prestamo
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/prestamos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setPrestamos((prevPrestamos) =>
          prevPrestamos.filter((prestamo) => prestamo.id_prestamo !== id)
        );
        setMensajeEliminar("Prestamo eliminado con éxito.");
      } else {
        setMensajeEliminar("Hubo un error al eliminar el prestamo.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensajeEliminar("Error al conectar con el servidor.");
    }
  };

  return (
    <>
      <div className="container">
        <h1>Préstamos</h1>
        <div className="row prestamos">
          <div className="col">
            {isadmin ? (
              <button className="btn btn-primary" onClick={handleOpenModal}>
                Nuevo Préstamo
              </button>
            ) : null}
            <NuevoPrestamoModal
              show={showModal}
              handleClose={handleCloseModal}
              handleSave={handleSavePrestamo}
            />
          </div>
        </div>
        <div className="table-responsive">
        {prestamos.length === 0 ? (
          // Si no hay préstamos
          decode.rol !== 1 && decode.rol !== 2 ? (
            // Si es cliente y no hay préstamos, mostramos el mensaje para clientes
            <p>No tienes préstamos aún.</p>
          ) : (
            // Si es admin o bibliotecario y no hay préstamos, mostramos el mensaje para admin/bibliotecario
            <div>
              <p>No hay préstamos aún.</p>
            </div>
          )
        ) : (
          // Si hay préstamos, renderizamos la tabla
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Préstamo</th>
                 {/* Mostrar columna "Usuario" solo si el usuario es admin o bibliotecario */}
                {isadmin && <th>Usuario</th>}
                <th>Libro</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                {isadmin ? <th>Editar</th> : null}
                {isadmin ? <th>Eliminar</th> : null}
              </tr>
            </thead>
            <tbody>
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id_prestamo}>
                  <td>{prestamo.id_prestamo}</td>
                  {/* Mostrar el nombre del usuario solo si el usuario es admin o bibliotecario */}
                  {isadmin && (<td>{prestamo.nombre_usuario} {prestamo.apellido_usuario}</td>)}
                  <td>{prestamo.titulo_libro}</td>
                  <td>{prestamo.fecha_prestamo}</td>
                  <td>{prestamo.fecha_devolucion}</td>
                  {isadmin ? (
                    <td>
                      <button className="btn btn-secondary" onClick={() => handleOpenEditModal(prestamo)}>
                        Editar
                      </button>
                    </td>
                  ) : null}
                  {isadmin ? (
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(prestamo.id_prestamo)}>
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
          <EditarPrestamoModal
            show={showEditModal}
            handleClose={handleCloseEditModal}
            handleSave={handleSaveEdit}
            prestamo={prestamoSeleccionado}
          />
        )}
      </div>
    </>
  );
}
