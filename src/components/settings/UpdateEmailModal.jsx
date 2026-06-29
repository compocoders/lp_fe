import React, { useState, useRef } from 'react';
import { X, Shield, AlertCircle, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { requestEmailUpdate, updateEmail } from '../../api/auth.api';

const UpdateEmailModal = ({ isOpen, onClose, currentEmail, onEmailUpdated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Step 1 data
  const [emailData, setEmailData] = useState({ currentPassword: '', newEmail: '' });
  
  // Step 2 data
  const [otpArray, setOtpArray] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state on close
    setStep(1);
    setEmailData({ currentPassword: '', newEmail: '' });
    setOtpArray(new Array(6).fill(''));
    setErrorMsg('');
    onClose();
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtpArray([...otpArray.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Focus previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.some(isNaN)) return;
    
    const newOtp = [...otpArray];
    pastedData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtpArray(newOtp);

    // Focus last filled input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex].focus();
  };

  const handleRequestUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await requestEmailUpdate(emailData);
      setStep(2); // Move to OTP step
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to request email update');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otpArray.join('');
    if (otpValue.length !== 6) {
      setErrorMsg("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await updateEmail({ otp: otpValue });
      onEmailUpdated(emailData.newEmail); // Notify parent component
      handleClose(); // Close on success
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-[#1A211A] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Shield className="text-orange-500 dark:text-orange-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Change Email</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Securely update your address</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              {errorMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestUpdate} className="flex flex-col gap-5">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Current Email: <span className="font-semibold text-gray-900 dark:text-white">{currentEmail}</span>
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                <input
                  type="password"
                  required
                  value={emailData.currentPassword}
                  onChange={(e) => setEmailData(p => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Verify your identity"
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5D7C59]/30 focus:border-[#5D7C59] outline-none text-gray-900 dark:text-white transition-all text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Email Address</label>
                <input
                  type="email"
                  required
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData(p => ({ ...p, newEmail: e.target.value }))}
                  placeholder="new@example.com"
                  className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#5D7C59]/30 focus:border-[#5D7C59] outline-none text-gray-900 dark:text-white transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-[#5D7C59] hover:bg-[#4A6447] text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
              <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your inbox</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We've sent a 6-digit code to <br/>
                  <span className="font-semibold text-gray-900 dark:text-white">{emailData.newEmail}</span>
                </p>
              </div>

              <div className="flex flex-col gap-1.5 items-center">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center mb-2">Enter 6-digit Code</label>
                <div className="flex justify-center gap-1 sm:gap-2 md:gap-3" onPaste={handleOtpPaste}>
                  {otpArray.map((data, index) => (
                    <input
                      className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-xl sm:text-2xl font-extrabold bg-[#F4F5F4] dark:bg-white/5 text-[#52704E] dark:text-[#7A9A7B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#698864]/50 transition-all border-none"
                      type="text"
                      name="otp"
                      maxLength="1"
                      key={index}
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onKeyDown={e => handleOtpKeyDown(e, index)}
                      ref={ref => inputRefs.current[index] = ref}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpArray.join('').length !== 6}
                className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-[#5D7C59] hover:bg-[#4A6447] text-white rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify and Update Email'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtpArray(new Array(6).fill(''));
                  setErrorMsg('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold"
              >
                Go back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateEmailModal;
