import React from 'react';

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px]">
      <div className="w-10 h-10 border-4 border-[#517559]/30 border-l-[#517559] rounded-full animate-spin"></div>
      <div className="mt-4 text-[#517559] font-medium font-sans">{text}</div>
    </div>
  );
};

export default Loading;
