export default function Perfil() {
  return (
    <>
    
    <div className="container">
    <div className="profile-banner"></div>
      <div className="perfil">
        <div className="profile-pic"></div>
        <h1>Username</h1>
        <div className="row">
          <div className="col-sm-4 perfil-info">
            20
            <span className="perfil-info-bubtitle">Leídos</span>
          </div>
          <div className="col-sm-4 perfil-info">
            15
            <span className="perfil-info-bubtitle">Reseñas</span>
            </div>
          <div className="col-sm-4 perfil-info">
            3
            <span className="perfil-info-bubtitle">Amigos</span>
            </div>
        </div>
        <button type="button" className="btn btn-info">Agregar</button>
      </div>
    </div>
    </>
  )
}
