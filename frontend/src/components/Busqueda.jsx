import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom";

export default function Busqueda() {
    const [inputValue, setInputValue] = useState("");
    const [results, setResults] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (inputValue) {
                try{
                    const response = await fetch(`http://localhost:8080/api/libros`);
                    const data = await response.json();
                    // Filtrar los resultados según el inputValue
                    const filteredResults = data.filter(libro => libro.titulo.toLowerCase().includes(inputValue.toLowerCase()));
                    // Setear los resultados al estado
                    setResults(filteredResults);

                }
             catch(error){
                console.error("Error al obtener los resultados:", error);
                setResults([]);} 
            } else {
                setResults([]);
            }
        }
        fetchData();
    },[inputValue])
    useEffect(() => {
        console.log(results); // Inspección de la información obtenida del fetch
    }, [results])
    
    return (
        <>
            <div className="row busqueda">
                <div className="input-group">
                    <input className="form-control" 
                        type="text" 
                        placeholder="¿Qué vas a leer hoy?"
                        value={inputValue} 
                        onChange={(e)=>{setInputValue(e.target.value)}}/>
                    
                    <button className="btn btn-outline-secondary">
                        <NavLink to={"books/titulo/"+encodeURI(inputValue)}>Buscar</NavLink>
                    </button>   
                    
                </div>
                <div className="row resultados-busqueda">
                        {results.map((resultado)=>{
                            return <div 
                            key={resultado.id_libro}
                            onClick={()=>{setInputValue(resultado.titulo)}}
                            
                            >{resultado.titulo}</div>
                        })}  
                </div>
            </div>
        </>
    )
}
