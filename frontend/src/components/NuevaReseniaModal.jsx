import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

const ReseñaModal = ({ show, handleClose, handleSave, id_usuario }) => {
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState("");
  const [textoResenia, setTextoResenia] = useState("");
  const [clasificacion, setClasificacion] = useState(1); // Valor por defecto

  useEffect(() => {
    // Traemos los libros que el usuario ha devuelto (se sacan del backend, desde un endpoint en prestamos)
    const fetchLibrosDevueltos = async () => {
      try {

        const response = await fetch(
          `http://localhost:8080/api/prestamos/usuario/${id_usuario}/devueltos`
        );
        const data = await response.json();

        console.log(data); // inspección 1 (apenas llegaron los libros devueltos)
        
        // Verifica que 'data' es un arreglo
        if (Array.isArray(data)) {
          setLibros(data);
        } else {
          console.error("La respuesta de la API no es un arreglo:", data);
        }
      } catch (error) {
        console.error("Error al obtener los libros devueltos:", error);
      }
    };

    fetchLibrosDevueltos();
  }, [id_usuario]);

  const handleSubmit = async () => {
    const nuevaResenia = {
      id_usuario,
      id_libro: parseInt(libroSeleccionado),
      texto_resenia: textoResenia,
      clasificacion,
    };
  
    console.log("Datos a enviar:", nuevaResenia); // inspección 2 (data lista para crear la resenia)

    // validación
    if (!libroSeleccionado || !textoResenia || !clasificacion) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/resenia/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaResenia),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar la reseña.");
      }
  
      const data = await response.json();  // Obtener la respuesta

      handleSave(data); // Pasar la respuesta de la API al componente padre
      handleClose(); // Cerrar el modal

    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al intentar guardar la reseña. Por favor, inténtalo de nuevo.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-backdrop">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Reseña</h5>
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
                    {libros.length > 0 ? (
                        libros.map((libro) => (
                            <option key={libro.id_libro} value={libro.id_libro}>
                                {libro.titulo_libro}
                            </option>
                        ))
                    ) : (
                        <option value="">No hay libros devueltos</option>
                    )}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="texto_resenia" className="form-label">
                    Reseña
                  </label>
                  <textarea
                    className="form-control"
                    id="texto_resenia"
                    value={textoResenia}
                    onChange={(e) => setTextoResenia(e.target.value)}
                    rows="4"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="clasificacion" className="form-label">
                    Clasificación
                  </label>
                  <select
                    className="form-select"
                    id="clasificacion"
                    value={clasificacion}
                    onChange={(e) => setClasificacion(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <option key={valor} value={valor}>
                        {valor}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReseñaModal;
