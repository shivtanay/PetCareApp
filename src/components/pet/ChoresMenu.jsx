import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Sparkles } from 'lucide-react';

const chores = [
  { 
    id: 'trash', 
    name: 'Take Out Trash', 
    icon: '🗑️',
    reward: '10-20',
    difficulty: 'Easy',
    time: '20 sec',
    color: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(251, 191, 36, 0.4)'
  },
  { 
    id: 'window', 
    name: 'Clean Windows', 
    icon: '🪟',
    reward: '15-25',
    difficulty: 'Medium',
    time: '30 sec',
    color: 'from-cyan-400 to-blue-500',
    glowColor: 'rgba(34, 211, 238, 0.4)'
  },
  { 
    id: 'wire', 
    name: 'Fix Electrical', 
    icon: '⚡',
    reward: '20-30',
    difficulty: 'Hard',
    time: '45 sec',
    color: 'from-yellow-400 to-red-500',
    glowColor: 'rgba(250, 204, 21, 0.4)'
  },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { scale: 0.8, y: 50, opacity: 0, rotateX: -15 },
  visible: { 
    scale: 1, 
    y: 0, 
    opacity: 1, 
    rotateX: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { scale: 0.8, y: 50, opacity: 0, transition: { duration: 0.2 } }
};

const choreVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: i * 0.12, type: "spring", stiffness: 200 }
  })
};

export default function ChoresMenu({ onSelectChore, onClose }) {
  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      {/* Floating coins in background */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        >
          💰
        </motion.div>
      ))}

      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/10 relative overflow-hidden"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-50"
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), transparent)',
            backgroundSize: '200% 100%'
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Sparkle decorations */}
        <motion.div
          className="absolute top-4 right-16 text-yellow-400"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 text-amber-400"
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <motion.h2 
            className="text-2xl font-bold text-white flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🧹
            </motion.span>
            Earn Coins!
          </motion.h2>
          <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-white/60" />
            </Button>
          </motion.div>
        </div>

        <motion.p 
          className="text-white/60 text-sm mb-6 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Complete chores to earn coins for your pet's care!
        </motion.p>

        <div className="space-y-3 relative z-10">
          {chores.map((chore, index) => (
            <motion.button
              key={chore.id}
              custom={index}
              variants={choreVariants}
              initial="hidden"
              animate="visible"
              onClick={() => onSelectChore(chore.id)}
              whileHover={{ 
                scale: 1.03, 
                x: 5,
                boxShadow: `0 10px 30px ${chore.glowColor}` 
              }}
              whileTap={{ scale: 0.97 }}
              className={`w-full p-4 rounded-2xl bg-gradient-to-r ${chore.color} 
                transition-all shadow-lg relative overflow-hidden group`}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="flex items-center gap-4 relative z-10">
                <motion.span 
                  className="text-4xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2 + index * 0.5, repeat: Infinity }}
                >
                  {chore.icon}
                </motion.span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-white">{chore.name}</h3>
                  <div className="flex gap-3 text-xs text-white/80 mt-1">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      💰 {chore.reward}
                    </motion.span>
                    <span>⏱️ {chore.time}</span>
                    <motion.span 
                      className="px-2 py-0.5 bg-white/20 rounded-full"
                      whileHover={{ scale: 1.1 }}
                    >
                      {chore.difficulty}
                    </motion.span>
                  </div>
                </div>
                <motion.div
                  className="text-white/60"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
