import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react"

export default function ReviewCard({ initialTruncate = true }) {
    const token = sessionStorage.getItem("token");
    const decode = jwtDecode(token);
    const id_usuario = decode.id_usuario;

    const [reviewAmigos, setReviewAmigos] = useState([]);
    const [expandedReviews, setExpandedReviews] = useState({});

    useEffect(() => {
        const fetchReseniaAmigos = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/amistad/resenias_amigos/${id_usuario}`);
                const data = await response.json();
                setReviewAmigos(data);
                // Inicializo el estado de expandedReviews
                const initialExpanded = data.reduce((acc, review) => {
                    acc[review.id_resenia] = !initialTruncate;
                    return acc;
                }, {});
                setExpandedReviews(initialExpanded);
            } catch (error) {
                console.error("Error al obtener las reseñas:", error)
            }
        };
        fetchReseniaAmigos();
    }, []);

    const renderStars = (valor) => {
        const filledStars = '★'.repeat(valor);
        const emptyStars = '☆'.repeat(5 - valor);
        return filledStars + emptyStars;
    };

    const toggleExpand = (id) => {
        setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            <h3 className="text-start m-3">Mira lo que están leyendo tus amigos</h3>
            {reviewAmigos !=""? reviewAmigos.map(review => (
                <div key={review.id_resenia} className="row justify-content-md-center">
                    <div className="resenias-amigos-home">
                        <p className="">
                            <b>{review.nombre_amigo + " " + review.apellido_amigo} </b>
                            ha calificado un libro con 
                            <i className="stars"> {renderStars(review.clasificacion)}</i>
                        </p>
                        <h5 className="">{review.titulo_libro}</h5>
                        <p className={"text-start d-block " + (!expandedReviews[review.id_resenia] && "text-truncate")}>
                            {review.texto_resenia}
                        </p>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => toggleExpand(review.id_resenia)}
                        >
                            {expandedReviews[review.id_resenia] ? "Leer menos" : "Leer más"}
                        </button>
                    </div>
                </div>
            )): <h5>Tus amigos aún no han dejado reseñas</h5>}
        </>
    )
}