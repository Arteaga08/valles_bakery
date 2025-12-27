import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  // Verificamos si existe el token en el almacenamiento local
  const adminToken = localStorage.getItem("adminToken");

  // Si hay token, permitimos el paso a las rutas hijas (Outlet)
  // Si no, redirigimos al login
  return adminToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
