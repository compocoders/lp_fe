import React, { useState, useEffect } from 'react';
import { useNavigate, Link, } from 'react-router-dom';
import { login } from '../../api/auth.api';
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

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/dashboard'); // Redirect to dashboard if user is already logged in
    }
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      
      // Store token in cookies and user in native localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('Login successful:', response);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error('Login failed:', err);
      // Display error to the user
      setError(
        err.response?.data?.message || err.message || 'An error occurred during login.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans overflow-hidden">
      
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 sm:px-16 md:px-24 py-10 relative">
        
        {/* Branding */}
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

        {/* Form Container */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full mt-10 lg:mt-0"
        >
          <motion.div variants={fadeUpVariant} className="text-center mb-10">
            <h1 className="text-4xl md:text-[2.75rem] font-extrabold text-[#52704E] mb-4 tracking-tight">Welcome</h1>
            <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-[260px] mx-auto">
              Welcome back, Please Enter your details below
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center border border-red-100 font-medium">
                {error}
              </motion.div>
            )}

            <motion.div variants={fadeUpVariant} className="space-y-2">
              <label className="text-[#698864] font-bold text-sm ml-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your email"
                className="w-full bg-[#F4F5F4] text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#698864]/30 transition-all font-medium placeholder-gray-400 border-none"
              />
            </motion.div>

            <motion.div variants={fadeUpVariant} className="space-y-2">
              <label className="text-[#698864] font-bold text-sm ml-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your password"
                className="w-full bg-[#F4F5F4] text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#698864]/30 transition-all font-medium placeholder-gray-400 border-none"
              />
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#7C9A76] hover:bg-[#698864] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 disabled:opacity-70 flex justify-center items-center text-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </motion.div>
          </form>

          <motion.p variants={fadeUpVariant} className="text-center mt-8 text-sm text-gray-800 font-bold">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#698864] hover:underline underline-offset-4 font-bold">
              Register here
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Right Column: Background Image */}
      <motion.div 
        variants={slideFromRight}
        initial="hidden"
        animate="visible"
        className="hidden lg:block lg:w-1/2 relative bg-[#F9FCF5]"
        style={{
          backgroundImage: "url('/image/login-image.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

    </div>
  );
}
