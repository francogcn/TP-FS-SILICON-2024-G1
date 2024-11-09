import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"

export default function ReviewCard({titulo, resenia, puntaje}) {
    const id_usuario = 1; //Esto se debe automatizar
    const[reviewAmigos, setReviewAmigos] = useState([]);
    useEffect(()=>{
        const fetchReseniaAmigos = async()=>{
            try{
                const response = await fetch(`http://localhost:8080/api/amistad/resenias_amigos/${id_usuario}`);
                const data = await response.json();
                setReviewAmigos(data);

            } catch(error){
                console.error("Error al obtener los préstamos:", error)
            }
        };
        fetchReseniaAmigos();
    },[]);

    return (
        <>
            <div className="card text-center mb-3" style="width: 18rem;">
                <div className="card-body">
                    <h5 className="card-title">Special title treatment</h5>
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <NavLink href="/" className="btn btn-primary">Go somewhere</NavLink>
                </div>
            </div>
        </>
    )
}
