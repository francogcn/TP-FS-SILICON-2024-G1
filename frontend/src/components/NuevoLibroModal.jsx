import React, { useState } from "react";

const NuevoLibroModal = ({ show, handleClose, handleSave }) => {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [editorial, setEditorial] = useState("");
  const [anio_publicacion, setAnioPublicacion] = useState("");
  const [genero, setGenero] = useState("");
  const [estado, setEstado] = useState("disponible");

  const handleSubmit = async () => {
    const nuevoLibro = {
      titulo,
      autor,
      editorial,
      anio_publicacion,
      genero,
      estado,
    };

    try {
      const response = await fetch("http://localhost:8080/api/libros/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(nuevoLibro),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el libro.");
      }

      handleSave(nuevoLibro); 
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un error al intentar guardar el libro. Por favor, inténtalo de nuevo."
      );
    }

    setTitulo("");
    setAutor("");
    setEditorial("");
    setAnioPublicacion("");
    setGenero("");
    setEstado("disponible");
  };

  if (!show) return null; // Oculta el modal si no está activo

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-backdrop">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar libro</h5>
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
                  <label htmlFor="titulo" className="form-label">
                    Título
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="autor" className="form-label">
                    Autor
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="autor"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="editorial" className="form-label">
                    Editorial
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="editorial"
                    value={editorial}
                    onChange={(e) => setEditorial(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="anio_publicacion" className="form-label">
                    Año
                  </label>
                  <input
                    type="year"
                    className="form-control"
                    id="anio_publicacion"
                    value={anio_publicacion}
                    onChange={(e) => setAnioPublicacion(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="genero" className="form-label">
                    Género
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="genero"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
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

export default NuevoLibroModal;
