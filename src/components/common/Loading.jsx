import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Unified Loading component for the entire application.
 *
 * Variants:
 *  - "page"    : centered in a full flex container (for page-level loads)
 *  - "inline"  : small spinner with optional text inline (for panels/lists)
 *  - "overlay" : blurred absolute overlay (for modals during save)
 */
const Loading = ({ variant = 'page', text, size = 28 }) => {
  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center gap-3 py-8 w-full">
        <Loader2
          size={size}
          className="text-[#5D7C59] dark:text-[#7A9A7B] animate-spin shrink-0"
        />
        {text && (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/70 dark:bg-[#1A211A]/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="text-[#5D7C59] dark:text-[#7A9A7B] animate-spin"
          />
          {text && (
            <span className="text-sm font-semibold text-[#5D7C59] dark:text-[#7A9A7B]">
              {text}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default: "page"
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full h-full min-h-[300px] gap-4 bg-[#FAFCFA] dark:bg-[#121612]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-[#5D7C59]/20 dark:border-[#7A9A7B]/20" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-[#5D7C59] dark:border-t-[#7A9A7B] animate-spin" />
      </div>
      {text && (
        <span className="text-sm font-semibold text-[#5D7C59] dark:text-[#7A9A7B] tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loading;
