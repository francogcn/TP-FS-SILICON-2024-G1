import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "../src/pages/Home"
import Menu from "../src/components/Menu"
import NotFound from './pages/NotFound'
import './App.css'
import Perfil from './pages/Perfil'
import Prestamos from './pages/Prestamos'
import Books from './pages/Books'


function App() {

  return (
    <>
      <Router>
        <Menu/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/prestamos" element={<Prestamos/>} />
          <Route path="/prestamos/:id" element={<Prestamos/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
