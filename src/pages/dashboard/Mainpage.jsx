import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import { getDashboardData } from '../../api/dashboard.api';
import { logout as logoutApi } from '../../api/auth.api';
import { useEffect } from 'react';
const Mainpage = () => {
  const logout = useAuthStore((state) => state.logout);
  const [dashboardData, setDashboardData] = React.useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Route Guard: if no user in localStorage, immediately kick them out!
    if (!localStorage.getItem('user')) {
      navigate('/login');
      return;
    }

    const getdashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        console.log('Dashboard Data:', data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        navigate('/login');
      }
    };
    getdashboardData();
  }, [navigate]);
  const handleLogout = async () => {
    console.log('Logging out...');
    
    // 1. Clear backend HttpOnly cookie so `getDashboardData` will fail next time
    try {
      await logoutApi();
    } catch (e) {
      console.error('Backend logout error:', e);
    }

    // 2. Clear frontend state completely
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    try {
      logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    
    // Hard redirect to bypass any router-level caching or hooks that might block it
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <h1>Dashboard Main Page</h1>
      <p>Welcome to the learning platform!</p>
      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Mainpage;
