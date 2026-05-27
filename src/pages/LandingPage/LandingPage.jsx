import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Brain, Users, BarChart3, BookOpen, ClipboardList, Lightbulb, ChevronRight, Star, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const fadeDownVariant = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const scaleUpVariant = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.15
    }
  }
};

// ─── SVG Patterns (Figma-matched) ────────────────────────────────────────────

const Blob = ({ className, style }) => (
  <svg viewBox="0 0 200 200" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.7,-68.3C60.3,-59.1,68.5,-43.5,73.2,-27.3C77.9,-11,79,5.9,74.3,21.1C69.6,36.2,59,49.5,45.5,58.7C32,67.9,15.5,73,-1.5,75.1C-18.5,77.2,-36.9,76.3,-51.2,68C-65.5,59.7,-75.6,44,-79.3,27C-83,10,-80.3,-8.3,-73,-23.9C-65.7,-39.5,-53.8,-52.4,-40.1,-61.4C-26.4,-70.4,-10.9,-75.5,3.9,-80.5C18.7,-85.5,35.1,-77.5,47.7,-68.3Z" transform="translate(100 100)" />
  </svg>
);

// Wide organic blobs for person backgrounds — irregular splat shapes matching Figma
const PersonBlob1 = ({ className, style }) => (
  <svg viewBox="0 0 300 250" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M230,25 C265,45 290,80 295,120 C300,160 285,195 260,220 C235,242 200,252 165,248 C130,244 100,248 70,240 C40,232 18,212 8,185 C-2,158 2,128 15,100 C28,72 48,48 78,32 C108,16 140,10 172,14 C204,18 215,15 230,25Z" />
  </svg>
);

const PersonBlob2 = ({ className, style }) => (
  <svg viewBox="0 0 300 260" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M215,20 C250,35 278,65 290,105 C302,145 295,185 275,215 C255,245 222,260 185,258 C148,256 115,252 82,242 C49,232 22,215 10,188 C-2,161 0,128 12,98 C24,68 50,42 82,28 C114,14 148,8 180,12 C200,14 208,16 215,20Z" />
  </svg>
);

const PersonBlob3 = ({ className, style }) => (
  <svg viewBox="0 0 300 250" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M225,30 C258,50 282,82 292,118 C302,154 295,190 272,218 C249,246 215,252 178,250 C141,248 108,245 75,235 C42,225 15,205 5,175 C-5,145 2,112 18,82 C34,52 60,30 92,18 C124,6 158,2 188,10 C210,16 218,24 225,30Z" />
  </svg>
);

const Gear = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50, 50) scale(1.7) translate(-51, -38.5)">
      <path d="M50 12 C53 12 56 14 58 17 C60 20 64 20 66 17 C70 13 76 14 78 18 C80 22 78 27 75 29 C72 31 72 36 75 38 C80 40 82 46 79 50 C76 54 71 55 68 53 C65 51 60 52 60 56 C60 61 56 65 51 65 C46 65 42 61 42 56 C42 52 37 51 34 53 C31 55 26 54 23 50 C20 46 22 40 27 38 C30 36 30 31 27 29 C24 27 22 22 24 18 C26 14 32 13 36 17 C38 20 42 20 44 17 C46 14 47 12 50 12Z"/>
    </g>
  </svg>
);

const GearOutline = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(50, 50) scale(1.7) translate(-51, -38.5)">
      <path d="M50 12 C53 12 56 14 58 17 C60 20 64 20 66 17 C70 13 76 14 78 18 C80 22 78 27 75 29 C72 31 72 36 75 38 C80 40 82 46 79 50 C76 54 71 55 68 53 C65 51 60 52 60 56 C60 61 56 65 51 65 C46 65 42 61 42 56 C42 52 37 51 34 53 C31 55 26 54 23 50 C20 46 22 40 27 38 C30 36 30 31 27 29 C24 27 22 22 24 18 C26 14 32 13 36 17 C38 20 42 20 44 17 C46 14 47 12 50 12Z"/>
    </g>
  </svg>
);

const ConcentricRings = ({ className }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="16" strokeWidth="5"/>
    <circle cx="100" cy="100" r="34" strokeWidth="5"/>
    <circle cx="100" cy="100" r="52" strokeWidth="5"/>
    <circle cx="100" cy="100" r="70" strokeWidth="5"/>
    <circle cx="100" cy="100" r="88" strokeWidth="5"/>
  </svg>
);

