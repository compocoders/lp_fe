import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check localStorage for 'user' as the source of truth for authentication,
  // consistent with LoginPage and Mainpage.
  const isAuthenticated = !!localStorage.getItem('user');

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;

