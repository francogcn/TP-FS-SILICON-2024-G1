import { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import EditarUsuario from "../components/EditarUsuario";

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const mensajeExitoToastRef = useRef(false); // Referencia para evitar mostrar el toast más de una vez

  // Obtener el token desde sessionStorage
  const token = sessionStorage.getItem("token");

  // Decodificar el token y obtener el id_usuario
  const decode = token ? jwtDecode(token) : null;
  const idUsuarioLogueado = decode ? decode.id_usuario : null;

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/usuario");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  // Modal para editar un usuario
  const handleOpenEditModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  // Guardar cambios en el usuario
  const handleSaveEdit = async (updatedUsuario) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/usuario/${updatedUsuario.id_usuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUsuario),
        }
      );

      if (response.ok) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.id_usuario === updatedUsuario.id_usuario
              ? updatedUsuario
              : usuario
          )
        );
        handleCloseEditModal();
      } else {
        console.error("Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/usuario/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.filter((usuario) => usuario.id_usuario !== id)
        );

        // Guardamos el mensaje de éxito en localStorage
        localStorage.setItem('mensajeExitoToast', 'Usuario eliminado con éxito');
        localStorage.setItem('mensajeExitoConsola', `Usuario eliminado exitosamente con ID: ${id}`);

        // Mostrar el toast inmediatamente con un pequeño retraso
        setTimeout(() => {
          const mensajeExitoToast = localStorage.getItem('mensajeExitoToast');
          const mensajeExitoConsola = localStorage.getItem('mensajeExitoConsola');

          if (mensajeExitoToast && !mensajeExitoToastRef.current) {
            mensajeExitoToastRef.current = true; // Marcar que el mensaje ya fue mostrado
            toast.success(mensajeExitoToast); // Mostrar el mensaje de éxito
            console.log(mensajeExitoConsola); // Mostrar en consola
            localStorage.removeItem('mensajeExitoToast');
            localStorage.removeItem('mensajeExitoConsola'); // Limpiar los mensajes para que no se repitan
          }
        }, 500); // Retraso de 500 ms para que el mensaje se muestre

      } else {
        console.error("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // useEffect para mostrar el mensaje de éxito después de la recarga de la página
  useEffect(() => {
    const mensajeExitoToast = localStorage.getItem('mensajeExitoToast');
    const mensajeExitoConsola = localStorage.getItem('mensajeExitoConsola');

    if (mensajeExitoToast && !mensajeExitoToastRef.current) {
      mensajeExitoToastRef.current = true; // Marcar que el mensaje ya fue mostrado
      setTimeout(() => {
        toast.success(mensajeExitoToast); // Mostrar el mensaje de éxito
        console.log(mensajeExitoConsola); // Mostrar en consola
        localStorage.removeItem('mensajeExitoToast');
        localStorage.removeItem('mensajeExitoConsola'); // Limpiar los mensajes para que no se repitan
      }, 500); // Retraso de 500 ms (así se conserva tras la recarga)
    }
  }, []); // Ejecutarse solo una vez después de cargar el componente

  return (
    <div className="container">
      <h1>Usuarios</h1>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Mail</th>
              <th>Rol</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.mail}</td>
                <td>{usuario.nombre_rol}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleOpenEditModal(usuario)}>
                    Editar
                  </button>
                </td>
                <td>
                  {/* Solo mostrar el botón de eliminar si no es el usuario logueado */}
                  {usuario.id_usuario !== idUsuarioLogueado && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(usuario.id_usuario)}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <EditarUsuario
          show={showEditModal}
          handleClose={handleCloseEditModal}
          handleSave={handleSaveEdit}
          usuario={usuarioSeleccionado}
        />
      )}
    </div>
  );
}