const CloudOutline = ({ className }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" stroke="currentColor" strokeWidth="5" xmlns="http://www.w3.org/2000/svg">
    <path d="M200,60 C240,40 290,55 315,90 C340,125 335,170 315,200 C300,222 275,240 248,248 C220,256 188,252 162,240 C136,228 114,206 102,180 C90,154 90,122 105,98 C120,74 160,80 200,60Z"/>
  </svg>
);

const WavyLines = ({ className }) => (
  <svg viewBox="0 0 280 200" className={className} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,35 C40,18 75,52 115,35 C155,18 185,52 220,35 C255,18 270,45 290,35"/>
    <path d="M0,65 C40,48 75,82 115,65 C155,48 185,82 220,65 C255,48 270,75 290,65"/>
    <path d="M0,95 C40,78 75,112 115,95 C155,78 185,112 220,95 C255,78 270,105 290,95"/>
    <path d="M0,125 C40,108 75,142 115,125 C155,108 185,142 220,125 C255,108 270,135 290,125"/>
    <path d="M0,155 C40,138 75,172 115,155 C155,138 185,172 220,155 C255,138 270,165 290,155"/>
  </svg>
);

const SCurve = ({ className }) => (
  <svg viewBox="0 0 80 280" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M60,15 C20,55 80,105 25,155 C-20,195 65,240 40,275"/>
    <path d="M48,12 C8,52 68,102 13,152 C-32,192 53,237 28,272"/>
  </svg>
);

