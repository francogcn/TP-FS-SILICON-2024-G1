export default function NewRelease({titulo,autor,genero}) {
  return (
    <>
       <div className="newRelease"> 
        <h1>{titulo}</h1>
        <h3 className="carrusel-autor">{autor}</h3>
        <span className="badge ">{genero}</span>
        </div>
    </>
  )
}
