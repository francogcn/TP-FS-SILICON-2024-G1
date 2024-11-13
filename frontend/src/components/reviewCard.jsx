import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react"

export default function ReviewCard({truncate=true}) {
    const token = sessionStorage.getItem("token");
    const decode = jwtDecode(token);
    const id_usuario = decode.id_usuario;

    const [reviewAmigos, setReviewAmigos] = useState([]);

    useEffect(() => {
        const fetchReseniaAmigos = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/amistad/resenias_amigos/${id_usuario}`);
                const data = await response.json();
                setReviewAmigos(data);

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

    return (
        <>
        <h3 className="text-start m-3">Mira lo que están leyendo tus amigos</h3>
            {reviewAmigos.map(review => (
                    <div key={review.id_resenia} className="row justify-content-md-center">
                        <div className="resenias-amigos-home">
                                <p className="">
                                    <b>{review.nombre_amigo + " " + review.apellido_amigo} </b>
                                    ha calificado un libro con 
                                    <i className="stars"> {renderStars(review.clasificacion)}</i>
                                </p>
                                <h5 className="">{review.titulo_libro}</h5>
                                <p className={"text-start d-block "+(truncate && "text-truncate")}>{review.texto_resenia} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa id consequatur aperiam dolore laborum sequi iste et, veniam voluptate, tenetur vero facere quasi voluptatum maiores quis neque fugiat veritatis eos!</p>

                                <button className="btn btn-primary">Leer más</button>
                            </div>
                        </div>))}

        </>
    )
}
