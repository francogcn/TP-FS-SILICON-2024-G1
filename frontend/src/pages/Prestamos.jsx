import { useState, useEffect } from "react";
import NuevoPrestamoModal from "../components/NuevoPrestamo";
import { jwtDecode } from "jwt-decode";
import EditarPrestamoModal from "../components/EditarPrestamoModal";
import { toast } from 'react-toastify';

export default function Prestamos() {
  const token = sessionStorage.getItem("token");
  const decode = jwtDecode(token);

  /*Si decode.rol == 1 es admin 
  si decode.rol ==2 es bibliotecario y se habilita 
  el boton de agregar prestamo, borrar y editar.*/
  const isadmin = decode.rol == 1 || decode.rol == 2;
  const userId = decode.id_usuario;
  console.log("User ID desde JWT:", userId); // Verifica que userId esté correcto

  const [prestamos, setPrestamos] = useState([]);
  const [mensajeEliminar, setMensajeEliminar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  // Hacer el fetch a la API para traer todos los préstamos
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/prestamos");
        const data = await response.json();

        // Si no es admin, filtramos los préstamos para que solo vea los de su propio ID
        if (!isadmin) {
          const filteredPrestamos = data.filter(prestamo => prestamo.id_usuario === userId);
          setPrestamos(filteredPrestamos);
        } else {
          setPrestamos(data); // Si es admin, muestra todos los préstamos
        }
      } catch (error) {
        console.error("Error al obtener los préstamos:", error);
      }
    };
    fetchPrestamos();
  }, []); // Se ejecuta cuando isadmin o userId cambian

  // Modal para agregar un nuevo préstamo
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleSavePrestamo = (nuevoPrestamo) => {
    console.log("Nuevo Prestamo:", nuevoPrestamo);
  };

  // Modal para editar un préstamo
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

  // Eliminar préstamo
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
        setMensajeEliminar("Préstamo eliminado con éxito.");
        console.log(mensajeEliminar);
      } else {
        setMensajeEliminar("Hubo un error al eliminar el préstamo.");
        console.log(mensajeEliminar);
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
        <h1>Préstamos</h1>
        <div className="row prestamos">
          <div className="col">
            {isadmin && (
              <button className="btn btn-primary" onClick={handleOpenModal}>
                Nuevo Préstamo
              </button>
            )}
            <NuevoPrestamoModal
              show={showModal}
              handleClose={handleCloseModal}
              handleSave={handleSavePrestamo}
            />
          </div>
        </div>
        <div className="table-responsive">
          {prestamos.length === 0 ? (
            <p>{decode.rol !== 1 && decode.rol !== 2 ? 'No tienes préstamos aún.' : 'No hay préstamos aún.'}</p>
          ) : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Préstamo</th>
                  {isadmin && <th>Usuario</th>}
                  <th>Libro</th>
                  <th>Fecha Préstamo</th>
                  <th>Fecha Devolución</th>
                  {isadmin && <th>Editar</th>}
                  {isadmin && <th>Eliminar</th>}
                </tr>
              </thead>
              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.id_prestamo}>
                    <td>{prestamo.id_prestamo}</td>
                    {isadmin && <td>{prestamo.nombre_usuario} {prestamo.apellido_usuario}</td>}
                    <td>{prestamo.titulo_libro}</td>
                    <td>{prestamo.fecha_prestamo}</td>
                    <td>{prestamo.fecha_devolucion}</td>
                    {isadmin && (
                      <>
                        <td>
                          <button className="btn btn-secondary" onClick={() => handleOpenEditModal(prestamo)}>
                            Editar
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-danger" onClick={() => handleDelete(prestamo.id_prestamo)}>
                            Eliminar
                          </button>
                        </td>
                      </>
                    )}
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
