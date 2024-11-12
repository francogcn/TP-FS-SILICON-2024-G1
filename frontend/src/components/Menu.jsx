import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';


export default function Menu() {
  
  const navigate = useNavigate();

  const [token, setToken] = useState("");

  useEffect(() => {
      const t = sessionStorage.getItem('token')
      if (t !== token) {
          setToken(t)
          //significa actualizar el estado interno para tener el ultimo token valido siempre
          //(por si en algún momento se renueva el token)
      }
  });


  // si no hay token y el usuario no está en las páginas de login o signup, se redirige al login
  // (esto puede ser un método provisorio antes de filtrar por token en los servicios de la web)
  useEffect(() => {
    if (!token && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
      navigate("/login"); 
    }
  }, [token]); // se vuelve a ejecutar si cambia el estado del token


  function logout() {
      sessionStorage.removeItem('token');
      setToken(""); // limpiar el estado local
      navigate('/'); // redirigir al inicio
  }

if (token !== "" && token !== null) {
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
          {/* Aquí agregamos los botones "Logout" y "Signup" */}
          <div className="d-flex">
            <button
                onClick={() => logout()}
                className='btn btn-outline-danger m-2'>
                <span
                    className="material-symbols-outlined">
                    Cerrar Sesión
                </span>
            </button>
            <NavLink to="/signup" className="btn btn-outline-success m-2">
              Registrarse
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
} else {
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
          
          </div>
          {/* Aquí agregamos los botones "Iniciar sesión" y "Registrarse" */}
          <div className="d-flex">
            <NavLink to="/login" className="btn btn-outline-primary m-2">
              Iniciar sesión
            </NavLink>
            <NavLink to="/signup" className="btn btn-outline-success m-2">
              Registrarse
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}


}
