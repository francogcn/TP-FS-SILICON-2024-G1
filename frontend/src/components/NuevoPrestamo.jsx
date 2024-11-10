import React, { useState } from "react";

const NuevoPrestamoModal = ({ show, handleClose, handleSave }) => {
  const [id_usuario, setId_usuario] = useState("");
  const [id_libro, setId_libro] = useState("");
  const [fecha_prestamo, setFecha_prestamo] = useState();
  const [fecha_devolucion, setFecha_devolucion] = useState() // Día de préstamo + 14 días
 
  const handleSubmit = async () => {
    const nuevoPrestamo = {
      id_usuario,
      id_libro,
      fecha_prestamo,
      fecha_devolucion
    };

    try {
        const response = await fetch("http://localhost:8080/api/prestamos/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
            },
          body: JSON.stringify(nuevoPrestamo),
        });
  
        if (!response.ok) {
          throw new Error("Error al guardar el prestamo.");
        }
  
        handleSave(nuevoPrestamo); 
        handleClose();
        window.location.reload();

      } catch (error) {
        console.error("Error:", error);
        alert(
          "Hubo un error al intentar guardar el prestamo. Por favor, inténtalo de nuevo."
        );
      }
  
      setId_usuario("");
      setId_libro("");
  };

  if (!show) return null; // Oculta el modal si no está activo

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-backdrop">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar prestamo</h5>
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
                  <label htmlFor="id_usuario" className="form-label">
                    ID del Alumno
                  </label>
                  <input
                    type="int"
                    className="form-control"
                    id="id_usuario"
                    value={id_usuario}
                    onChange={(e) => setId_usuario(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="id_libro" className="form-label">
                    ID del Libro
                  </label>
                  <input
                    type="int"
                    className="form-control"
                    id="id_libro"
                    value={id_libro}
                    onChange={(e) => setId_libro(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fecha_prestamo" className="form-label">
                    Fecha de prestamo
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha_prestamo"
                    value={fecha_prestamo}
                    onChange={(e) => setFecha_prestamo(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fecha_devolucion" className="form-label">
                  Fecha de devolucion
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha_devolucion"
                    value={fecha_devolucion}
                    onChange={(e) => setFecha_devolucion(e.target.value)}
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

export default NuevoPrestamoModal;
