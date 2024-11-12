import React, { useState, useEffect } from "react";

const AgregarAmigosModal = ({ show, handleClose, handleSave }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/usuario/usuarios/2") //esto se tiene que automatizar con el id del usuario logueado
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al buscar usuarios:", error));
  });

  const handleSubmit = async () => {
    const nuevaAmistad = {
      id_usuario: 2,
      id_amigo_usuario: usuarioSeleccionado,
    };

    try {
      const response = await fetch("http://localhost:8080/api/amistad/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaAmistad),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el prestamo.");
      }

      handleSave(nuevaAmistad);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un error al agregar amigo. Por favor, inténtalo de nuevo."
      );
    }
    setUsuarioSeleccionado("");
  };

  if (!show) return null; // Oculta el modal si no está activo

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-backdrop">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Amigo</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="amigo" className="form-label">
                  </label>
                  <select
                    className="form-select"
                    id="amigo"
                    value={usuarioSeleccionado}
                    onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                  >
                    <option value="">Selecciona un amigo</option>
                    {usuarios.map((usuario) => (
                      <option key={usuario.id_usuario} value={usuario.id_usuario}>
                        {usuario.nombre} {usuario.apellido}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarAmigosModal;
