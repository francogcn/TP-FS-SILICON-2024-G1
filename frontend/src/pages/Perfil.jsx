import { useEffect, useState } from "react";
import AgregarAmigosModal from "../components/NuevoAmigoModal";
import ReseñaModal from "../components/NuevaReseniaModal";
import {jwtDecode} from "jwt-decode";
import { toast } from 'react-toastify';
import '../cuadrosPerfil.css';

export default function Perfil() {
  const token = sessionStorage.getItem("token");
  const decode = jwtDecode(token);

  // se obtiene el id_usuario logueado mediante su token decodificado
  const id_usuario = decode.id_usuario;

  const [perfil, setPerfil] = useState([]);
  const [resenias, setResenias] = useState([]); // Para las últimas reseñas
  const [amigos, setAmigos] = useState([]); // Para los últimos amigos
  const [showReseniaModal, setShowReseniaModal] = useState(false); 
  const [prestamos, setPrestamos] = useState([]); // Para los préstamos activos
  const [expandedResenias, setExpandedResenias] = useState({});// Para controlar la expansión de cada reseña

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // traer info del usuario
        const response = await fetch(`http://localhost:8080/api/usuario/perfil/${id_usuario}`);
        const data = await response.json();
        console.log(data); // inspección de la info del usuario apenas llega del fetch
        setPerfil(data);

         // traemos las últimas reseñas
        const responseResenias = await fetch(`http://localhost:8080/api/resenia/usuario/${id_usuario}`);
        const dataResenias = await responseResenias.json();
        console.log("dataResenias: ", dataResenias); // inspección de las reseñas
        setResenias(dataResenias);  // Guarda las reseñas en su estado

        // Obtener los amigos del usuario
        const responseAmigos = await fetch(`http://localhost:8080/api/amistad/listar/${id_usuario}`);
        const dataAmigos = await responseAmigos.json();
        setAmigos(dataAmigos); // Guardamos los amigos en el estado
        console.log("Datos de amigos recibidos: ", dataAmigos);

        // Obtener préstamos activos
        const responsePrestamos = await fetch(`http://localhost:8080/api/prestamos/usuario/${id_usuario}`);
        const dataPrestamos = await responsePrestamos.json();
        setPrestamos(dataPrestamos); // Guarda los préstamos activos

      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    fetchProfile();
  }, [id_usuario]);

  const renderStars = (valor) => {
    const filledStars = "★".repeat(valor);
    const emptyStars = "☆".repeat(5 - valor);
    return filledStars + emptyStars;
  };

  const handleOpenReseniaModal = () => setShowReseniaModal(true);
  const handleCloseReseniaModal = () => setShowReseniaModal(false);

  const handleSaveResenia = async (respuestaDelBackend) => {
    toast.success("Reseña publicada");
    console.log("Reseña publicada exitosamente: ", respuestaDelBackend);
  
    const nuevaResenia = respuestaDelBackend.detail[0]; // El primer objeto en el arreglo "detail"
    
    // Verificamos que nuevaResenia tenga datos válidos antes de actualizar el estado
    if (nuevaResenia) {
      setResenias(prevResenias => {
        // Asegúrate de que prevResenias es un arreglo
        const validPrevResenias = Array.isArray(prevResenias) ? prevResenias : [];
        return [nuevaResenia, ...validPrevResenias]; // Trae todas las resenias de vuelta
      });      

      // Fetch adicional para obtener las últimas reseñas justo después de guardar la nueva
    try {
      const responseResenias = await fetch(`http://localhost:8080/api/resenia/usuario/${id_usuario}`);
      const dataResenias = await responseResenias.json();
      // Si no hay reseñas, asegurarse de que sea un arreglo vacío
      setResenias(Array.isArray(dataResenias) ? dataResenias : []);
    } catch (error) {
      console.error("Error al obtener las reseñas después de la publicación:", error);
    }

    } else {
      console.error("No se pudo obtener la reseña correctamente.");
    }
  };


  //modal para agregar un nuevo amigo
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveAmigo = (nuevaAmistad) => {
    console.log("Nueva Amistad:", nuevaAmistad);
  };

  const renderResenia = (textoResenia) => {
    const maxLength = 100; // Controla la cantidad de caracteres que se muestran antes de "Leer más"
    if (textoResenia && textoResenia.length > maxLength) {
      return textoResenia.slice(0, maxLength) + "...";
    }
    return textoResenia;
  };
  
  // Función para manejar el cambio de estado de expandir/contraer
  const toggleExpand = (id) => {
    setExpandedResenias((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Alterna el valor actual de expandir/contraer
    }));
  };

  return (
    <>
      <div className="container">
        <div className="profile-banner"></div>
        <div className="perfil">
          <div className="profile-pic"></div>
          <h1 className="profile-name">{perfil.nombre}</h1>
          <div className="row">
            <div className="col-sm-4 perfil-info">
              {perfil.libros}
              <span className="perfil-info-bubtitle">Leídos</span>
            </div>
            <div className="col-sm-4 perfil-info">
              {perfil.resenias}
              <span className="perfil-info-bubtitle">Reseñas</span>
            </div>
            <div className="col-sm-4 perfil-info">
              {perfil.amigos}
              <span className="perfil-info-bubtitle">Amigos</span>
            </div>
          </div>

          <button type="button" className="btn btn-primary m-1" onClick={handleOpenReseniaModal}>
            Agregar Reseña
          </button>
          <button type="button" className="btn btn-primary m-1" onClick={handleOpenModal}>
            Agregar Amigo
          </button>

          {/* Cuadros debajo de los botones */}
          <div className="resenia-cuadros">
            {/* Cuadro de resenias */}
            <div className="cuadro-resenia izquierda">
              <h4>Mis Reseñas</h4>
              {resenias.length > 0 ? (
                resenias.map((dataResenias, index) => (
                  <div key={index}>
                    <h5>{dataResenias.titulo || "Título no disponible"}</h5>
                    <p>
                      Clasificación:{" "}
                      <span className="stars">
                        {renderStars(dataResenias.clasificacion)}
                      </span>
                    </p>

                    {/* Acá empieza el texto de la reseña */}
                    <p 
                      className={`text-start ${expandedResenias[dataResenias.id_resenia] ? 'expanded' : ''}`}
                    >
                      {/* Si la reseña está expandida, se muestra todo el texto, 
                          si no, se muestra el texto truncado con "Leer más" */}
                      {expandedResenias[dataResenias.id_resenia] ? dataResenias.texto_resenia : renderResenia(dataResenias.texto_resenia)}
                    </p>

                    {/* Botón de "Leer más" o "Leer menos" */}
                    <button 
                      className="btn btn-primary" 
                      onClick={() => toggleExpand(dataResenias.id_resenia)}
                    >
                      {expandedResenias[dataResenias.id_resenia] ? "Leer menos" : "Leer más"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-resenias">No tienes reseñas aún.</p>
              )}
            </div>

            {/* Cuadro de la tabla de amigos */}
            <div className="cuadro-resenia derecha">
              <h4>Mis Amigos</h4>
              {/* Solo renderizamos la tabla si hay amigos */}
              {amigos.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amigos.map((amigo, index) => (
                      <tr key={index}>
                        <td>{amigo.nombre} {amigo.apellido}</td>
                        <td>Amigo</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-amigos">No tienes amigos aún.</p>
              )}
            </div>
          </div>

          {/* Cuadro de préstamos activos debajo */}
          <div className="cuadro-resenia cuadro-prestamos">
            <h4>Préstamos Activos</h4>
            {prestamos.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Título del Libro</th>
                    <th>Fecha de Préstamo</th>
                    <th>Fecha de Devolución</th>
                  </tr>
                </thead>
                <tbody>
                  {prestamos.map((prestamo, index) => (
                    <tr key={index}>
                      <td>{prestamo.titulo_libro}</td>
                      <td>{prestamo.fecha_prestamo}</td>
                      <td>{prestamo.fecha_devolucion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-prestamos">No tienes préstamos activos.</p>
            )}
          </div>
        </div>

        <AgregarAmigosModal
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSaveAmigo}
        />

        {/* Modal de Reseña */}
        <ReseñaModal
          show={showReseniaModal}
          handleClose={handleCloseReseniaModal}
          handleSave={handleSaveResenia}
          id_usuario={id_usuario} // Pasamos el id_usuario al modal
        />
      </div>
    </>
  );
}
