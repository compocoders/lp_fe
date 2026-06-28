import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Users, Sparkles, BookOpen, Search, Hand, LogOut, AlertTriangle, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import ClassCard from '../../components/dashboard/ClassCard';
import Loading from '../../components/common/Loading';
import CreateClassroomModal from '../../components/dashboard/CreateClassroomModal';
import JoinRoomModal from '../../components/dashboard/JoinRoomModal';
import ProfileCard from '../../components/dashboard/ProfileCard';
import PullToRefresh from '../../components/common/PullToRefresh';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getDay = () => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const { dashboardData, fetchDashboardData } = useOutletContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmLeave, setConfirmLeave] = useState(null); // { classroomId, name }

  const handleLeaveClassroom = async (classroomId) => {
    try {
      setIsProcessing(true);
      setConfirmLeave(null);
      await import('../../api/classroom.api').then(m => m.leaveClassroom(classroomId));
      await fetchDashboardData();
      toast.success('You have left the classroom.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to leave classroom');
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
      toast.success('Invite link copied to clipboard!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate invite link');
    } finally {
      setIsProcessing(false);
    }
  };

  const firstName = dashboardData?.profile?.firstName || 'there';
  const allClassrooms = dashboardData?.classrooms || [];
  const filtered = searchQuery.trim()
    ? allClassrooms.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : allClassrooms;

  const enrolledCount = allClassrooms.filter(c => c.userId !== dashboardData?.id).length;
  const teachingCount = allClassrooms.filter(c => c.userId === dashboardData?.id).length;

  return (
    <PullToRefresh
      onRefresh={fetchDashboardData}
      className="flex-1 h-full"
    >
      <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 md:py-8">

          {/* ── Header Banner ── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#5D7C59] to-[#4A6447] rounded-2xl md:rounded-[1.75rem] p-6 md:p-8 mb-8 shadow-lg">
            {/* Blob decorations */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#7A9A7B]/40 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 right-1/3 w-32 h-32 rounded-full bg-[#FFC700]/10 blur-xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-wide mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700] animate-pulse" />
                  {getDay()}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight flex items-center gap-2.5 flex-wrap">
                  {getGreeting()}, <span className="capitalize">{firstName}</span>
                  <Hand size={26} className="text-[#FFC700] shrink-0" strokeWidth={2} />
                </h1>
                <p className="text-white/75 text-sm mt-1.5 font-medium">
                  You have <strong className="text-white">{allClassrooms.length}</strong> classroom{allClassrooms.length !== 1 ? 's' : ''} —{' '}
                  {enrolledCount} enrolled, {teachingCount} teaching.
                </p>
              </div>

              {/* Profile + Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm"
                >
                  <Link2 size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Join Room</span>
                  <span className="sm:hidden">Join</span>
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FFC700] hover:bg-[#FFD633] text-gray-900 rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Create Class</span>
                  <span className="sm:hidden">New</span>
                </button>
                
                <div
                  onClick={() => setIsProfileCardOpen(true)}
                  className="w-10 h-10 shrink-0 rounded-full bg-white/20 cursor-pointer border-2 border-white/30 overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-transparent transition-all"
                >
                  {dashboardData?.profile?.profilePicture ? (
                    <img
                      src={dashboardData.profile.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm uppercase">
                      {firstName.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: BookOpen, label: 'Enrolled', count: enrolledCount, color: 'text-[#5D7C59]', bg: 'bg-[#5D7C59]/8' },
              { icon: Users, label: 'Teaching', count: teachingCount, color: 'text-[#4A6447]', bg: 'bg-[#4A6447]/8' },
              { icon: Sparkles, label: 'Total', count: allClassrooms.length, color: 'text-[#FFC700]', bg: 'bg-[#FFC700]/10' },
            ].map(({ icon: Icon, label, count, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4 md:p-5 flex items-center gap-4 border border-gray-100 dark:border-white/5 transition-colors duration-200`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon size={20} className={color} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Search & Section Title ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white transition-colors duration-200">Your Classrooms</h2>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classrooms..."
                className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] focus:ring-2 focus:ring-[#5D7C59]/20 transition-all w-full sm:w-56 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          {/* ── Class Grid ── */}
          {!dashboardData ? (
            <Loading text="Loading Classes..." />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((cls) => (
                <ClassCard
                  key={cls.id}
                  title={cls.name}
                  section={cls.description}
                  teacher={cls.User?.profile ? `${cls.User.profile.firstName} ${cls.User.profile.lastName}` : 'Unknown Teacher'}
                  letter={cls.name.charAt(0).toUpperCase()}
                  isOwner={cls.userId === dashboardData?.id}
                  onClick={() => navigate(`/dashboard/classroom/${cls.roomCode}`)}
                  onShare={() => handleShareClassroom(cls.id)}
                  onLeave={() => setConfirmLeave({ classroomId: cls.id, name: cls.name })}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#5D7C59]/10 flex items-center justify-center mb-5">
                <BookOpen size={36} className="text-[#5D7C59]" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-200">
                {searchQuery ? 'No classrooms found' : 'No classrooms yet'}
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mb-6 transition-colors duration-200">
                {searchQuery
                  ? `No classrooms match "${searchQuery}". Try a different search.`
                  : 'Create your first classroom or ask a teacher for an invite link to get started.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#5D7C59] hover:bg-[#4A6447] text-white rounded-xl text-sm font-bold transition-all shadow-md hover:-translate-y-0.5"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Create your first classroom
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchDashboardData();
        }}
      />

      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      <ProfileCard
        isOpen={isProfileCardOpen}
        onClose={() => setIsProfileCardOpen(false)}
        profile={dashboardData?.profile}
        email={dashboardData?.email}
      />

      {/* Leave Classroom Confirm Dialog */}
      {confirmLeave && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white dark:bg-[#1A211A] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-6 max-w-sm w-full flex flex-col gap-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center mx-auto">
              <LogOut size={26} className="text-amber-500" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Leave Classroom?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You'll be removed from <span className="font-semibold text-gray-700 dark:text-gray-300">"{confirmLeave.name}"</span>. You can rejoin later with an invite link.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmLeave(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLeaveClassroom(confirmLeave.classroomId)}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 border-none disabled:opacity-60"
              >
                {isProcessing ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <LogOut size={14} />}
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </PullToRefresh>
  );
};

export default DashboardHome;
