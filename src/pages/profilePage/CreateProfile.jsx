import React, { useState, useEffect } from 'react';
import { createProfile, profilepage, uploadProfilePicture } from '../../api/profile.api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function CreateProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '',
    age: '',
  });
  const [profilePicture, setprofilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setprofilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { age, ...profileData } = formData;
      let submitData = profileData;

      if (profilePicture) {
        submitData = new FormData();
        Object.keys(profileData).forEach(key => submitData.append(key, profileData[key]));
        submitData.append('profilePicture', profilePicture);
      }

      const response = await createProfile(submitData);

      console.log('Profile created:', response);
      navigate('/dashboard'); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create profile. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  const checkProfile = async () => {
    try {
      const profile = await profilepage();
      if (profile) {
        navigate('/'); // Redirect to dashboard if profile exists
      }
    } catch (err) {
      console.error('Error checking profile:', err);
      //return to login if error is 401 (unauthorized), otherwise just stay on the page and let them create profile
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  checkProfile();
}, [navigate]);


  return (
    <div className="min-h-screen bg-white font-sans px-8 sm:px-16 md:px-24 py-10 overflow-hidden flex flex-col">
      {/* Header / Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate('/')} 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity self-start"
      >
        <img src="/image/logo.svg" alt="Likhā Logo" className="w-10 h-10 md:w-12 md:h-12 drop-shadow-sm" />
        <span className="text-xl md:text-2xl font-black text-[#698864] tracking-[0.25em]">L I K H Â</span>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center mt-12 lg:mt-20 max-w-5xl mx-auto w-full"
      >
        <motion.div variants={fadeUpVariant} className="text-center mb-16">
          <h1 className="text-4xl md:text-[2.75rem] font-extrabold text-[#52704E] mb-4 tracking-tight">Set up your profile</h1>
          <p className="text-[#849D80] text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto">
            To help others in the app recognize you, take a quick moment to set up your profile.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full">
          {error && (
            <motion.div variants={fadeUpVariant} className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center border border-red-100 font-medium mb-8 max-w-md mx-auto">
              {error}
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-start w-full justify-center">
            
            {/* Left Column: Form Fields */}
            <div className="w-full md:w-[380px] space-y-6 flex-shrink-0">
              <motion.div variants={fadeUpVariant} className="space-y-2">
                <label className="text-[#698864] font-bold text-sm ml-1 block">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter your first name"
                  className="w-full bg-[#F4F5F4] text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#698864]/30 transition-all font-medium placeholder-gray-400 border-none"
                />
              </motion.div>

              <motion.div variants={fadeUpVariant} className="space-y-2">
                <label className="text-[#698864] font-bold text-sm ml-1 block">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter your last name"
                  className="w-full bg-[#F4F5F4] text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#698864]/30 transition-all font-medium placeholder-gray-400 border-none"
                />
              </motion.div>

              <motion.div variants={fadeUpVariant} className="space-y-2">
                <label className="text-[#698864] font-bold text-sm ml-1 block">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter your age"
                  className="w-full bg-[#F4F5F4] text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#698864]/30 transition-all font-medium placeholder-gray-400 border-none"
                />
              </motion.div>

              <motion.div variants={fadeUpVariant} className="pt-4 hidden md:block">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#7C9A76] hover:bg-[#698864] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center text-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? 'Saving...' : 'Done'}
                </button>
              </motion.div>
            </div>

            {/* Right Column: Profile Picture Upload */}
            <motion.div variants={fadeUpVariant} className="w-full md:w-[420px] flex-shrink-0 flex flex-col items-center md:mt-2">
              <div className="w-full aspect-[4/3] bg-[#D9D9D9] rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#D0D0D0] transition-colors relative group shadow-inner overflow-hidden">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
                    <path d="M18 10C13.5817 10 10 13.5817 10 18V75H18V18C18 18 18 18 18 18H75V10H18Z" fill="white"/>
                    <rect x="25" y="25" width="65" height="50" rx="4" fill="white"/>
                    <circle cx="57.5" cy="40" r="7.5" fill="#D9D9D9"/>
                    <path d="M38.5 62C38.5 54.5442 44.5442 48.5 52 48.5H63C70.4558 48.5 76.5 54.5442 76.5 62V65H38.5V62Z" fill="#D9D9D9"/>
                  </svg>
                )}
              </div>
              <p className="mt-5 text-center text-[#52704E] font-medium text-sm md:text-base max-w-[280px] leading-snug">
                Drag and drop your profile picture here, or click to upload
              </p>
            </motion.div>

          </div>

          {/* Mobile Done Button (Shows below upload box on small screens) */}
          <motion.div variants={fadeUpVariant} className="pt-10 block md:hidden w-full max-w-[380px] mx-auto">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7C9A76] hover:bg-[#698864] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center text-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? 'Saving...' : 'Done'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
