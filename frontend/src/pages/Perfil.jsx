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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/usuario/perfil/${id_usuario}`
        );
        const data = await response.json();
        console.log(data); // inspección de la info del usuario apenas llega del fetch
        setPerfil(data);

         // traemos las últimas reseñas
        const responseResenias = await fetch(`http://localhost:8080/api/resenia/usuario/${id_usuario}`);
        const dataResenias = await responseResenias.json();
        console.log("dataResenias: ", dataResenias); // inspección de las reseñas

        setResenias(dataResenias);  // Guarda las reseñas en su estado


        // Obtener los amigos del usuario
        const responseAmigos = await fetch(
          `http://localhost:8080/api/amistad/listar/${id_usuario}`
        );
        const dataAmigos = await responseAmigos.json();
        setAmigos(dataAmigos); // Guardamos los amigos en el estado

      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    fetchProfile();
  }, [id_usuario]);

  const handleOpenReseniaModal = () => setShowReseniaModal(true);
  const handleCloseReseniaModal = () => setShowReseniaModal(false);

  const handleSaveResenia = async (respuestaDelBackend) => {
    toast.success("Reseña publicada");
    console.log("Reseña publicada exitosamente: ", respuestaDelBackend);
  
    const nuevaResenia = respuestaDelBackend.detail[0]; // El primer objeto en el arreglo "detail"
    
    // Verificamos que nuevaResenia tenga datos válidos antes de actualizar el estado
    if (nuevaResenia) {
      // Agrega la nueva reseña al principio de la lista y limita el número de reseñas a las últimas 5
      setResenias(prevResenias => [nuevaResenia, ...prevResenias].slice(0, 5)); 

      // Fetch adicional para obtener las últimas reseñas justo después de guardar la nueva
    try {
      const responseResenias = await fetch(`http://localhost:8080/api/resenia/usuario/${id_usuario}`);
      const dataResenias = await responseResenias.json();
      setResenias(dataResenias);
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

  return (
    <>
      <div className="container">
        <div className="profile-banner"></div>
        <div className="perfil">
          <div className="profile-pic"></div>
          <h1>{perfil.nombre}</h1>
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
          <button
            type="button"
            className="btn btn-primary m-1"
            onClick={handleOpenModal}
          >
            Agregar Amigo
          </button>

          {/* Cuadros de reseñas debajo de los botones */}
        <div className="resenia-cuadros">
          {/* Cuadro de las reseñas */}
          <div className="cuadro-resenia izquierda">
              <h4>Últimas Reseñas</h4>
              {resenias.length > 0 ? (
                  resenias.map((dataResenias, index) => (
                      <div key={index}>
                          <h5>{dataResenias.titulo || 'Título no disponible'}</h5>
                          <p>{`Clasificación: ${dataResenias.clasificacion || 'No disponible'} estrellas`}</p>
                          <p>{dataResenias.texto_resenia || 'No hay reseña disponible'}</p>
                      </div>
                  ))
              ) : (
                  <p>No tienes reseñas aún.</p>
              )}
          </div>

          {/* Cuadro de la tabla de amigos */}
          <div className="cuadro-resenia derecha">
              <h4>Mis Amigos</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {amigos.length > 0 ? (
                    amigos.map((amigo, index) => (
                      <tr key={index}>
                        <td>{amigo.nombre} {amigo.apellido}</td>
                        <td>Amigo</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No tienes amigos aún.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          
        <AgregarAmigosModal
            show={showModal}
            handleClose={handleCloseModal}
            handleSave={handleSaveAmigo}
            />
        </div>

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
