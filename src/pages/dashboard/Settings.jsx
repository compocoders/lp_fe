import React from 'react';
import useThemeStore from '../../store/theme.store';
import { Settings as SettingsIcon, User, Moon, Sun, Monitor, Bell, Shield, ChevronRight } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#FAFCFA] dark:bg-[#121612] font-sans p-5 md:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#4A6447] dark:text-[#7A9A7B] tracking-tight flex items-center gap-3">
            <SettingsIcon size={24} />
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and application preferences.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Settings Nav (Desktop) */}
          <div className="hidden md:flex md:col-span-3 flex-col gap-1 sticky top-0">
            {[
              { id: 'appearance', label: 'Appearance', icon: Monitor },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border-none cursor-pointer text-left
                  ${id === 'appearance' 
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
            <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 flex items-center justify-center">
                  <Monitor className="text-[#5D7C59] dark:text-[#7A9A7B]" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appearance</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customize how Likhâ looks on your device.</p>
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

            {/* Profile Section Placeholder */}
            <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200 opacity-60">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                  <User className="text-gray-500 dark:text-gray-400" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Details</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information.</p>
                </div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center py-10">
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium text-center">Profile editing will be available soon.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
