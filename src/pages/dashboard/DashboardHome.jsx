import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import ClassCard from '../../components/dashboard/ClassCard';
import Loading from '../../components/common/Loading';
import CreateClassroomModal from '../../components/dashboard/CreateClassroomModal';
import ProfileCard from '../../components/dashboard/ProfileCard';
import PullToRefresh from '../../components/common/PullToRefresh';
import { getDashboardData } from '../../api/dashboard.api';
const DashboardHome = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardData();
      setDashboardData(response);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLeaveClassroom = async (classroomId) => {
    try {
      if (window.confirm('Are you sure you want to leave this classroom?')) {
        setIsProcessing(true);
        await import('../../api/classroom.api').then(m => m.leaveClassroom(classroomId));
        await fetchDashboardData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave classroom');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareClassroom = async (classroomId) => {
    try {
      setIsProcessing(true);
      const { generateInviteLink } = await import('../../api/classroom.api');
      const { token } = await generateInviteLink(classroomId);
      const link = `${window.location.origin}/join/${token}`;
      navigator.clipboard.writeText(link);
      alert('Invite link copied to clipboard!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate invite link');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardData().finally(() => setIsLoading(false));
  }, []);

  return (
    <PullToRefresh 
      onRefresh={fetchDashboardData} 
      className="flex-1 h-full font-sans shadow-[-5px_0_15px_rgba(0,0,0,0.05)]"
    >
      <div className="p-4 md:p-6 h-full relative">
        <div className="flex flex-wrap justify-between items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#517559] m-0">Home</h1>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-[#89a88c] bg-transparent border-none cursor-pointer hover:text-[#517559] transition-colors p-1"
          >
            <Plus size={28} />
          </button>
          <button className="text-[#89a88c] bg-transparent border-none cursor-pointer hover:text-[#517559] transition-colors p-1">
            <Sparkles size={28} />
          </button>
          <div 
            onClick={() => setIsProfileCardOpen(true)}
            className="w-11 h-11 shrink-0 rounded-full bg-[#d1d5db] cursor-pointer ml-2 shadow-sm border-2 border-white overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-[#517559] hover:ring-offset-2 transition-all"
          >
            {dashboardData?.profile?.profilePicture && (
              <img
                src={dashboardData.profile.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading text="Loading Classes..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData?.classrooms?.map((cls) => (
            <ClassCard
              key={cls.id}
              title={cls.name}
              section={cls.description}
              teacher={cls.User?.profile ? `${cls.User.profile.firstName} ${cls.User.profile.lastName}` : 'Unknown Teacher'}
              letter={cls.name.charAt(0).toUpperCase()}
              isOwner={cls.userId === dashboardData?.id}
              onClick={() => navigate(`/dashboard/classroom/${cls.roomCode}`)}
              onShare={() => handleShareClassroom(cls.id)}
              onLeave={() => handleLeaveClassroom(cls.id)}
            />
          ))}
        </div>
      )}

      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchDashboardData}
      />

      <ProfileCard 
        isOpen={isProfileCardOpen} 
        onClose={() => setIsProfileCardOpen(false)} 
        user={dashboardData} 
      />
      </div>
    </PullToRefresh>
  );
};

export default DashboardHome;
