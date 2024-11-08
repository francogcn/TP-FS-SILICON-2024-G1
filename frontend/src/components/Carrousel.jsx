import NewRelease from "./NewRelease";

export default function Carrousel() {
    return (
        <>
            <div id="nuevosLibros" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#nuevosLibros" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#nuevosLibros" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#nuevosLibros" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                    <NewRelease
                         titulo = "Harry Potter and the Cursed Child"
                         autor = "J.K Rowling"
                         genero = "Juvenil"

                        />
                    </div>
                    <div className="carousel-item">
                    
                        <NewRelease
                         titulo = "Manual del Ingeniero Químico"
                         autor = "S.H Perry"
                         genero = "Técnico"

                        />
                    </div>
                    <div className="carousel-item">
                    <NewRelease
                         titulo = "El Origen de las Especies"
                         autor = "Charles Darwin"
                         genero = "Técnico"

                        />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#nuevosLibros" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#nuevosLibros" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    )
}
