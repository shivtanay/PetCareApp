import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

const trashItems = ['🍌', '📦', '🥫', '📰', '🍎', '🥤', '🍕', '📝'];

export default function TrashGame({ onComplete, onClose }) {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Generate random trash items
    const initialItems = [...Array(8)].map((_, i) => ({
      id: i,
      emoji: trashItems[Math.floor(Math.random() * trashItems.length)],
      x: 10 + Math.random() * 70,
      y: 10 + Math.random() * 50,
    }));
    setItems(initialItems);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleItemClick = (id) => {
    setItems(items.filter(item => item.id !== id));
    setScore(score + 2);
    
    if (items.length <= 1) {
      setGameOver(true);
    }
  };

  const handleFinish = () => {
    const reward = 5 + Math.floor(Math.random() * 6); // 5-10 coins
    onComplete(reward);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/10"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">🗑️ Take Out the Trash!</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white/60" />
          </Button>
        </div>

        <div className="flex justify-between text-white/80 mb-4">
          <span>⏱️ Time: {timeLeft}s</span>
          <span>💰 Score: {score}</span>
        </div>

        {!gameOver ? (
          <div className="relative h-64 bg-gradient-to-b from-amber-900/30 to-amber-800/20 rounded-2xl border-2 border-dashed border-amber-500/30 overflow-hidden">
            <AnimatePresence>
              {items.map(item => (
                <motion.button
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, rotate: 360 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleItemClick(item.id)}
                  className="absolute text-3xl cursor-pointer hover:drop-shadow-lg transition-all"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  {item.emoji}
                </motion.button>
              ))}
            </AnimatePresence>
            
            {/* Trash bin */}
            <div className="absolute bottom-2 right-2 text-4xl">🗑️</div>
            <p className="absolute bottom-2 left-2 text-white/50 text-xs">Tap trash to collect!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-64 flex flex-col items-center justify-center"
          >
            <span className="text-6xl mb-4">🎉</span>
            <h3 className="text-2xl font-bold text-white mb-2">Great Job!</h3>
            <p className="text-white/70 mb-4">You earned <span className="text-yellow-400 font-bold">{5 + Math.floor(Math.random() * 6)}</span> coins!</p>
            <Button 
              onClick={handleFinish}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 font-bold"
            >
              Collect Reward 💰
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}