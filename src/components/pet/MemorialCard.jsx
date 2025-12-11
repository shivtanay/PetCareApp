import React from 'react';
import { motion } from 'framer-motion';

const petEmojis = {
  dragon: { egg: '🥚', hatchling: '🐣', grown: '🐲' },
  cerberus: { egg: '🥚', hatchling: '🐕', grown: '🐺' },
  kitsune: { egg: '🥚', hatchling: '🦊', grown: '🦊' },
  phoenix: { egg: '🥚', hatchling: '🐤', grown: '🔥' }
};

const memorialStyles = {
  basic: {
    border: 'border-stone-500',
    bg: 'from-stone-800 to-stone-900',
    icon: '🪦',
    glow: 'rgba(120, 113, 108, 0.3)'
  },
  golden: {
    border: 'border-amber-500',
    bg: 'from-amber-900/50 to-stone-900',
    icon: '⭐',
    glow: 'rgba(245, 158, 11, 0.4)'
  },
  legendary: {
    border: 'border-purple-500',
    bg: 'from-purple-900/50 to-stone-900',
    icon: '👑',
    glow: 'rgba(168, 85, 247, 0.5)'
  }
};

export default function MemorialCard({ memorial, index = 0 }) {
  const style = memorialStyles[memorial.memorial_type] || memorialStyles.basic;
  const emoji = petEmojis[memorial.species]?.[memorial.stage_reached] || '🥚';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative bg-gradient-to-br ${style.bg} rounded-2xl p-5 border-2 ${style.border} overflow-hidden`}
      style={{ boxShadow: `0 10px 40px ${style.glow}` }}
    >
      {/* Decorative corner ornaments */}
      <div className="absolute top-2 left-2 text-white/20 text-xs">✦</div>
      <div className="absolute top-2 right-2 text-white/20 text-xs">✦</div>
      <div className="absolute bottom-2 left-2 text-white/20 text-xs">✦</div>
      <div className="absolute bottom-2 right-2 text-white/20 text-xs">✦</div>

      {/* Memorial type icon */}
      <motion.div 
        className="absolute -top-2 -right-2 text-2xl"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {style.icon}
      </motion.div>

      {/* Pet emoji with ethereal glow */}
      <div className="text-center mb-3 relative">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div 
            className="w-20 h-20 rounded-full blur-xl"
            style={{ backgroundColor: style.glow }}
          />
        </motion.div>
        <motion.span 
          className="text-5xl relative z-10 inline-block filter grayscale-[30%]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {emoji}
        </motion.span>
      </div>

      {/* Pet name */}
      <h3 className="text-xl font-bold text-white text-center mb-1">
        {memorial.pet_name}
      </h3>

      {/* Dates */}
      <p className="text-white/50 text-xs text-center mb-3">
        {formatDate(memorial.date_adopted)} — {formatDate(memorial.date_passed)}
      </p>

      {/* Epitaph */}
      <div className="bg-black/30 rounded-xl p-3 mb-3 border border-white/10">
        <p className="text-white/80 text-sm text-center italic">
          "{memorial.epitaph}"
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <span className="text-white/50">Days Lived</span>
          <p className="text-white font-bold">{memorial.days_lived}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <span className="text-white/50">Stage</span>
          <p className="text-white font-bold capitalize">{memorial.stage_reached}</p>
        </div>
      </div>

      {/* Achievements */}
      {memorial.achievements?.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1">
          {memorial.achievements.slice(0, 4).map((ach, i) => (
            <span key={i} className="text-lg" title={ach}>
              {ach === 'hatchling' ? '🐣' : 
               ach === 'fully_grown' ? '⭐' : 
               ach === 'first_trick' ? '✨' :
               ach === 'rich' ? '💰' : '🏆'}
            </span>
          ))}
        </div>
      )}

      {/* Tricks learned */}
      {memorial.tricks_learned?.length > 0 && (
        <div className="mt-2 text-center">
          <span className="text-white/40 text-xs">Tricks: </span>
          {memorial.tricks_learned.map((trick, i) => (
            <span key={i} className="text-sm mx-0.5">
              {trick === 'roll' ? '🔄' : 
               trick === 'dead' ? '💀' : 
               trick === 'dance' ? '💃' : 
               trick === 'fireball' ? '🔥' : '✨'}
            </span>
          ))}
        </div>
      )}

      {/* Subtle shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}
