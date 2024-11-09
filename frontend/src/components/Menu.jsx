import { NavLink } from "react-router-dom";
export default function Menu() {
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg ">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            📚Bibliotech
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/perfil">
                  Perfil
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/prestamos">
                  Préstamos
                </NavLink>
              </li>
              <li className="nav-item ">
                <NavLink className="nav-link" to="/books">
                  Libros
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
