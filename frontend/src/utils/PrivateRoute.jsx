import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = sessionStorage.getItem('token');
  
  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderiza las rutas hijas (Outlet)
  return <Outlet />;
}

export { PrivateRoute };
