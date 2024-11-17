import NewRelease from "./NewRelease";
import { useState, useEffect } from "react";

export default function Carrousel() {
  const [librosCarrousel, setLibrosCarrousel] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/libros/lastest")
      .then((response) => response.json())
      .then((data) => setLibrosCarrousel(data))
      .catch((error) => console.error("Error al cargar libros:", error));
  }, []);

  return (
    <>
      <div id="nuevosLibros" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
        {librosCarrousel.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#nuevosLibros"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
        </div>
        <div className="carousel-inner">
        {librosCarrousel.map((libro, index) => (
                        <div key={libro.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <NewRelease
                                titulo={libro.titulo}
                                autor={libro.autor}
                                genero={libro.genero}
                            />
                        </div>
                    ))}
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#nuevosLibros"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#nuevosLibros"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    );
}