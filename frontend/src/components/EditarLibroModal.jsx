import React, { useState, useEffect } from "react";

function EditarLibroModal({ show, handleClose, handleSave, libro }) {
    const [formData, setFormData] = useState({
        titulo: "",
        autor: "",
        editorial: "",
        anio_publicacion: "",
        genero: "",
        estado: "disponible",
      });

      useEffect(() => {
        if (libro) {
          setFormData({
            titulo: libro.titulo,
            autor: libro.autor,
            editorial: libro.editorial,
            anio_publicacion: libro.anio_publicacion,
            genero: libro.genero,
            estado: libro.estado,
          });
        }
      }, [libro]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

  const handleSubmit = () => {
    const updatedLibro = { ...libro, ...formData };
    handleSave(updatedLibro);
    handleClose();
  };

  return (
    <div
      className={`modal ${show ? "d-block" : "d-none"}`}
      tabIndex="-1"
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Libro</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Título"
              className="form-control mb-2"
            />
            <input
              type="text"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              placeholder="Autor"
              className="form-control mb-2"
            />
            <input
              type="text"
              name="editorial"
              value={formData.editorial}
              onChange={handleChange}
              placeholder="Editorial"
              className="form-control mb-2"
            />
            <input
              type="number"
              name="anio_publicacion"
              value={formData.anio_publicacion}
              onChange={handleChange}
              placeholder="Año de publicación"
              className="form-control mb-2"
            />
            <input
              type="text"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              placeholder="Género"
              className="form-control mb-2"
            />
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="form-control mb-2"
            >
              <option value="disponible">Disponible</option>
              <option value="prestado">Prestado</option>
              <option value="retrasado">Retrasado</option>
              <option value="extraviado">Extraviado</option>
            </select>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarLibroModal;
