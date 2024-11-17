import { useState, useEffect } from "react";

export default function EditarUsuario({
  show,
  handleClose,
  usuario,
  handleSave,
}) {
  const [editData, setEditData] = useState({
    id_usuario: "",
    nombre: "",
    apellido: "",
    mail: "",
    contrasenia: "",
    id_rol: "",
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (usuario) {
      setEditData({
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        mail: usuario.mail,
        contrasenia: "",
        id_rol: usuario.id_rol, // Carga el rol asignado al usuario
      });
    }
  }, [usuario, show]);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/roles");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error al cargar los roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveClick = () => {
    handleSave(editData);
    handleClose();
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Usuario</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={editData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="form-control mb-2"
            />
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={editData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="form-control mb-2"
            />
            <label htmlFor="mail" className="form-label">
              Mail
            </label>
            <input
              type="text"
              name="mail"
              value={editData.mail}
              onChange={handleChange}
              placeholder="Mail"
              className="form-control mb-2"
            />
            <label htmlFor="contrasenia" className="form-label">
              Contraseña
            </label>
            <input
              type="text"
              name="contrasenia"
              value={editData.contrasenia}
              onChange={handleChange}
              placeholder="Contraseña"
              className="form-control mb-2"
            />
            <label htmlFor="id_rol" className="form-label">
              Rol
            </label>
            <select
              className="form-select"
              id="id_rol"
              name="id_rol"
              value={editData.id_rol}
              onChange={handleChange}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id_rol} value={rol.id_rol}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cerrar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveClick}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
