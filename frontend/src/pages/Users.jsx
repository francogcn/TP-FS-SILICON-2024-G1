import { useEffect, useState } from "react";
import EditarUsuario from "../components/EditarUsuario";
import { toast } from 'react-toastify';

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [mensajeEliminar, setMensajeEliminar] = useState("");

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

//modal para editar un usuario
const handleOpenEditModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

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

 //eliminar usuario
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
        setMensajeEliminar("Usuario eliminado con éxito.");
        console.log(mensajeEliminar);
      } else {
        setMensajeEliminar("Hubo un error al eliminar el usuario.");
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
                      <button className="btn btn-secondary" onClick={() => handleOpenEditModal(usuario)}>Editar</button>
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(usuario.id_usuario)}>Eliminar</button>
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
    </>
  );
}
