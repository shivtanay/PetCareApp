import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

const wireColors = [
  { id: 'red', color: 'bg-red-500', border: 'border-red-400' },
  { id: 'blue', color: 'bg-blue-500', border: 'border-blue-400' },
  { id: 'yellow', color: 'bg-yellow-500', border: 'border-yellow-400' },
  { id: 'green', color: 'bg-green-500', border: 'border-green-400' },
];

export default function WireGame({ onComplete, onClose }) {
  const [leftWires] = useState(() => [...wireColors].sort(() => Math.random() - 0.5));
  const [rightWires] = useState(() => [...wireColors].sort(() => Math.random() - 0.5));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [connections, setConnections] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

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
      // Correct match
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
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-white/10"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">⚡ Fix the Wires!</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white/60" />
          </Button>
        </div>

        <div className="flex justify-between text-white/80 mb-4">
          <span>⏱️ Time: {timeLeft}s</span>
          <span>🔌 Connected: {Object.keys(connections).length}/4</span>
        </div>

        {!gameOver ? (
          <div className="relative bg-slate-700/50 rounded-2xl p-4 border border-slate-600">
            {/* Electrical panel look */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-mono">
              ⚠️ ELECTRICAL PANEL
            </div>
            
            <div className="flex justify-between items-center pt-6">
              {/* Left side wires */}
              <div className="flex flex-col gap-4">
                {leftWires.map((wire) => (
                  <motion.button
                    key={wire.id}
                    onClick={() => handleLeftClick(wire)}
                    disabled={connections[wire.id]}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-10 rounded-r-full ${wire.color} ${
                      selectedLeft?.id === wire.id ? 'ring-4 ring-white' : ''
                    } ${connections[wire.id] ? 'opacity-50' : ''} shadow-lg transition-all`}
                  >
                    {connections[wire.id] && <span className="text-white text-lg">✓</span>}
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
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        x1="0"
                        y1={y1}
                        x2="100%"
                        y2={y2}
                        stroke={wire.id === 'red' ? '#ef4444' : wire.id === 'blue' ? '#3b82f6' : wire.id === 'yellow' ? '#eab308' : '#22c55e'}
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Right side wires */}
              <div className="flex flex-col gap-4">
                {rightWires.map((wire) => (
                  <motion.button
                    key={wire.id}
                    onClick={() => handleRightClick(wire)}
                    disabled={connections[wire.id] || !selectedLeft}
                    whileHover={{ scale: selectedLeft ? 1.1 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-10 rounded-l-full ${wire.color} ${
                      connections[wire.id] ? 'opacity-50' : ''
                    } shadow-lg transition-all`}
                  >
                    {connections[wire.id] && <span className="text-white text-lg">✓</span>}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-64 flex flex-col items-center justify-center"
          >
            <span className="text-6xl mb-4">⚡</span>
            <h3 className="text-2xl font-bold text-white mb-2">Power Restored!</h3>
            <p className="text-white/70 mb-4">
              You earned <span className="text-yellow-400 font-bold">{Math.max(30 - mistakes * 5, 10)}</span> coins!
            </p>
            <Button 
              onClick={handleFinish}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-orange-900 font-bold"
            >
              Collect Reward 💰
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}