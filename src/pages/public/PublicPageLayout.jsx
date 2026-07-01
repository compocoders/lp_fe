import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';

const PublicPageLayout = ({ title, subtitle, icon, children, wideContent = false }) => {
  return (
    <div className="min-h-screen bg-[#FAFCFA] font-sans selection:bg-[#FFC700] selection:text-white flex flex-col text-gray-800">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-4 sm:px-6 md:px-10 py-4 sm:py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <img src="/image/logo.svg" alt="L I K H Â Logo" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          <span className="text-lg sm:text-xl md:text-2xl font-black text-[#4A6447] tracking-[0.2em]">L I K H Â</span>
        </Link>
        <Link to="/" className="text-sm sm:text-base text-gray-600 hover:text-[#4A6447] transition-colors font-semibold flex items-center gap-1">
          <span className="hidden sm:inline">←</span> Back to Home
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-12 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-[#FFC700]/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-[#4A6447]/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {icon && (
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-gray-200 text-[#4A6447] text-xs sm:text-sm font-semibold tracking-wide mb-4 sm:mb-6 shadow-sm">
                {icon}
                {title}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight leading-[1.1]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white flex-grow relative z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-t-[2rem] sm:rounded-t-[3rem]">
        <div className={`${wideContent ? 'max-w-6xl' : 'max-w-4xl'} mx-auto`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col gap-6 sm:gap-8 w-full"
          >
            {children}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PublicPageLayout;
