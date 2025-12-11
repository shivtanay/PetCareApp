import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Trash2, SprayCan, Zap, X } from 'lucide-react';

const chores = [
  { 
    id: 'trash', 
    name: 'Take Out Trash', 
    icon: '🗑️',
    reward: '10-20',
    difficulty: 'Easy',
    time: '20 sec',
    color: 'from-amber-400 to-orange-500'
  },
  { 
    id: 'window', 
    name: 'Clean Windows', 
    icon: '🪟',
    reward: '15-25',
    difficulty: 'Medium',
    time: '30 sec',
    color: 'from-cyan-400 to-blue-500'
  },
  { 
    id: 'wire', 
    name: 'Fix Electrical', 
    icon: '⚡',
    reward: '20-30',
    difficulty: 'Hard',
    time: '45 sec',
    color: 'from-yellow-400 to-red-500'
  },
];

export default function ChoresMenu({ onSelectChore, onClose }) {
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
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">🧹 Earn Coins!</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white/60" />
          </Button>
        </div>

        <p className="text-white/60 text-sm mb-6">
          Complete chores to earn coins for your pet's care!
        </p>

        <div className="space-y-3">
          {chores.map((chore, index) => (
            <motion.button
              key={chore.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectChore(chore.id)}
              className={`w-full p-4 rounded-2xl bg-gradient-to-r ${chore.color} 
                hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{chore.icon}</span>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-white">{chore.name}</h3>
                  <div className="flex gap-3 text-xs text-white/80 mt-1">
                    <span>💰 {chore.reward}</span>
                    <span>⏱️ {chore.time}</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-full">
                      {chore.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}