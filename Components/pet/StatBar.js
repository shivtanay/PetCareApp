import React from 'react';
import { motion } from 'framer-motion';

export default function StatBar({ label, value, icon, color, maxValue = 100 }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getBarColor = () => {
    if (percentage > 60) return color || 'bg-emerald-500';
    if (percentage > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xl w-8">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-white/80">{label}</span>
          <span className="text-xs font-bold text-white">{Math.round(value)}%</span>
        </div>
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className={`h-full rounded-full ${getBarColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}