import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerification, logout } from '../../api/auth.api';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowLeft, LogOut } from 'lucide-react';
import useAuthStore from '../../store/auth.store';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const inputRefs = useRef([]);

  const handleGoBack = async () => {
    try {
      await logout(); // Call backend to clear cookie
    } catch (err) {
      console.error('Logout failed on go back', err);
    } finally {
      localStorage.removeItem('user');
      logoutStore();
      navigate('/login');
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.some(isNaN)) return; // Ensure all pasted characters are numbers
    
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await verifyEmail({ otp: otpValue });
      
      // Update local storage user state
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.isEmailVerified = true;
        localStorage.setItem('user', JSON.stringify(user));
      }

      setSuccess("Email verified successfully! Redirecting...");
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    try {
      await resendVerification();
      setSuccess("A new code has been sent to your email.");
      setTimeout(() => setSuccess(null), 3000); // Clear message after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F4] font-sans items-center justify-center p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center relative overflow-hidden"
      >
        <div className="h-2 w-full bg-gradient-to-r from-[#52704E] via-[#698864] to-[#7C9A76] absolute top-0 left-0"></div>

        <button 
          onClick={handleGoBack}
          className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-bold"
          title="Cancel Registration and Logout"
        >
          <LogOut size={20} />
        </button>

        <div className="w-20 h-20 mx-auto bg-[#F9FCF5] rounded-full flex items-center justify-center shadow-inner mb-6 mt-4">
          <Mail size={40} className="text-[#698864]" />
        </div>

        <h2 className="text-3xl font-extrabold text-[#52704E] mb-3">Verify Email</h2>
        <p className="text-gray-500 font-medium text-sm mb-8">
          We've sent a 6-digit verification code to your email. Please enter it below to activate your account.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-6 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-1 sm:gap-2 md:gap-3" onPaste={handlePaste}>
            {otp.map((data, index) => {
              return (
                <input
                  className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-xl sm:text-2xl font-extrabold bg-[#F4F5F4] text-[#52704E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#698864]/50 transition-all border-none"
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  ref={ref => inputRefs.current[index] = ref}
                  disabled={isLoading}
                />
              );
            })}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full bg-[#7C9A76] hover:bg-[#698864] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
          >
            {isLoading ? <><Loader2 size={20} className="animate-spin" /> Verifying...</> : 'Verify Account'}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-sm text-gray-500 font-medium">
            Didn't receive the code?{' '}
            <button 
              onClick={handleResend}
              disabled={isResending}
              className="text-[#698864] font-bold hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
