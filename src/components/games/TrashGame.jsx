import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Sparkles } from 'lucide-react';

const trashItems = ['🍌', '📦', '🥫', '📰', '🍎', '🥤', '🍕', '📝'];

export default function TrashGame({ onComplete, onClose }) {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [collectEffects, setCollectEffects] = useState([]);

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

  const handleItemClick = (id, x, y) => {
    // Add collect effect
    const effect = { id: Date.now(), x, y };
    setCollectEffects(prev => [...prev, effect]);
    setTimeout(() => {
      setCollectEffects(prev => prev.filter(e => e.id !== effect.id));
    }, 1000);
    
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
      {/* Background sparkles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-amber-400/30 pointer-events-none"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      ))}
      
      <motion.div
        initial={{ scale: 0.8, y: 30, rotateX: -10 }}
        animate={{ scale: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/10 relative overflow-hidden"
      >
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent)',
            backgroundSize: '200% 100%'
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <motion.h2 
            className="text-xl font-bold text-white flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🗑️
            </motion.span>
            Take Out the Trash!
          </motion.h2>
          <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-white/60" />
            </Button>
          </motion.div>
        </div>

        <div className="flex justify-between text-white/80 mb-4 relative z-10">
          <motion.span
            animate={timeLeft <= 5 ? { scale: [1, 1.1, 1], color: ['#fff', '#f87171', '#fff'] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ⏱️ Time: {timeLeft}s
          </motion.span>
          <motion.span
            key={score}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
          >
            💰 Score: {score}
          </motion.span>
        </div>

        {!gameOver ? (
          <div className="relative h-64 bg-gradient-to-b from-amber-900/30 to-amber-800/20 rounded-2xl border-2 border-dashed border-amber-500/30 overflow-hidden">
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(251,191,36,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
              animate={{ backgroundPosition: ['0 0', '20px 20px'] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Collect effects */}
            <AnimatePresence>
              {collectEffects.map(effect => (
                <motion.div
                  key={effect.id}
                  className="absolute pointer-events-none"
                  style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0, y: -30 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-xl">+2 💰</span>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -5, 0],
                  }}
                  exit={{ scale: 0, rotate: 360, opacity: 0 }}
                  transition={{
                    y: { duration: 1 + index * 0.2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                  whileTap={{ scale: 0.5 }}
                  onClick={() => handleItemClick(item.id, item.x, item.y)}
                  className="absolute text-3xl cursor-pointer hover:drop-shadow-lg transition-all"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  {item.emoji}
                </motion.button>
              ))}
            </AnimatePresence>
            
            {/* Trash bin */}
            <motion.div 
              className="absolute bottom-2 right-2 text-4xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🗑️
            </motion.div>
            <p className="absolute bottom-2 left-2 text-white/50 text-xs">Tap trash to collect!</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-64 flex flex-col items-center justify-center relative"
          >
            {/* Celebration particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * 100,
                  y: Math.sin(i * 30 * Math.PI / 180) * 100,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {['🎉', '⭐', '✨', '🎊'][i % 4]}
              </motion.div>
            ))}
            
            <motion.span 
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🎉
            </motion.span>
            <motion.h3 
              className="text-2xl font-bold text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Great Job!
            </motion.h3>
            <motion.p 
              className="text-white/70 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              You earned <motion.span 
                className="text-yellow-400 font-bold"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >{5 + Math.floor(Math.random() * 6)}</motion.span> coins!
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleFinish}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 font-bold relative overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="relative">Collect Reward 💰</span>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
