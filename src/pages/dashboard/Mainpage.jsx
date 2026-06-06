import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';
import { getDashboardData } from '../../api/dashboard.api';
import { logout as logoutApi } from '../../api/auth.api';
import { useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import { Menu, X } from 'lucide-react';

const Mainpage = () => {
  const logout = useAuthStore((state) => state.logout);
  const [dashboardData, setDashboardData] = React.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

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
        setUser(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try { await logoutApi(); } catch (e) {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    try { logout(); } catch (e) {}
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-[#517559] overflow-hidden relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar container - fixed on mobile, static on md+ */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} dashboardData={dashboardData} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#517559] flex flex-col md:pt-4 md:pr-4 md:pb-4 md:pl-0 pt-0 pr-0 pb-0 pl-0 w-full md:w-auto h-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 text-white bg-[#517559]">
          <div className="text-xl font-bold tracking-widest">LIKHÂ</div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Dashboard Content Container */}
        <div className="flex-1 overflow-hidden rounded-t-[30px] md:rounded-tl-[30px] md:rounded-tr-none bg-[#d9e2d5]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
