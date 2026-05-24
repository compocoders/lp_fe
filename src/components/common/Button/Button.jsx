import React from 'react';

const Button = ({ children, variant = 'primary', onClick, type = 'button', className = '' }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-hover hover:shadow-[0_4px_12px_rgba(139,92,246,0.3)]",
    secondary: "glass-panel hover:bg-white/10 text-white",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
