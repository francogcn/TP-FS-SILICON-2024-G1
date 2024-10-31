import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "../src/pages/Home"
import Menu from "../src/components/Menu"
import NotFound from './pages/NotFound'
import './App.css'
import Perfil from './pages/Perfil'

function App() {

  return (
    <>
      <Router>
        <Menu/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
