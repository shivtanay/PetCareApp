import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Zap } from 'lucide-react';

const wireColors = [
  { id: 'red', color: 'bg-red-500', border: 'border-red-400', glow: 'rgba(239, 68, 68, 0.5)' },
  { id: 'blue', color: 'bg-blue-500', border: 'border-blue-400', glow: 'rgba(59, 130, 246, 0.5)' },
  { id: 'yellow', color: 'bg-yellow-500', border: 'border-yellow-400', glow: 'rgba(234, 179, 8, 0.5)' },
  { id: 'green', color: 'bg-green-500', border: 'border-green-400', glow: 'rgba(34, 197, 94, 0.5)' },
];

export default function WireGame({ onComplete, onClose }) {
  const [leftWires] = useState(() => [...wireColors].sort(() => Math.random() - 0.5));
  const [rightWires] = useState(() => [...wireColors].sort(() => Math.random() - 0.5));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [connections, setConnections] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [sparkEffect, setSparkEffect] = useState(null);

  React.useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleLeftClick = (wire) => {
    if (connections[wire.id]) return;
    setSelectedLeft(wire);
  };

  const handleRightClick = (wire) => {
    if (!selectedLeft) return;
    
    if (selectedLeft.id === wire.id) {
      // Correct match - show spark effect
      setSparkEffect(wire.id);
      setTimeout(() => setSparkEffect(null), 500);
      
      const newConnections = { ...connections, [wire.id]: true };
      setConnections(newConnections);
      setSelectedLeft(null);
      
      if (Object.keys(newConnections).length === 4) {
        setGameOver(true);
      }
    } else {
      // Wrong match
      setMistakes(mistakes + 1);
      setSelectedLeft(null);
    }
  };

  const handleFinish = () => {
    const baseReward = 30;
    const penalty = mistakes * 5;
    onComplete(Math.max(baseReward - penalty, 10));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      {/* Background electricity effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400/20 pointer-events-none"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <Zap className="w-6 h-6" />
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
            background: 'linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.2), transparent)',
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
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            Fix the Wires!
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
            key={Object.keys(connections).length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
          >
            🔌 Connected: {Object.keys(connections).length}/4
          </motion.span>
        </div>

        {!gameOver ? (
          <div className="relative bg-slate-700/50 rounded-2xl p-4 border border-slate-600">
            {/* Electrical panel look */}
            <motion.div 
              className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-mono flex items-center gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ⚠️
              </motion.span>
              ELECTRICAL PANEL
            </motion.div>
            
            <div className="flex justify-between items-center pt-6">
              {/* Left side wires */}
              <div className="flex flex-col gap-4">
                {leftWires.map((wire, index) => (
                  <motion.button
                    key={wire.id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleLeftClick(wire)}
                    disabled={connections[wire.id]}
                    whileHover={{ scale: connections[wire.id] ? 1 : 1.1, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-10 rounded-r-full ${wire.color} ${
                      selectedLeft?.id === wire.id ? 'ring-4 ring-white' : ''
                    } ${connections[wire.id] ? 'opacity-50' : ''} shadow-lg transition-all relative overflow-hidden`}
                    style={{
                      boxShadow: selectedLeft?.id === wire.id ? `0 0 20px ${wire.glow}` : 'none'
                    }}
                  >
                    {/* Electricity flow animation */}
                    {selectedLeft?.id === wire.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                    {connections[wire.id] && (
                      <motion.span 
                        className="text-white text-lg relative z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Connection lines visualization */}
              <div className="flex-1 relative h-48 mx-4">
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  {Object.keys(connections).map((colorId) => {
                    const leftIndex = leftWires.findIndex(w => w.id === colorId);
                    const rightIndex = rightWires.findIndex(w => w.id === colorId);
                    const wire = wireColors.find(w => w.id === colorId);
                    
                    const y1 = leftIndex * 56 + 20;
                    const y2 = rightIndex * 56 + 20;
                    
                    return (
                      <motion.line
                        key={colorId}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        x1="0"
                        y1={y1}
                        x2="100%"
                        y2={y2}
                        stroke={wire.id === 'red' ? '#ef4444' : wire.id === 'blue' ? '#3b82f6' : wire.id === 'yellow' ? '#eab308' : '#22c55e'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        filter="url(#glow)"
                      />
                    );
                  })}
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                </svg>
                
                {/* Spark effect on connection */}
                <AnimatePresence>
                  {sparkEffect && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                    >
                      <span className="text-4xl">⚡</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right side wires */}
              <div className="flex flex-col gap-4">
                {rightWires.map((wire, index) => (
                  <motion.button
                    key={wire.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleRightClick(wire)}
                    disabled={connections[wire.id] || !selectedLeft}
                    whileHover={{ scale: selectedLeft && !connections[wire.id] ? 1.1 : 1, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-10 rounded-l-full ${wire.color} ${
                      connections[wire.id] ? 'opacity-50' : ''
                    } shadow-lg transition-all relative overflow-hidden`}
                    style={{
                      boxShadow: selectedLeft && !connections[wire.id] ? `0 0 15px ${wire.glow}` : 'none'
                    }}
                  >
                    {connections[wire.id] && (
                      <motion.span 
                        className="text-white text-lg relative z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <p className="text-center text-white/50 text-xs mt-4">
              Match wires by color: tap left, then tap matching right
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-64 flex flex-col items-center justify-center relative"
          >
            {/* Celebration electricity */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0 }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * 80,
                  y: Math.sin(i * 30 * Math.PI / 180) * 80,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {i % 2 === 0 ? '⚡' : '✨'}
              </motion.div>
            ))}
            
            <motion.span 
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            <motion.h3 
              className="text-2xl font-bold text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Power Restored!
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
              >{Math.max(30 - mistakes * 5, 10)}</motion.span> coins!
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
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-orange-900 font-bold relative overflow-hidden"
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
