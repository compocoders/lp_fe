import React from 'react';
import { motion } from 'framer-motion';

const InteractiveCard = ({ title, children, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="bg-white border border-gray-100 p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] hover:border-[#7A9A7B]/40 transition-all duration-500 group overflow-hidden relative shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-10px_rgba(74,100,71,0.12)]"
    >
      <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-[#7A9A7B]/10 to-transparent rounded-bl-[3rem] sm:rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {icon && (
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1rem] sm:rounded-[1.25rem] bg-[#FAFCFA] border border-gray-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-[#5D7C59] group-hover:text-white transition-all duration-500 text-[#5D7C59] shadow-sm">
          {icon}
        </div>
      )}
      
      {title && <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">{title}</h3>}
      
      <div className="text-sm sm:text-base text-gray-600 leading-relaxed space-y-3 sm:space-y-4 font-medium">
        {children}
      </div>
    </motion.div>
  );
};

export default InteractiveCard;
