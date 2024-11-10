import Busqueda from "../components/Busqueda";
import Carrousel from "../components/Carrousel";
import Footer from "../components/Footer";
import ReviewCard from "../components/ReviewCard";

export default function Home(){
    
    return(
        <>
            <div className="container">
                <Carrousel/>
                <Busqueda/>
                <ReviewCard/>
            </div>
            <Footer />
        </>
    )

}