import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getMe } from '../../api/auth.api';

const ProtectedRoute = () => {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    // Optimistically read from localStorage on first render
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Always fetch fresh user state from the server on every protected route visit.
    // This ensures hasProfile, isEmailVerified, etc. are always accurate — never stale.
    const checkAuth = async () => {
      try {
        const data = await getMe();
        const freshUser = data.user;
        localStorage.setItem('user', JSON.stringify(freshUser));
        setUser(freshUser);
      } catch {
        // getMe returned 401 → session is invalid, clear everything
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Cycle through some nice loading messages so it feels less boring
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingMessages = [
    "Authenticating session...",
    "Securing connection...",
    "Loading your workspace..."
  ];

  useEffect(() => {
    if (!isChecking) return;
    const interval = setInterval(() => {
      setLoadingTextIndex(prev => (prev + 1) % loadingMessages.length);
    }, 1500); // Change text every 1.5 seconds
    return () => clearInterval(interval);
  }, [isChecking]);

  // While we're confirming the session with the server, show a nice spinner with text
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#F4F5F4',
        gap: '16px'
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #698864',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{
          color: '#52704E',
          fontWeight: 600,
          fontSize: '14px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}>
          {loadingMessages[loadingTextIndex]}
        </p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        `}</style>
      </div>
    );
  }

  // No valid session
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Email not verified → lock to verify-email page
  if (user.isEmailVerified === false && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  // Verified but no profile → lock to profile creation from ANYWHERE in the app
  if (user.isEmailVerified === true && !user.hasProfile && location.pathname !== '/createProfile') {
    return <Navigate to="/createProfile" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

