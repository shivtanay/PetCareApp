import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Lock, Trophy } from 'lucide-react';

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

export default function Achievements({ unlockedAchievements = [], onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-auto shadow-2xl border border-white/10"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white/60" />
          </Button>
        </div>

        <p className="text-white/60 text-sm mb-4">
          {unlockedAchievements.length} / {allAchievements.length} unlocked
        </p>

        <div className="space-y-2">
          {allAchievements.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-xl flex items-center gap-3 ${
                  isUnlocked 
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-yellow-500/30' 
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${isUnlocked ? 'text-yellow-300' : 'text-white/40'}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-xs ${isUnlocked ? 'text-white/70' : 'text-white/30'}`}>
                    {achievement.description}
                  </p>
                </div>
                {isUnlocked && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xl"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}