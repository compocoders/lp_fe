import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import { getDashboardData } from '../../api/dashboard.api';
import { logout as logoutApi } from '../../api/auth.api';
import { useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import { Menu } from 'lucide-react';

const Mainpage = () => {
  const logout = useAuthStore((state) => state.logout);
  const [dashboardData, setDashboardData] = React.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = React.useCallback(async () => {
    try { await logoutApi(); } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    try { logout(); } catch (e) {}
    window.location.href = '/login';
  }, [logout]);

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          handleLogout();
        }
      }
    };
    fetchData();
  }, [handleLogout]);

  return (
    <div className="flex h-screen bg-[#FAFCFA] dark:bg-[#121612] overflow-hidden relative font-sans transition-colors duration-200">
      {/* Subtle dot grid background — same as landing page */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025] dark:opacity-10 transition-opacity duration-200"
        style={{
          backgroundImage: 'radial-gradient(#4A6447 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile, static on md+ */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
          dashboardData={dashboardData}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white dark:bg-[#1A211A] border-b border-gray-100 dark:border-white/10 shadow-sm shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-2.5">
            <img src="/image/logo.svg" alt="Likhā Logo" className="w-7 h-7" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="text-xl font-black text-[#4A6447] dark:text-[#7A9A7B] tracking-[0.2em]">LIKHÂ</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl text-[#4A6447] dark:text-[#7A9A7B] hover:bg-[#4A6447]/10 dark:hover:bg-white/10 transition-colors"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
