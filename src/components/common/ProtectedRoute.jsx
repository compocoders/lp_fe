import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but not email verified, lock them to the verify-email page
  if (user && user.isEmailVerified === false && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  // Render children routes if authenticated and verified
  return <Outlet />;
};

export default ProtectedRoute;

