import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Trophy, Sparkles, Star } from 'lucide-react';

const allAchievements = [
  { id: 'first_feed', name: 'First Meal', icon: '🍖', description: 'Feed your pet for the first time' },
  { id: 'caretaker', name: 'Super Caretaker', icon: '🏆', description: 'Keep all stats above 80% for 3 days' },
  { id: 'wealthy', name: 'Financial Genius', icon: '💰', description: 'Save up 200 coins' },
  { id: 'electrician', name: 'Master Electrician', icon: '⚡', description: 'Complete wire game 5 times' },
  { id: 'clean_freak', name: 'Clean Freak', icon: '✨', description: 'Clean windows 10 times' },
  { id: 'hatchling', name: 'New Life', icon: '🐣', description: 'Evolve pet to hatchling stage' },
  { id: 'fully_grown', name: 'Full Potential', icon: '⭐', description: 'Evolve pet to fully grown' },
  { id: 'week_alive', name: 'Week Together', icon: '📅', description: 'Care for your pet for 7 days' },
  { id: 'playtime', name: 'Best Friend', icon: '🎮', description: 'Play with your pet 20 times' },
  { id: 'insured', name: 'Safety First', icon: '🛡️', description: 'Purchase pet insurance' },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { scale: 0.8, y: 50, opacity: 0 },
  visible: { 
    scale: 1, 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  },
  exit: { scale: 0.8, y: 50, opacity: 0 }
};

const achievementVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: i * 0.06, type: "spring", stiffness: 200 }
  })
};

export default function Achievements({ unlockedAchievements = [], onClose }) {
  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      {/* Floating trophy particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{ left: `${15 + i * 14}%`, top: `${15 + (i % 3) * 30}%` }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {i % 2 === 0 ? '🏆' : '⭐'}
        </motion.div>
      ))}

      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-auto shadow-2xl border border-white/10 relative"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none"
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.4), transparent)',
            backgroundSize: '200% 100%'
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-6 h-6 text-yellow-400" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
          </div>
          <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-white/60" />
            </Button>
          </motion.div>
        </div>

        <motion.div 
          className="text-white/60 text-sm mb-4 flex items-center gap-2 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
          <span>{unlockedAchievements.length} / {allAchievements.length} unlocked</span>
        </motion.div>

        <div className="space-y-2 relative z-10">
          {allAchievements.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            
            return (
              <motion.div
                key={achievement.id}
                custom={index}
                variants={achievementVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                  scale: 1.02, 
                  x: 5,
                  boxShadow: isUnlocked ? '0 5px 20px rgba(250, 204, 21, 0.2)' : 'none'
                }}
                className={`p-3 rounded-xl flex items-center gap-3 relative overflow-hidden ${
                  isUnlocked 
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/30' 
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {/* Shimmer effect for unlocked */}
                {isUnlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                )}
                
                <motion.div 
                  className={`text-3xl relative z-10 ${isUnlocked ? '' : 'grayscale opacity-40'}`}
                  animate={isUnlocked ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  } : {}}
                  transition={{ duration: 2 + index * 0.2, repeat: Infinity }}
                >
                  {isUnlocked ? achievement.icon : '🔒'}
                </motion.div>
                <div className="flex-1 relative z-10">
                  <h3 className={`font-semibold ${isUnlocked ? 'text-yellow-300' : 'text-white/40'}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-xs ${isUnlocked ? 'text-white/70' : 'text-white/30'}`}>
                    {achievement.description}
                  </p>
                </div>
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
