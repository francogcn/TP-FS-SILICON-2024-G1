import { NavLink } from "react-router-dom";
export default function NotFound(){
    return(
        <>
        <div className="container">
            <h1>Not Found</h1>
            <p>Parece que te perdiste</p>
            
            <NavLink to="/">
                <button className="btn btn-outline-primary">
                    Volver al inicio
                </button>
            </NavLink>
            
        </div>
        </>
    )
}