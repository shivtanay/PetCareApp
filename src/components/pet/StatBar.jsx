import React from 'react';
import { motion } from 'framer-motion';

export default function StatBar({ label, value, icon, color, maxValue = 100 }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getBarColor = () => {
    if (percentage > 60) return color || 'bg-emerald-500';
    if (percentage > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getGlowColor = () => {
    if (percentage > 60) return 'rgba(16, 185, 129, 0.5)';
    if (percentage > 30) return 'rgba(245, 158, 11, 0.5)';
    return 'rgba(239, 68, 68, 0.5)';
  };

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02, x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.span 
        className="text-xl w-8"
        animate={{ 
          scale: percentage < 30 ? [1, 1.2, 1] : 1,
          rotate: percentage < 30 ? [0, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.5, repeat: percentage < 30 ? Infinity : 0 }}
      >
        {icon}
      </motion.span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-white/80">{label}</span>
          <motion.span 
            className={`text-xs font-bold ${percentage < 30 ? 'text-red-400' : 'text-white'}`}
            animate={percentage < 30 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {Math.round(percentage)}%
          </motion.span>
        </div>
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm relative">
          <motion.div
            className={`h-full rounded-full ${getBarColor()} relative`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              boxShadow: `0 0 10px ${getGlowColor()}`
            }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          {/* Pulsing warning indicator when low */}
          {percentage < 30 && (
            <motion.div
              className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
