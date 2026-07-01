import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Users, BarChart3, BookOpen, ClipboardList, Monitor } from 'lucide-react';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A6447] group-hover:text-white transition-colors duration-500" />,
    title: "AI-Powered Learning",
    description: "Personalized learning paths adapted to each student's pace and comprehension level using advanced AI algorithms."
  },
  {
    icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A6447] group-hover:text-white transition-colors duration-500" />,
    title: "Collaborative Classrooms",
    description: "Real-time collaboration tools that bring students and teachers together, no matter where they are."
  },
  {
    icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A6447] group-hover:text-white transition-colors duration-500" />,
    title: "Advanced Analytics",
    description: "Detailed insights into student performance, helping educators identify areas for improvement instantly."
  },
  {
    icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A6447] group-hover:text-white transition-colors duration-500" />,
    title: "Interactive Materials",
    description: "Engaging, interactive study materials that make learning fun and memorable."
  },
  {
    icon: <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A6447] group-hover:text-white transition-colors duration-500" />,
    title: "Smart Grading",
    description: "Automated grading systems that save teachers time while providing detailed feedback to students."
  },
  {
    icon: <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-[#4A6447] group-hover:text-white transition-colors duration-500" />,
    title: "Cross-Platform Access",
    description: "Learn anytime, anywhere. Our platform works seamlessly across desktops, tablets, and smartphones."
  }
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFCFA] font-sans selection:bg-[#FFC700] selection:text-white">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-4 sm:px-6 md:px-10 py-4 sm:py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
          <img src="/image/logo.svg" alt="L I K H Â Logo" className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
          <span className="text-lg sm:text-xl md:text-2xl font-black text-[#4A6447] tracking-[0.2em]">L I K H Â</span>
        </Link>
        <Link to="/" className="text-sm sm:text-base text-gray-600 hover:text-[#4A6447] transition-colors font-semibold">
          ← Back to Home
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-[#FFC700]/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-[#4A6447]/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-gray-200 text-[#4A6447] text-xs sm:text-sm font-semibold tracking-wide mb-4 sm:mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Platform Features
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight leading-[1.1]">
              Everything you need to{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A6447] to-[#5D7C59]">
                teach and learn effectively
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2">
              Discover the powerful tools and intuitive interfaces designed to elevate the educational experience for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white relative z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-t-[2rem] sm:rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] bg-white border border-gray-100 hover:border-[#7A9A7B]/40 transition-all duration-500 group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-10px_rgba(74,100,71,0.12)] relative overflow-hidden cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-[#7A9A7B]/10 to-transparent rounded-bl-[3rem] sm:rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-[1rem] sm:rounded-[1.25rem] bg-[#FAFCFA] border border-gray-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-[#5D7C59] transition-all duration-500 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
