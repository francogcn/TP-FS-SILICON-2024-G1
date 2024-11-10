import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState([]);  // Estado para los roles disponibles
  const [id_rol, setIdRol] = useState('');  // Estado para el rol seleccionado
  const navigate = useNavigate();

  // Cargar los roles desde el backend cuando el componente se monta
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/roles');
        if (!response.ok) {
          throw new Error("Error al obtener los roles");
        }
        const data = await response.json();
        setRoles(data);  // Almacenamos los roles con id_rol y nombre
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los roles");
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validar que los campos estén completos
    if (!nombre || !apellido || !email || !password || !id_rol) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      // hacer fetch al backend
      const response = await fetch('http://localhost:8080/api/usuario/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          mail: email,
          contrasenia: password,
          id_rol
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Error al registrar el usuario");
      } else {
        alert("Usuario registrado correctamente");
        navigate("/login"); // se redirige al login después de un registro exitoso
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="container" id="signup">
        <div className="row">
            <div className="col-sm-6">
                <img src="signup-icon.png" alt="Library" className="img-fluid" />
            </div>
            <div className="col-sm-6">
                <form onSubmit={handleSubmit} className="form-container">
                    <h3 style={{ color: "#fff" }}>Registrate:</h3>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <label htmlFor="nombre">Nombre</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="apellido"
                            placeholder="Tu apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                        <label htmlFor="apellido">Apellido</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="alguien@tumail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email">Correo electrónico</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password">Contraseña</label>
                    </div>

                    <div className="form-floating mb-3">
                        <select
                            className="form-control"
                            id="id_rol"
                            value={id_rol}
                            onChange={(e) => setIdRol(e.target.value)}
                        >
                            <option value="">Selecciona un rol</option>
                            {roles.map((rol) => (
                                <option key={rol.id_rol} value={rol.id_rol}>
                                    {rol.nombre}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="id_rol">Rol</label>
                    </div>

                    <button type="submit" className="btn btn-primary">Registrarme</button>
                </form>
            </div>
        </div>
    </div>
);
}