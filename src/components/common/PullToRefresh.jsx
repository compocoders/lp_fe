import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

const PullToRefresh = ({ onRefresh, children, className }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullY, setPullY] = useState(0);
  const containerRef = useRef(null);
  
  // Use refs for mutable values that shouldn't trigger re-renders
  const stateRef = useRef({
    startY: 0,
    isPulling: false,
    pullY: 0
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setPullY(0);
      stateRef.current.pullY = 0;
    }
  }, [onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getClientY = (e) => {
      if (e.touches && e.touches.length > 0) return e.touches[0].clientY;
      return e.clientY;
    };

    const handlePointerDown = (e) => {
      // Only start pulling if we are at the very top of the scroll container
      if (container.scrollTop <= 0) {
        stateRef.current.startY = getClientY(e);
        stateRef.current.isPulling = true;
      }
    };

    const handlePointerMove = (e) => {
      if (!stateRef.current.isPulling || isRefreshing) return;
      
      const currentY = getClientY(e);
      const deltaY = currentY - stateRef.current.startY;

      if (deltaY > 0 && container.scrollTop <= 0) {
        // If we are pulling down, prevent default scroll behavior on mobile
        if (e.cancelable) e.preventDefault(); 
        
        // Apply friction
        const newPullY = Math.min(deltaY * 0.4, 100);
        stateRef.current.pullY = newPullY;
        setPullY(newPullY);
      }
    };

    const handlePointerUp = () => {
      if (!stateRef.current.isPulling) return;
      stateRef.current.isPulling = false;

      if (stateRef.current.pullY >= 60 && !isRefreshing) {
        setPullY(60); // Keep it open at the refresh threshold
        handleRefresh();
      } else {
        setPullY(0);
        stateRef.current.pullY = 0;
      }
    };

    // Touch events for mobile
    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    container.addEventListener('touchmove', handlePointerMove, { passive: false });
    container.addEventListener('touchend', handlePointerUp);
    
    // Mouse events for desktop
    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove, { passive: false });
    window.addEventListener('mouseup', handlePointerUp);

    return () => {
      container.removeEventListener('touchstart', handlePointerDown);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('touchend', handlePointerUp);
      
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isRefreshing, handleRefresh]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overscroll-none ${pullY > 0 || isRefreshing ? 'overflow-hidden' : 'overflow-y-auto'} ${className || ''}`}
    >
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center overflow-hidden z-0"
        style={{ height: pullY > 0 ? pullY : 0 }}
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : (pullY * 3) }}
          transition={{ repeat: isRefreshing ? Infinity : 0, duration: 1, ease: "linear" }}
          className="text-[#517559] bg-white rounded-full p-2 shadow-md flex items-center justify-center mt-2"
          style={{ opacity: Math.min(pullY / 60, 1) }}
        >
          <RefreshCw size={20} strokeWidth={2.5} />
        </motion.div>
      </div>
      
      {/* Content wrapper */}
      <motion.div
        animate={{ y: pullY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`min-h-full relative z-10 bg-[#d9e2d5] ${pullY > 0 ? 'select-none touch-none' : ''}`} // Matches Dashboard background
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