const FlowerGearBadge = ({ icon: Icon, className = "" }) => (
  <div className={`relative w-[70px] h-[70px] md:w-[90px] md:h-[90px] mx-auto mb-5 md:mb-7 drop-shadow-md transition-transform duration-500 ${className}`}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" fill="white" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50, 50) scale(1.4) translate(-50, -35)">
        <path d="
          M50,8
          C54,8 57,11 58,15 C59,19 63,21 67,19
          C73,16 79,19 80,25 C81,31 78,36 74,37
          C70,38 69,43 72,46 C76,51 75,58 69,60
          C63,62 58,59 57,55 C56,51 50,51 50,51
          C50,51 44,51 43,55 C42,59 37,62 31,60
          C25,58 24,51 28,46 C31,43 30,38 26,37
          C22,36 19,31 20,25 C21,19 27,16 33,19
          C37,21 41,19 42,15 C43,11 46,8 50,8Z
        "/>
      </g>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <Icon className="w-8 h-8 md:w-10 md:h-10 transition-colors duration-300" style={{ color: '#4A6447', strokeWidth: 1.8 }} />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        /* Smooth, elegant animations for the patterns */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-image {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 6s ease-in-out infinite 3s; }
        .animate-float-image { animation: float-image 5s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 35s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 40s linear infinite; }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }

        /* Parallax depth layers */
        .parallax-slow { will-change: transform; }

        /* Text shimmer for hero */
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(90deg, #FFC700 0%, #FFE066 40%, #FFC700 60%, #FFD633 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-shimmer 4s linear infinite;
        }

        /* Navbar link underline animation */
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #4A6447;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>

      {/* Extremely subtle modern dot grid background pattern */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4A6447 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.02, zIndex: 0 }}></div>

      <div className="font-sans text-gray-800 bg-[#FAFCFA] overflow-clip selection:bg-[#FFC700] selection:text-white relative z-10">

        {/* ═══════════════════════════════ NAVBAR ═══════════════════════════════ */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3 md:py-4' : 'bg-transparent py-4 md:py-6'}`}>
          <div className="flex justify-between items-center px-6 md:px-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
              <img src="/image/logo.svg" alt="Likhā Logo" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-xl md:text-2xl font-black text-[#4A6447] tracking-[0.2em]">LIKHA</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-12 text-sm text-gray-600 font-semibold tracking-wide">
              <button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link hover:text-[#4A6447] transition-colors text-left">Home</button>
              <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link hover:text-[#4A6447] transition-colors text-left">About</button>
              <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="nav-link hover:text-[#4A6447] transition-colors text-left">Contact</button>
            </div>
            <button onClick={() => navigate('/login')} className="hidden md:block bg-[#5D7C59] hover:bg-[#4A6447] text-white px-7 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:-translate-y-0.5">
              Join a class
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden flex items-center p-2 text-[#4A6447]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 flex flex-col items-center py-4 space-y-4">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-gray-600 font-semibold w-full text-center py-2 hover:bg-gray-50"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-gray-600 font-semibold w-full text-center py-2 hover:bg-gray-50"
              >
                About
              </button>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="text-gray-600 font-semibold w-full text-center py-2 hover:bg-gray-50"
              >
                Contact
              </button>
              <button onClick={() => navigate('/login')} className="bg-[#5D7C59] text-white px-8 py-3 rounded-full text-sm font-bold w-3/4 max-w-xs mt-2">
                Join a class
              </button>
            </div>
          )}
        </nav>

        {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
        <section id="home" className="pt-[80px] md:pt-[100px] px-4 md:px-8 xl:px-12 pb-8 w-full max-w-[2200px] mx-auto scroll-mt-24">
          {/* Expanded boxed hero container with white space around it */}
          <div className="relative overflow-hidden bg-[#7A9A7B] min-h-[500px] lg:h-[calc(100vh-160px)] lg:max-h-[850px] flex flex-col lg:flex-row w-full shadow-lg rounded-sm">
            
            {/* Animated background patterns (Figma matched blobs) */}
            <Blob className="absolute -top-32 -left-32 w-[500px] h-[500px] text-[#4A6447] opacity-60 animate-float z-0" />
            <Blob className="absolute -bottom-40 left-0 w-[400px] h-[400px] text-[#4A6447] opacity-50 rotate-90 animate-float-delay z-0" />
            
            {/* Background shapes behind woman */}
            <Blob className="absolute -bottom-20 right-[5%] w-[600px] h-[600px] text-[#4A6447] opacity-40 animate-float-delay z-0" />
            <Blob className="absolute -top-10 -right-10 w-[700px] h-[700px] text-[#4A6447] opacity-50 animate-spin-slow z-0" />

            {/* Content Container */}
            <div className="w-full relative z-20 flex flex-col lg:flex-row h-full px-6 md:px-12 lg:px-16 xl:px-20">
              
              {/* Left text */}
              <motion.div 
                initial="hidden" animate="visible" variants={staggerContainer}
                className="w-full lg:w-[55%] py-12 md:py-20 lg:py-28 flex-shrink-0 flex flex-col justify-center text-center lg:text-left z-20"
              >
                {/* SaaS style Pill Badge */}
                <motion.div variants={fadeUpVariant} className="flex justify-center lg:justify-start mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-sm cursor-pointer hover:bg-white/15 transition-colors">
                    <span className="flex h-2 w-2 rounded-full bg-[#FFC700] animate-pulse"></span>
                    <span className="text-white text-xs md:text-sm font-bold tracking-wide uppercase">Introducing Likhā Platform</span>
                  </div>
                </motion.div>

                <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-5xl md:text-[3.6rem] lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5rem] font-bold text-white leading-[1.05] mb-5 md:mb-6 tracking-tight">
                  The <span className="text-shimmer italic font-serif pr-2">Modern Learning</span>
                  <br className="hidden sm:block" /> Workspace
                </motion.h1>
                <motion.p variants={fadeUpVariant} className="text-white/90 text-sm md:text-[1.15rem] xl:text-[1.25rem] mb-8 md:mb-12 max-w-[480px] xl:max-w-[550px] mx-auto lg:mx-0 leading-relaxed font-medium">
                  Everything you need to teach, organize, and succeed unified into one seamless, modern experience.
                </motion.p>
                <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 md:gap-5 w-full">
                  <button onClick={() => navigate('/register')} className="bg-[#FFC700] text-gray-900 px-8 py-3.5 md:px-10 md:py-4 xl:px-12 xl:py-5 xl:text-xl rounded-xl font-extrabold hover:bg-[#FFD633] transition-all duration-300 shadow-[0_0_20px_rgba(255,199,0,0.3)] hover:shadow-[0_0_30px_rgba(255,199,0,0.5)] hover:-translate-y-1 text-sm md:text-lg w-full sm:w-auto border border-[#FFC700]">
                    Start Learning Free
                  </button>
                  <button 
                    onClick={() => document.getElementById('quick-guide')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-2 border-white/30 text-white px-6 py-3.5 md:px-8 md:py-4 xl:px-10 xl:py-5 xl:text-xl rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-sm md:text-lg w-full sm:w-auto bg-transparent"
                  >
                    <div className="w-6 h-6 xl:w-7 xl:h-7 rounded-full border border-white/50 flex items-center justify-center bg-white/5">
                      <ArrowUpRight className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                    </div>
                    See how it works
                  </button>
                </motion.div>
              </motion.div>

              {/* Right — hero image (Anchored to the right edge and bottom of the green container) */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-10 w-full lg:w-[45%] lg:absolute lg:right-0 lg:bottom-0 flex justify-center lg:justify-end items-end mt-8 lg:mt-0 px-6 lg:px-0 h-[350px] lg:h-[95%] pointer-events-none"
              >
                <img
                  src="/image/hero-girl-standing.png"
                  alt="Professional educator"
                  className="h-[350px] sm:h-[450px] lg:h-full w-auto object-contain object-bottom lg:object-right-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-float-image pointer-events-auto"
                />
              </motion.div>
              
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ FEATURES ═══════════════════════════════ */}
        <section id="about" className="py-20 md:py-32 px-5 md:px-12 max-w-7xl mx-auto relative scroll-mt-24">
          {/* Background Clouds */}
          <CloudOutline className="absolute top-0 right-[-100px] w-[600px] h-[600px] text-gray-200/60 pointer-events-none hidden lg:block animate-float-delay" />
          <CloudOutline className="absolute bottom-[-100px] left-[-150px] w-[500px] h-[500px] text-gray-200/60 pointer-events-none hidden lg:block animate-float" />

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={slideFromLeft}
            className="text-left mb-12 md:mb-20 relative z-10"
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] text-gray-900 leading-[1.05] font-bold tracking-tight">
              Our <span className="text-[#FFC700] italic font-serif">amazing</span>
              <br />features
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10"
          >
            {/* Card 1 */}
            <motion.div variants={fadeUpVariant} className="group bg-gradient-to-br from-[#5D7C59] to-[#4A6447] border border-white/20 rounded-[2rem] text-white relative overflow-hidden flex flex-col transition-all duration-500 min-h-[400px] shadow-lg hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,199,0,0.2)]">
              <ConcentricRings className="absolute top-0 right-0 w-40 h-40 text-[#7A9A7B]/40 translate-x-1/4 -translate-y-1/4" />
              <ConcentricRings className="absolute -bottom-8 right-0 w-52 h-52 text-[#7A9A7B]/40 translate-x-1/4" />
              
              <div className="relative z-10 pt-10 pl-10 h-32">
                <div className="relative flex items-center justify-center w-12 h-12 group-hover:scale-105 transition-transform duration-500">
                  <Gear className="absolute w-[140px] h-[140px] text-[#7A9A7B]" />
                  <BookOpen className="w-12 h-12 text-white relative z-10 drop-shadow-md" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1" />
              <div className="relative z-10 p-8 pt-4 bg-gradient-to-t from-black/20 to-transparent">
                <p className="text-[#FFC700] italic font-serif text-2xl md:text-[1.75rem] leading-tight mb-2">Ai powered</p>
                <h3 className="text-white text-3xl md:text-[2rem] font-medium mb-3 leading-tight tracking-tight">Classrooms</h3>
                <p className="text-white/95 text-sm md:text-base leading-relaxed font-normal">AI-powered classrooms designed for smarter learning and seamless collaboration.</p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeUpVariant} className="group bg-gradient-to-br from-[#5D7C59] to-[#4A6447] border border-white/20 rounded-[2rem] text-white relative overflow-hidden flex flex-col transition-all duration-500 min-h-[400px] shadow-lg hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,199,0,0.2)]">
              <Blob className="absolute top-4 -right-12 w-48 h-48 text-[#7A9A7B]/60 rotate-45" />
              <Blob className="absolute -bottom-10 left-10 w-32 h-32 text-[#7A9A7B]/60" />

              <div className="relative z-10 pt-10 pl-10 h-32">
                <div className="relative flex items-center justify-center w-12 h-12 group-hover:scale-105 transition-transform duration-500">
                  <Gear className="absolute w-[140px] h-[140px] text-[#7A9A7B]" />
                  <ClipboardList className="w-12 h-12 text-white relative z-10 drop-shadow-md" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1" />
              <div className="relative z-10 p-8 pt-4 bg-gradient-to-t from-black/20 to-transparent">
                <p className="text-[#FFC700] italic font-serif text-2xl md:text-[1.75rem] leading-tight mb-2">Smart activities</p>
                <h3 className="text-white text-3xl md:text-[2rem] font-medium mb-3 leading-tight tracking-tight">for students</h3>
                <p className="text-white/95 text-sm md:text-base leading-relaxed font-normal">Create smart activities, quizzes, and assignments for any course with AI.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeUpVariant} className="group bg-gradient-to-br from-[#5D7C59] to-[#4A6447] border border-white/20 rounded-[2rem] text-white relative overflow-hidden flex flex-col transition-all duration-500 min-h-[400px] shadow-lg hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,199,0,0.2)]">
              <Blob className="absolute -top-12 -right-12 w-52 h-52 text-[#7A9A7B]/50" />
              <Blob className="absolute -bottom-4 left-4 w-40 h-40 text-[#7A9A7B]/50" />

              <div className="relative z-10 pt-10 pl-10 h-32">
                <div className="relative flex items-center justify-center w-12 h-12 group-hover:scale-105 transition-transform duration-500">
                  <Gear className="absolute w-[140px] h-[140px] text-[#7A9A7B]" />
                  <ClipboardList className="w-12 h-12 text-white relative z-10 drop-shadow-md" strokeWidth={3} />
                </div>
              </div>
              <div className="flex-1" />
              <div className="relative z-10 p-8 pt-4 bg-gradient-to-t from-black/20 to-transparent">
                <p className="text-[#FFC700] italic font-serif text-2xl md:text-[1.75rem] leading-tight mb-2">Notes that think</p>
                <h3 className="text-white text-3xl md:text-[2rem] font-medium mb-3 leading-tight tracking-tight">with you.</h3>
                <p className="text-white/95 text-sm md:text-base leading-relaxed font-normal">AI notes that summarize learning materials instantly.</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════ TRANSFORMING ═══════════════════════════════ */}
        <section className="py-12 md:py-20 px-3 md:px-8">
          <div className="bg-[#7A9A7B] py-16 md:py-24 px-6 md:px-12 text-center text-white relative overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl">
            
            {/* Animated Solid gears (Matches Figma exactly) */}
            <Gear className="absolute -top-10 -left-10 w-40 h-40 md:w-60 md:h-60 text-[#5D7C59] animate-spin-slow" />
            <Gear className="absolute -top-10 right-1/2 translate-x-1/2 w-24 h-24 md:w-32 md:h-32 text-[#5D7C59] animate-spin-reverse" />
            <Gear className="absolute top-10 right-1/4 w-16 h-16 md:w-20 md:h-20 text-[#5D7C59] animate-spin-slow" />
            <Gear className="absolute -top-10 -right-10 w-40 h-40 md:w-60 md:h-60 text-[#5D7C59] animate-spin-slow" />
            <Gear className="absolute top-1/2 -translate-y-1/2 left-[15%] w-24 h-24 md:w-32 md:h-32 text-[#5D7C59] animate-spin-reverse" />
            <Gear className="absolute bottom-[20%] right-[-20px] w-32 h-32 md:w-48 md:h-48 text-[#5D7C59] animate-spin-slow" />

            {/* Animated Yellow outline gears */}
            <GearOutline className="absolute top-16 left-[25%] md:top-20 md:left-[22%] w-12 h-12 md:w-16 md:h-16 text-[#FFC700] animate-spin-reverse" />
            <GearOutline className="absolute top-10 right-[35%] md:top-14 md:right-[30%] w-10 h-10 md:w-14 md:h-14 text-[#FFC700] animate-spin-slow" />
            <GearOutline className="absolute top-1/2 right-[10%] w-12 h-12 md:w-16 md:h-16 text-[#FFC700] animate-spin-reverse" />
            <GearOutline className="absolute bottom-1/4 left-[10%] w-10 h-10 md:w-16 md:h-16 text-[#FFC700] animate-spin-slow" />
            
            <motion.h2 variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold mb-16 md:mb-24 max-w-4xl mx-auto leading-[1.2] relative z-10 text-white tracking-tight">
              Transforming online education with<br className="hidden md:block" />
              <span className="text-[#FFC700] italic font-serif font-medium">
                {' '}smart classrooms, AI notes, quizzes,<br className="hidden md:block" />
                and interactive learning tools.
              </span>
            </motion.h2>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-col md:flex-row justify-center items-center md:items-end gap-10 md:gap-10 lg:gap-16 relative z-10 max-w-6xl mx-auto">
              
              {/* Person 1 */}
              <motion.div variants={fadeUpVariant} className="group flex flex-col items-center cursor-pointer w-full relative z-10" style={{ flex: 1, maxWidth: '340px' }}>
                <div className="relative flex items-end justify-center w-full animate-float" style={{ height: '380px' }}>
                  <PersonBlob1 
                    className="absolute text-[#5D7C59] transition-transform duration-500 group-hover:scale-[1.03] z-0"
                    style={{
                      width: '400px',
                      height: '340px',
                      bottom: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                  <img
                    src="/image/boy-stripe-shirt-with-phone.png"
                    alt="Student with phone"
                    className="relative z-10 object-contain object-bottom transition-transform duration-500 group-hover:-translate-y-2"
                    style={{ height: '360px' }}
                  />
                </div>
                <p className="text-sm md:text-[1.1rem] mt-4 md:mt-6 font-bold text-center leading-snug text-white">
                  Powering up <span className="text-[#FFC700] italic font-serif font-medium">online education,</span>
                  <br />together
                </p>
              </motion.div>

              {/* Person 2 */}
              <motion.div variants={fadeUpVariant} className="group flex flex-col items-center cursor-pointer w-full relative z-10" style={{ flex: 1, maxWidth: '340px' }}>
                <div className="relative flex items-end justify-center w-full animate-float-delay" style={{ height: '400px' }}>
                  <PersonBlob2 
                    className="absolute text-[#5D7C59] transition-transform duration-500 group-hover:scale-[1.03] z-0"
                    style={{
                      width: '380px',
                      height: '350px',
                      bottom: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                  <img
                    src="/image/girl-white-shirt-standing.png"
                    alt="Teacher"
                    className="relative z-10 object-contain object-bottom transition-transform duration-500 group-hover:-translate-y-2"
                    style={{ height: '380px' }}
                  />
                </div>
                <p className="text-sm md:text-[1.1rem] mt-4 md:mt-6 font-bold text-center leading-snug text-white">
                  Let's shape the future of
                  <br /><span className="text-[#FFC700] italic font-serif font-medium">virtual classes</span>
                </p>
              </motion.div>

              {/* Person 3 */}
              <motion.div variants={fadeUpVariant} className="group flex flex-col items-center cursor-pointer w-full relative z-10" style={{ flex: 1, maxWidth: '340px' }}>
                <div className="relative flex items-end justify-center w-full animate-float" style={{ height: '380px' }}>
                  <PersonBlob3 
                    className="absolute text-[#5D7C59] transition-transform duration-500 group-hover:scale-[1.03] z-0"
                    style={{
                      width: '400px',
                      height: '340px',
                      bottom: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                  <img
                    src="/image/boy-strip-shirt-no-phone-thumbs-up.png"
                    alt="Student thumbs up"
                    className="relative z-10 object-contain object-bottom transition-transform duration-500 group-hover:-translate-y-2"
                    style={{ height: '360px' }}
                  />
                </div>
                <p className="text-sm md:text-[1.1rem] mt-4 md:mt-6 font-bold text-center leading-snug text-white">
                  Powering up <span className="text-[#FFC700] italic font-serif font-medium">online education,</span>
                  <br />together
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════ QUICK START ═══════════════════════════════ */}
        <section id="quick-guide" className="py-20 md:py-32 px-5 md:px-10 text-center relative max-w-5xl mx-auto overflow-hidden md:overflow-visible scroll-mt-24">
          <CloudOutline className="absolute -left-20 md:-left-48 top-10 md:top-20 w-[250px] md:w-[400px] h-[250px] md:h-[400px] text-gray-200/80 pointer-events-none animate-float z-0" />
          <Blob className="absolute right-[-30px] md:right-[-60px] bottom-20 md:bottom-40 w-24 md:w-40 h-24 md:h-40 text-gray-200/80 animate-float-delay z-0" />

          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold mb-16 md:mb-24 text-gray-900 tracking-tight relative z-10"
          >
            Your Quick Start Guide
          </motion.h2>

          <div className="relative">
            {/* Vertical glowing line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFC700] via-[#FFC700] to-transparent rounded-full z-0 opacity-80 shadow-[0_0_15px_rgba(255,199,0,0.5)]" />

            <div className="flex flex-col relative z-10 gap-6 md:gap-8">
              
              {/* Card 1 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant}
                className="group flex flex-col items-center"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#FFC700] z-20 shadow-[0_0_0_6px_white] md:shadow-[0_0_0_8px_white] my-4 md:my-6 group-hover:scale-125 transition-transform duration-300" />
                <div className="bg-[#5D7C59] rounded-[1.5rem] md:rounded-[2.5rem] py-10 px-6 md:py-14 md:px-10 w-full relative overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 max-w-4xl">
                  <ConcentricRings className="absolute -left-16 md:-left-20 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 text-white/15 animate-spin-slow" />
                  <ConcentricRings className="absolute -right-16 md:-right-20 top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 text-white/15 animate-spin-reverse" />
                  
                  <FlowerGearBadge icon={Brain} className="group-hover:scale-110 group-hover:-translate-y-1" />
                  <h3 className="text-2xl md:text-4xl font-extrabold mb-3 md:mb-5 text-white relative z-10">Smart Setup</h3>
                  <p className="text-white/90 text-sm md:text-lg leading-relaxed relative z-10 max-w-2xl mx-auto font-medium">
                    Upload your learning materials and let AI transform them into interactive, engaging activities for your students in seconds.
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant}
                className="group flex flex-col items-center"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#FFC700] z-20 shadow-[0_0_0_6px_white] md:shadow-[0_0_0_8px_white] my-4 md:my-6 group-hover:scale-125 transition-transform duration-300" />
                <div className="bg-[#5D7C59] rounded-[1.5rem] md:rounded-[2.5rem] py-10 px-6 md:py-14 md:px-10 w-full relative overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 max-w-4xl">
                  <div className="absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#4A6447] animate-float-delay" />
                  <div className="absolute -right-8 md:-right-12 top-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#4A6447] animate-float" />
                  
                  <FlowerGearBadge icon={Users} className="group-hover:scale-110 group-hover:-translate-y-1" />
                  <h3 className="text-2xl md:text-4xl font-extrabold mb-3 md:mb-5 text-white relative z-10">Invite & Engage</h3>
                  <p className="text-white/90 text-sm md:text-lg leading-relaxed relative z-10 max-w-2xl mx-auto font-medium">
                    Share your unique room link with students so they can dive right into AI-assisted activities and immersive interactive learning.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleUpVariant}
                className="group flex flex-col items-center"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#FFC700] z-20 shadow-[0_0_0_6px_white] md:shadow-[0_0_0_8px_white] my-4 md:my-6 group-hover:scale-125 transition-transform duration-300" />
                <div className="bg-[#5D7C59] rounded-[1.5rem] md:rounded-[2.5rem] py-10 px-6 md:py-14 md:px-10 w-full relative overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 max-w-4xl">
                  <Blob className="absolute -top-16 -left-16 md:-top-20 md:-left-20 w-48 h-48 md:w-64 md:h-64 text-[#4A6447] animate-spin-slow" />
                  <Blob className="absolute -bottom-12 -right-12 md:-bottom-16 md:-right-16 w-40 h-40 md:w-56 md:h-56 text-[#4A6447] animate-spin-reverse" />
                  
                  <FlowerGearBadge icon={BarChart3} className="group-hover:scale-110 group-hover:-translate-y-1" />
                  <h3 className="text-2xl md:text-4xl font-extrabold mb-3 md:mb-5 text-white relative z-10">Track & Reflect</h3>
                  <p className="text-white/90 text-sm md:text-lg leading-relaxed relative z-10 max-w-2xl mx-auto font-medium">
                    Review automated grades, monitor student progress in real-time, and share personalized insights to guide their learning journey.
                  </p>
                </div>
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#5D7C59] z-20 shadow-[0_0_0_6px_white] md:shadow-[0_0_0_8px_white] my-4 md:my-6" />
              </motion.div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ TESTIMONIALS ═══════════════════════════════ */}
        <section className="py-20 md:py-32 px-5 md:px-10 text-center relative max-w-7xl mx-auto">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold mb-16 md:mb-24 text-gray-900 tracking-tight"
          >
            Loved by <span className="text-[#FFC700] italic font-serif">educators</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Sarah Jenkins", initial: "S", role: "High School Teacher", text: "Likhā has completely transformed how I organize my classroom. The AI features save me hours of prep time every week!" },
              { name: "Dr. Marcus Chen", initial: "M", role: "University Professor", text: "The interactive activities engage my students in ways standard LMS platforms simply can't. It's the future of education." },
              { name: "Elena Rodriguez", initial: "E", role: "Course Creator", text: "Beautiful, intuitive, and incredibly powerful. My students constantly praise how easy it is to navigate the learning materials." }
            ].map((testimonial, idx) => (
              <motion.div key={idx} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true, delay: idx * 0.2 }} className="group bg-gradient-to-br from-[#5D7C59] to-[#4A6447] border border-white/20 rounded-[2rem] p-8 md:p-10 text-left relative overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,199,0,0.2)] transition-all duration-500">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-[#FFC700] text-[#FFC700]" />)}
                </div>
                <p className="text-white/95 text-lg leading-relaxed mb-8 font-medium">"{testimonial.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-[#FFC700] flex items-center justify-center text-white font-bold text-xl border-2 border-white/20 shadow-md">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="text-white font-bold">{testimonial.name}</p>
                    <p className="text-white/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════ FAQ ═══════════════════════════════ */}
        <section className="py-20 md:py-32 px-5 md:px-10 max-w-4xl mx-auto">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-12 md:mb-16 text-center text-gray-900 tracking-tight"
          >
            Frequently asked questions
          </motion.h2>

          <div className="space-y-4">
            {[
              { q: "What makes Likhā different from a standard LMS?", a: "Likhā fuses the organizational power of a traditional LMS with an integrated AI-Powered Learning Notebook and dynamic assessment tools, eliminating the need to juggle multiple applications." },
              { q: "How do my students join a classroom?", a: "Professors instantiate a digital classroom and generate a secure 6-8 character join link. Students simply use this link to access the centralized portal." },
              { q: "How does the AI assist professors and students?", a: "For professors, the AI instantly generates draft questionnaires from uploaded course materials. For students, the AI acts as an intelligent notebook to summarize complex PDFs and answer context-specific questions based strictly on the professor's content." },
              { q: "Does the platform support technical programming courses?", a: "Yes! Likhā features a department-specific plugin architecture that includes an integrated online IDE for IT students, supporting languages like Java and C#." }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div key={idx} variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }} className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button onClick={() => setOpenFaq(isOpen ? null : idx)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                    <span className="text-lg md:text-xl font-bold text-gray-900">{faq.q}</span>
                    <ChevronDown className={`w-6 h-6 text-[#5D7C59] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 pb-6 text-gray-600">
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════ FEEDBACK ═══════════════════════════════ */}
        <section id="contact" className="py-12 md:py-16 px-4 md:px-8 scroll-mt-24">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUpVariant}
            className="bg-[#7A9A7B] py-16 md:py-24 px-6 md:px-12 text-center text-white rounded-[2rem] md:rounded-[3rem] shadow-xl relative overflow-hidden"
          >
            
            <WavyLines className="absolute top-1/2 -translate-y-1/2 -left-4 w-40 h-32 md:w-64 md:h-56 text-[#4A6447] opacity-80" />
            <SCurve className="absolute top-1/2 -translate-y-1/2 right-0 w-12 h-48 md:w-20 md:h-72 text-[#4A6447] opacity-80" />
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainerSlow}
              className="max-w-xl mx-auto relative z-10"
            >
              <motion.h2 variants={fadeUpVariant} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
                Help us improve your
                <br />
                <span className="text-[#FFC700] italic font-serif">experience</span>
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="mb-8 md:mb-12 text-sm md:text-lg text-white/90 leading-relaxed max-w-lg mx-auto font-medium">
                We are a brand-new startup platform. If you have any concerns, questions, or ideas on how we can make teaching and learning better, our inbox is always open.
              </motion.p>

              <motion.form variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-5 md:gap-6">
                <motion.div variants={fadeUpVariant} className="text-left group">
                  <label className="block text-xs md:text-sm font-bold mb-2 text-white/90 tracking-wide uppercase">Email Address</label>
                  <input
                    type="email"
                    className="w-full rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-gray-800 bg-white focus:ring-4 focus:ring-[#FFC700]/50 outline-none transition-all duration-300 text-sm md:text-base shadow-inner group-hover:shadow-md"
                    placeholder="hello@example.com"
                  />
                </motion.div>
                <motion.div variants={fadeUpVariant} className="text-left group">
                  <label className="block text-xs md:text-sm font-bold mb-2 text-white/90 tracking-wide uppercase">Your Message</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-gray-800 bg-white focus:ring-4 focus:ring-[#FFC700]/50 outline-none transition-all duration-300 resize-none text-sm md:text-base shadow-inner group-hover:shadow-md"
                    placeholder="Tell us what you think..."
                  />
                </motion.div>
                <motion.button
                  variants={scaleUpVariant}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="bg-[#3D5240] text-white font-extrabold py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-[#2e3d30] transition-all duration-300 shadow-lg hover:-translate-y-1 active:translate-y-0 tracking-wide text-base md:text-lg mt-2 flex items-center justify-center gap-2"
                >
                  Send Message
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════ FOOTER ═══════════════════════════════ */}
        <footer className="bg-[#1A261B] pt-20 pb-10 px-6 md:px-12 text-white/80">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="mb-10 md:mb-0 md:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <img src="/image/logo.svg" alt="Likhā Logo" className="w-8 h-8 md:w-10 md:h-10 opacity-90" />
                <span className="text-2xl font-black text-[#FFC700] tracking-[0.2em]">LIKHA</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                Empowering the future of digital learning with intuitive, AI-driven tools for students and educators worldwide.
              </p>
              <div className="flex gap-4 mt-8">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-xs md:text-sm text-white/50 font-medium text-center sm:text-left">© {new Date().getFullYear()} Likhā Platform. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors text-xs text-white/50">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors text-xs text-white/50">Terms of Service</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default LandingPage;
