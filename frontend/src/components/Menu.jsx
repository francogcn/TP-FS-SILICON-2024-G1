import { NavLink } from "react-router-dom"
export default function Menu(){
    return(
        <>
        <nav className="navbar fixed-top navbar-expand-lg">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">📚Bibliotech</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                 <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Inicio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/perfil">Perfil</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/prestamos">Prestamos</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <NavLink
                                className="nav-link dropdown-toggle"
                                to="/books"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                            Libros
                            </NavLink>
                                <ul className="dropdown-menu">
                                    <li><NavLink className="dropdown-item" to="/edit-data">Aventura</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/edit-password">Biografía</NavLink></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><NavLink className="dropdown-item" to="/books">Todos los generos</NavLink></li>
                                </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </>
    )
}