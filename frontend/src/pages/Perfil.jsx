import { useEffect, useState } from "react";
import AgregarAmigosModal from "../components/NuevoAmigoModal";
import ReseñaModal from "../components/NuevaReseniaModal";
import {jwtDecode} from "jwt-decode";
import { toast } from 'react-toastify';

export default function Perfil() {
  const token = sessionStorage.getItem("token");
  const decode = jwtDecode(token);

  // se obtiene el id_usuario logueado mediante su token decodificado
  const id_usuario = decode.id_usuario;

  const [perfil, setPerfil] = useState([]);
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
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };
    fetchProfile();
  }, [id_usuario]);

  const handleOpenReseniaModal = () => setShowReseniaModal(true);
  const handleCloseReseniaModal = () => setShowReseniaModal(false);

  const handleSaveResenia = (nuevaResenia) => {
    toast.success("Reseña publicada");
    console.log("Reseña publicada exitosamente: ", nuevaResenia);
    // Lugar para agregar código para actualizar el estado o hacer algo más con la nueva reseña
  };


  //modal para agregar un nuevo amigo
  // const [showModal, setShowModal] = useState(false);

  // const handleOpenModal = () => setShowModal(true);
  // const handleCloseModal = () => setShowModal(false);

  // const handleSaveAmigo = (nuevaAmistad) => {
  //   console.log("Nueva Amistad:", nuevaAmistad);
  // };

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
            // onClick={handleOpenModal}
          >
            Agregar Amigo
          </button>
          {/* <AgregarAmigosModal
            show={showModal}
            handleClose={handleCloseModal}
            handleSave={handleSaveAmigo}
            /> */}
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
