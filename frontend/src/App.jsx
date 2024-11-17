import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "../src/pages/Home"
import Menu from "../src/components/Menu"
import NotFound from './pages/NotFound'
import './App.css'
import Perfil from './pages/Perfil'
import Prestamos from './pages/Prestamos'
import Books from './pages/Books'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp';
import Users from './pages/Users'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PrivateRoute } from './utils/PrivateRoute';


function App() {

  return (
    <>
      <Router>
        <Menu/>
        <ToastContainer/>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Rutas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:titulo" element={<Books />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/prestamos/:id" element={<Prestamos />} />
            <Route path="/usuarios" element={<Users />} />
          </Route>

          {/* Ruta para cuando no se encuentra la página */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
