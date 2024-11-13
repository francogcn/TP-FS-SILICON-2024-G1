import { useEffect, useState } from "react";
import AgregarAmigosModal from "../components/NuevoAmigoModal";
import {jwtDecode} from "jwt-decode";

export default function Perfil() {
  const token = sessionStorage.getItem("token");
  const decode = jwtDecode(token);
  console.log(decode);
  const [perfil, setPerfil] = useState([]);
  const id_usuario = 2; //Esto se debe automatizar

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/usuario/perfil/${id_usuario}`
        );
        const data = await response.json();
        setPerfil(data);
      } catch (error) {
        console.error("Error al obtener los préstamos:", error);
      }
    };
    fetchProfile();
  }, []);

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

          <button type="button" className="btn btn-primary m-1">
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
      </div>
    </>
  );
}
