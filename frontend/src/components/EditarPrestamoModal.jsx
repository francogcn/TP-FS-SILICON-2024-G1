import React, { useState, useEffect } from "react";

export default function EditarPrestamoModal({
  show,
  handleClose,
  prestamo,
  handleSave,
}) {
  const [editData, setEditData] = useState({
    id_prestamo: "",
    id_usuario: "",
    id_libro: "",
    fecha_prestamo: "",
    fecha_devolucion: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);

  // Actualiza los valores cuando el préstamo seleccionado cambia
  useEffect(() => {
    if (prestamo) {
      setEditData({
        id_prestamo: prestamo.id_prestamo || "",
        id_usuario: prestamo.id_usuario || "",
        id_libro: prestamo.id_libro || "",
        fecha_prestamo: prestamo.fecha_prestamo
          ? new Date(prestamo.fecha_prestamo)
          : "",
        fecha_devolucion: prestamo.fecha_devolucion
          ? new Date(prestamo.fecha_devolucion)
          : "",
      });
    }

    // Obtener la lista de usuarios para el desplegable
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/usuario/");
        const data = await response.json();
        setUsuarios(data);
        console.log(usuarios);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsuarios();

    // Obtener la lista de libros para el desplegable
    const fetchLibros = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/libros/");
        const data = await response.json();
        setLibros(data);
      } catch (error) {
        console.error("Error al obtener los libros:", error);
      }
    };
    fetchLibros();
    console.log(editData)
  }, [prestamo, show]);

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
            <h5 className="modal-title">Editar Préstamo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="id_usuario" className="form-label">
                  Usuario
                </label>
                <select
                  className="form-select"
                  id="id_usuario"
                  name="id_usuario"
                  value={editData.id_usuario}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id_usuario} value={usuario.id_usuario}>
                      {usuario.nombre} {usuario.apellido}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="id_libro" className="form-label">
                  Libro
                </label>
                <select
                  className="form-select"
                  id="id_libro"
                  name="id_libro"
                  value={editData.id_libro}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un libro</option>
                  {libros.map((libro) => (
                    <option key={libro.id_libro} value={libro.id_libro}>
                      {libro.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="fecha_prestamo" className="form-label">
                  Fecha Préstamo
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha_prestamo"
                  name="fecha_prestamo"
                  value={editData.fecha_prestamo}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fecha_devolucion" className="form-label">
                  Fecha de Devolución
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha_devolucion"
                  name="fecha_devolucion"
                  value={editData.fecha_devolucion}
                  onChange={handleChange}
                />
              </div>
            </form>
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
