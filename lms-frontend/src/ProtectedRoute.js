import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // If a token exists, allow access to the requested page (Outlet).
  // If not, redirect the user to the login page.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;