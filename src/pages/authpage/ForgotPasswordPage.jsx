import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth.api';
import { motion } from 'framer-motion';
import { Loader2, KeyRound, ArrowLeft } from 'lucide-react';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess("If an account with that email exists, we've sent a 6-digit reset code.");
      
      // Navigate to reset password page and pass the email in state so they don't have to re-type it
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
      
    } catch (err) {
      // Don't leak if email exists or not usually, but catch network errors
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F4] font-sans items-center justify-center p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full relative overflow-hidden"
      >
        <div className="h-2 w-full bg-gradient-to-r from-[#52704E] via-[#698864] to-[#7C9A76] absolute top-0 left-0"></div>

        <button 
          onClick={() => navigate('/login')}
          className="absolute top-6 left-6 text-gray-400 hover:text-[#698864] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="w-20 h-20 mx-auto bg-[#F9FCF5] rounded-full flex items-center justify-center shadow-inner mb-6 mt-4">
          <KeyRound size={40} className="text-[#698864]" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#52704E] mb-3">Forgot Password</h2>
          <p className="text-gray-500 font-medium text-sm">
            Enter the email address associated with your account and we'll send you a 6-digit code to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 font-medium text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-6 font-medium text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[#698864] font-bold text-sm ml-1 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || success}
              placeholder="Enter your email"
              className="w-full bg-[#F4F5F4] text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#698864]/30 transition-all font-medium placeholder-gray-400 border-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || success || !email}
            className="w-full bg-[#7C9A76] hover:bg-[#698864] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 text-lg active:scale-95"
          >
            {isLoading ? <><Loader2 size={20} className="animate-spin" /> Sending...</> : 'Send Reset Code'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Remember your password?{' '}
            <Link to="/login" className="text-[#698864] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
