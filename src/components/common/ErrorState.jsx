import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';

/**
 * Reusable ErrorState component for failed data fetches.
 *
 * Props:
 *  - title   : headline (default "Something went wrong")
 *  - message : descriptive text (default generic)
 *  - onRetry : if provided, a Retry button is shown
 *  - icon    : 'warning' (default) | 'offline'
 */
const ErrorState = ({
  title = 'Something went wrong',
  message = 'We couldn\'t load this data. Please try again.',
  onRetry,
  icon = 'warning',
}) => {
  const Icon = icon === 'offline' ? WifiOff : AlertTriangle;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16 px-6 text-center min-h-[240px]">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center shadow-sm">
        <Icon size={28} className="text-red-400 dark:text-red-400" />
      </div>
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#5D7C59] hover:bg-[#4A6447] text-white text-sm font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all border-none cursor-pointer"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
