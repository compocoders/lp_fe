import React, { useEffect, useState } from 'react';
import useAIStore from '../../store/ai.store';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Lock } from 'lucide-react';
import api from '../../api/axios';

const TokenWidget = ({ compact = false }) => {
  const { virtualTokens, maxTokens, setVirtualTokens, nextResetAt, setNextResetAt } = useAIStore();
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch token info on mount
  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const res = await api.get('/ai/token-info');
        setVirtualTokens(res.data.remainingTokens);
        if (res.data.nextResetAt) {
          setNextResetAt(res.data.nextResetAt);
        }
      } catch (error) {
        console.error('Failed to fetch token info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTokenInfo();
  }, [setVirtualTokens, setNextResetAt]);

  // Listen to token updates directly
  useEffect(() => {
    const handleTokensUpdate = (e) => {
      setVirtualTokens(e.detail);
    };
    window.addEventListener('aiTokensUpdate', handleTokensUpdate);
    return () => window.removeEventListener('aiTokensUpdate', handleTokensUpdate);
  }, [setVirtualTokens]);

  // Handle countdown
  useEffect(() => {
    if (!nextResetAt) return;

    const interval = setInterval(() => {
      const resetTime = new Date(nextResetAt).getTime();
      const now = new Date().getTime();
      const distance = resetTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('Resetting soon...');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextResetAt]);

  const percentage = Math.max(0, Math.min(100, (virtualTokens / maxTokens) * 100));
  
  let color = '#5D7C59'; // Green
  let lightColor = 'rgba(93, 124, 89, 0.1)';
  if (percentage <= 20) {
    color = '#ef4444'; // Red
    lightColor = 'rgba(239, 68, 68, 0.1)';
  } else if (percentage <= 50) {
    color = '#f59e0b'; // Amber
    lightColor = 'rgba(245, 158, 11, 0.1)';
  }

  const radius = compact ? 12 : 24;
  const stroke = compact ? 3 : 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (compact) {
    return (
      <div 
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-white/10"
        style={{ backgroundColor: lightColor }}
        title={`Tokens Reset In: ${timeLeft || 'N/A'}`}
      >
        <div className="relative flex items-center justify-center shrink-0" style={{ width: radius * 2, height: radius * 2 }}>
          <svg height={radius * 2} width={radius * 2} className="-rotate-90">
            <circle
              stroke="rgba(0,0,0,0.05)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <motion.circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <Sparkles size={10} style={{ color }} className="absolute" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold leading-none" style={{ color }}>{virtualTokens}</span>
          <span className="text-[9px] font-medium opacity-70 leading-none mt-0.5" style={{ color }}>Tokens</span>
        </div>
      </div>
    );
  }

  // Expanded View (For AI Studio Header)
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-[#1A211A] p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm w-full">
      <div className="flex items-center gap-4 flex-1 w-full">
        <div className="relative flex items-center justify-center shrink-0">
          <svg height={radius * 2} width={radius * 2} className="-rotate-90">
            <circle
              stroke="rgba(0,0,0,0.05)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <motion.circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          {virtualTokens > 0 ? (
            <Sparkles size={20} style={{ color }} className="absolute" />
          ) : (
             <Lock size={18} style={{ color }} className="absolute" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-[20px] font-black leading-none" style={{ color }}>{virtualTokens}</h3>
            <span className="text-[13px] font-semibold text-gray-500">/ {maxTokens}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
             <motion.div 
               className="h-full rounded-full"
               style={{ backgroundColor: color }}
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 0.5 }}
             />
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3 bg-gray-50 dark:bg-white/5 px-3 py-2 rounded-xl border border-gray-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Resets In</span>
        </div>
        <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">
          {timeLeft || 'Calculating...'}
        </span>
      </div>
    </div>
  );
};

export default TokenWidget;
