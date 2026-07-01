import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1A261B] pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 md:px-12 text-white/80">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
        {/* Brand block - full width on small, spans 2 on md */}
        <div className="sm:col-span-2 md:col-span-2">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <img src="/image/logo.svg" alt="L I K H Â Logo" className="w-8 h-8 md:w-10 md:h-10 opacity-90" />
            <span className="text-2xl font-black text-[#FFC700] tracking-[0.2em]">L I K H Â</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-sm mb-6 sm:mb-8">
            Empowering the future of digital learning with intuitive, AI-driven tools for students and educators worldwide.
          </p>

        </div>

        <div>
          <h4 className="text-white font-bold mb-4 sm:mb-6 text-sm uppercase tracking-wider">Product</h4>
          <ul className="space-y-3 sm:space-y-4 text-sm">
            <li><Link to="/features" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Features</Link></li>
            <li><Link to="/security" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Security</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 sm:mb-6 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 sm:space-y-4 text-sm">
            <li><Link to="/about-us" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <p className="text-xs sm:text-sm text-white/50 font-medium text-center sm:text-left">
          © {new Date().getFullYear()} L I K H Â Platform. All rights reserved.
        </p>
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center items-center">
          <a href="https://kayceelyo-dev.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs text-[#FFC700] font-semibold hover:underline">
            Created by kayceelyo_dev
          </a>
          <Link to="/privacy-policy" className="hover:text-white transition-colors text-xs text-white/50">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-white transition-colors text-xs text-white/50">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
