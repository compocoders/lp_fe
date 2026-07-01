import React, { useState, useEffect, useRef } from 'react';
import useThemeStore from '../../store/theme.store';
import { Settings as SettingsIcon, User, Moon, Sun, Monitor, Bell, Shield, Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getProfile, updateProfile } from '../../api/profile.api';
import { updatePassword, getMe } from '../../api/auth.api';
import UpdateEmailModal from '../../components/settings/UpdateEmailModal';

const Settings = () => {
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#FAFCFA] dark:bg-[#121612] font-sans p-4 sm:p-5 md:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-5 md:gap-8">
        
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#4A6447] dark:text-[#7A9A7B] tracking-tight flex items-center gap-2 sm:gap-3">
            <SettingsIcon size={24} />
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and application preferences.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8">
          
          {/* Settings Nav */}
          <div className="md:col-span-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible static md:sticky md:top-0 pb-2 md:pb-0 z-10 bg-[#FAFCFA] dark:bg-[#121612]">
            {[
              { id: 'appearance', label: 'Appearance', icon: Monitor },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'security', label: 'Security', icon: Shield },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer whitespace-nowrap text-left
                  ${activeTab === id 
                    ? 'bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B]' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Settings Panes */}
          <div className="col-span-1 md:col-span-9 flex flex-col gap-6">
            
            {/* Appearance Section */}
            {activeTab === 'appearance' && (
              <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 flex items-center justify-center">
                    <Monitor className="text-[#5D7C59] dark:text-[#7A9A7B]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appearance</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customize how L I K H Â looks on your device.</p>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col gap-6">
                  <div>
                    <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest mb-3 block">Theme</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {/* Light Mode Card */}
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer bg-[#FAFCFA] dark:bg-[#121612]
                          ${theme === 'light' 
                            ? 'border-[#5D7C59] ring-2 ring-[#5D7C59]/20' 
                            : 'border-gray-200 dark:border-white/10 hover:border-[#5D7C59]/40'
                          }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-1">
                          <Sun className="text-yellow-600" size={24} />
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Light</span>
                      </button>

                      {/* Dark Mode Card */}
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer bg-[#FAFCFA] dark:bg-[#121612]
                          ${theme === 'dark' 
                            ? 'border-[#5D7C59] ring-2 ring-[#5D7C59]/20' 
                            : 'border-gray-200 dark:border-white/10 hover:border-[#5D7C59]/40'
                          }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#1A211A] border border-white/10 flex items-center justify-center mb-1">
                          <Moon className="text-[#7A9A7B]" size={22} />
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Dark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Section */}
            {activeTab === 'profile' && <ProfileSettings />}

            {/* Security Section */}
            {activeTab === 'security' && <SecuritySettings />}

          </div>
        </div>

      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', status: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          setProfileData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            status: data.status || ''
          });
          setPreviewUrl(data.profilePicture);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const submitData = new FormData();
      Object.keys(profileData).forEach(key => submitData.append(key, profileData[key]));
      if (profilePicture) {
        submitData.append('profilePicture', profilePicture);
      }
      
      await updateProfile(submitData);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <User className="text-blue-500 dark:text-blue-400" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Details</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information.</p>
        </div>
      </div>
      
      <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
        
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-50 dark:border-[#242C24] overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center relative">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Profile Picture</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Change Picture
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleChange}
              placeholder="e.g. Juan"
              className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5D7C59]/30 focus:border-[#5D7C59] outline-none text-gray-900 dark:text-white transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleChange}
              placeholder="e.g. Dela Cruz"
              className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5D7C59]/30 focus:border-[#5D7C59] outline-none text-gray-900 dark:text-white transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Account Status</label>
          <div className="px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm font-medium cursor-not-allowed">
            <div className={`w-2.5 h-2.5 rounded-full ${profileData.status === 'suspended' ? 'bg-red-500' : 'bg-green-500'}`} />
            {profileData.status && profileData.status !== 'feeling productive!' ? profileData.status.charAt(0).toUpperCase() + profileData.status.slice(1) : 'Active'}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-white/10">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#5D7C59] hover:bg-[#4A6447] text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

const SecuritySettings = () => {
  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [currentEmail, setCurrentEmail] = useState('');
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  
  const [emailSuccessMsg, setEmailSuccessMsg] = useState('');
  const [pwStatus, setPwStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMe();
        if (data && data.user) {
          setCurrentEmail(data.user.email);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    };
    fetchMe();
  }, []);

  const handleEmailUpdated = (newEmail) => {
    setCurrentEmail(newEmail);
    setEmailSuccessMsg('Email updated successfully!');
    setTimeout(() => setEmailSuccessMsg(''), 4000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      setPwStatus({ type: 'error', msg: 'New passwords do not match' });
      return;
    }
    setPwLoading(true);
    setPwStatus({ type: '', msg: '' });
    try {
      await updatePassword({
        currentPassword: pwData.currentPassword,
        newPassword: pwData.newPassword
      });
      setPwStatus({ type: 'success', msg: 'Password updated successfully!' });
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwStatus({ type: '', msg: '' }), 4000);
    } catch (err) {
      setPwStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Change Email */}
      <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
            <Shield className="text-orange-500 dark:text-orange-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Change Email Address</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current email: <span className="font-semibold text-gray-700 dark:text-gray-300">{currentEmail || 'Loading...'}</span></p>
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-5">
          {emailSuccessMsg && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              {emailSuccessMsg}
            </div>
          )}
          
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="px-5 py-2.5 bg-[#5D7C59] hover:bg-[#4A6447] text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
              Update Email
            </button>
          </div>
        </div>
      </div>

      <UpdateEmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        currentEmail={currentEmail}
        onEmailUpdated={handleEmailUpdated}
      />

      {/* Change Password */}
      <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
            <Shield className="text-purple-500 dark:text-purple-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Change Password</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ensure your account is using a long, random password to stay secure.</p>
          </div>
        </div>
        
        <form onSubmit={handlePasswordChange} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 max-w-sm">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              type="password"
              required
              value={pwData.currentPassword}
              onChange={(e) => setPwData(p => ({ ...p, currentPassword: e.target.value }))}
              className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5D7C59]/30 focus:border-[#5D7C59] outline-none text-gray-900 dark:text-white transition-all text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={pwData.newPassword}
                onChange={(e) => setPwData(p => ({ ...p, newPassword: e.target.value }))}
                className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5D7C59]/30 focus:border-[#5D7C59] outline-none text-gray-900 dark:text-white transition-all text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={pwData.confirmPassword}
                onChange={(e) => setPwData(p => ({ ...p, confirmPassword: e.target.value }))}
                className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5D7C59]/30 focus:border-[#5D7C59] outline-none text-gray-900 dark:text-white transition-all text-sm"
              />
            </div>
          </div>

          {pwStatus.msg && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${pwStatus.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
              {pwStatus.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              {pwStatus.msg}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={pwLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#5D7C59] hover:bg-[#4A6447] text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {pwLoading ? <Loader2 size={18} className="animate-spin" /> : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Settings;
