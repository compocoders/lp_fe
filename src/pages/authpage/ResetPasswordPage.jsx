import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword, verifyResetOTP } from '../../api/auth.api';
import { motion } from 'framer-motion';
import { Loader2, KeyRound, ArrowLeft } from 'lucide-react';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  useEffect(() => {
    // If we passed the email from the ForgotPassword page, use it
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.some(isNaN)) return;
    
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

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
    
    if (step === 1) {
      setError(null);
      setIsLoading(true);
      try {
        await verifyResetOTP({ email, otp: otpValue });
        setStep(2);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired code.');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await resetPassword({ email, otp: otpValue, newPassword });
      setSuccess("Password has been reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password. The code may be invalid or expired.';
      setError(errorMsg);
      // If the error is likely related to the OTP, send them back to step 1
      if (errorMsg.toLowerCase().includes('code') || errorMsg.toLowerCase().includes('otp') || errorMsg.toLowerCase().includes('invalid')) {
        setStep(1);
      }
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
        className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full relative overflow-hidden"
      >
        <div className="h-2 w-full bg-gradient-to-r from-[#52704E] via-[#698864] to-[#7C9A76] absolute top-0 left-0"></div>

        <button 
          onClick={() => navigate('/login')}
          className="absolute top-6 left-6 text-gray-400 hover:text-[#698864] transition-colors"
          title="Back to Login"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="w-20 h-20 mx-auto bg-[#F9FCF5] rounded-full flex items-center justify-center shadow-inner mb-6 mt-4">
          <KeyRound size={40} className="text-[#698864]" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#52704E] mb-3">Reset Password</h2>
          <p className="text-gray-500 font-medium text-sm">
            {step === 1 ? 'Enter the 6-digit code sent to your email.' : 'Choose a new password for your account.'}
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
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
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

              <div className="space-y-2">
                <label className="text-[#698864] font-bold text-sm ml-1 block">6-Digit Code</label>
                <div className="flex justify-between gap-1 sm:gap-2" onPaste={handlePaste}>
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
                        disabled={isLoading || success}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[#698864] font-bold text-sm ml-1 block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading || success}
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#F4F5F4] text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#698864]/30 transition-all font-medium placeholder-gray-400 border-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#698864] font-bold text-sm ml-1 block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading || success}
                  placeholder="Confirm new password"
                  className="w-full bg-[#F4F5F4] text-gray-800 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#698864]/30 transition-all font-medium placeholder-gray-400 border-none"
                />
              </div>
            </motion.div>
          )}

          <div className="flex gap-4">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isLoading || success}
                className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 rounded-xl transition-all shadow-sm flex justify-center items-center"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || success || (step === 1 && otp.join('').length !== 6) || (step === 2 && newPassword.length < 8)}
              className="flex-1 bg-[#7C9A76] hover:bg-[#698864] text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 text-lg active:scale-95"
            >
              {isLoading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : (step === 1 ? 'Verify Code' : 'Reset Password')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
