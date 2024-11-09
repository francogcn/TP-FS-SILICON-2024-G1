import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"

export default function ReviewCard() {
    const id_usuario = 1; //Esto se debe automatizar
    const [reviewAmigos, setReviewAmigos] = useState([]);

    useEffect(() => {
        const fetchReseniaAmigos = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/amistad/resenias_amigos/${id_usuario}`);
                const data = await response.json();
                setReviewAmigos(data);

            } catch (error) {
                console.error("Error al obtener los préstamos:", error)
            }
        };
        fetchReseniaAmigos();
    }, []);

    return (
        <>
            <div className="row resenias-amigos-home">

                {reviewAmigos.map(review => (
                    <div key={review.id_resenia} className="col-sm-6 col-md-4">
                        <div className="card text-center mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{review.titulo_libro}</h5>
                                <p className="card-text">{review.texto_resenia}</p>
                                <p className="card-text">
                                    <span className="badge badge text-bg-light">{review.nombre_amigo +" "+ review.apellido_amigo}</span>
                                </p>
                                <NavLink href="/" className="btn btn-primary">Go somewhere</NavLink>
                            </div>
                        </div></div>))}
            </div>

        </>
    )
}
