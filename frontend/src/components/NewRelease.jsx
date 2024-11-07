export default function NewRelease({titulo,autor,genero}) {
  return (
    <>
       <div className="newRelease"> 
        <h1>{titulo}</h1>
        <h3>{autor}</h3>
        <span className="badge text-bg-secondary">{genero}</span>
        </div>
    </>
  )
}
