import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const AgregarAmigosModal = ({ show, handleClose, handleSave }) => {
  const token = sessionStorage.getItem("token");
  const decode = jwtDecode(token);
  const id_usuario = decode.id_usuario;

  const [usuarios, setUsuarios] = useState([]);
  const [amigoSeleccionado, setAmigoSeleccionado] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/usuario/usuarios/${id_usuario}`)
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al buscar usuarios:", error));
  }, [id_usuario]);

  const handleSubmit = async () => {
    if (!amigoSeleccionado) {
      alert("Por favor, selecciona un amigo.");
      return;
    }

    const nuevaAmistad = { id_usuario, id_amigo_usuario: amigoSeleccionado };

    try {
      const response = await fetch("http://localhost:8080/api/amistad/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaAmistad),
      });

      if (!response.ok) throw new Error("Error al guardar amistad");

      handleSave(nuevaAmistad);
      handleClose();
      window.location.reload(); 
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al agregar amigo. Por favor, inténtalo de nuevo.");
    } finally {
      setAmigoSeleccionado("");
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-backdrop">
        <div className="modal-dialog modal-dialog-centered" role="document">
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
              {!usuarios.length ? (
                <p>Cargando usuarios...</p>
              ) : (
                <form>
                  <div className="mb-3">
                    <label htmlFor="amigo" className="form-label">
                      Selecciona un amigo
                    </label>
                    <select
                      className="form-select"
                      id="amigo"
                      value={amigoSeleccionado}
                      onChange={(e) => setAmigoSeleccionado(e.target.value)}
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
              )}
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
