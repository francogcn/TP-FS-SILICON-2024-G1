import React, { useState, useEffect } from "react";

const NuevoPrestamoModal = ({ show, handleClose, handleSave }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [libros, setLibros] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");
  const [libroSeleccionado, setLibroSeleccionado] = useState("");
  const [fecha_prestamo, setFecha_prestamo] = useState();
  const [fecha_devolucion, setFecha_devolucion] = useState();

  useEffect(() => {
    fetch("http://localhost:8080/api/usuario")
      .then((response) => response.json())
      .then((data) => setAlumnos(data))
      .catch((error) => console.error("Error al cargar alumnos:", error));

    fetch("http://localhost:8080/api/libros/estado/disponible")
      .then((response) => response.json())
      .then((data) => setLibros(data))
      .catch((error) => console.error("Error al cargar libros:", error));

    const hoy = new Date();
    const fechaPrestamo = hoy.toISOString().split("T")[0];

    const fechaDevolucionDate = new Date(hoy);
    fechaDevolucionDate.setDate(hoy.getDate() + 14);
    const fechaDevolucion = fechaDevolucionDate.toISOString().split("T")[0];

    setFecha_prestamo(fechaPrestamo);
    setFecha_devolucion(fechaDevolucion);
  }, []);

  const handleSubmit = async () => {
    const nuevoPrestamo = {
      id_usuario: alumnoSeleccionado,
      id_libro: libroSeleccionado,
      fecha_prestamo,
      fecha_devolucion,
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

    setAlumnoSeleccionado("");
    setLibroSeleccionado("");
    setFecha_prestamo("");
    setFecha_devolucion("");
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
                  <label htmlFor="alumno" className="form-label">
                    Alumno
                  </label>
                  <select
                    className="form-select"
                    id="alumno"
                    value={alumnoSeleccionado}
                    onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                  >
                    <option value="">Selecciona un alumno</option>
                    {alumnos.map((alumno) => (
                      <option key={alumno.id_usuario} value={alumno.id_usuario}>
                        {alumno.nombre} {alumno.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="libro" className="form-label">
                    Libro
                  </label>
                  <select
                    className="form-select"
                    id="libro"
                    value={libroSeleccionado}
                    onChange={(e) => setLibroSeleccionado(e.target.value)}
                  >
                    <option value="">Selecciona un libro</option>
                    {libros.map((libro) => (
                      <option key={libro.id_libro} value={libro.id_libro}>
                        {libro.titulo}{" "}
                      </option>
                    ))}
                  </select>
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
