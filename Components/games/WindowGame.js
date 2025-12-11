import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

export default function WindowGame({ onComplete, onClose }) {
  const canvasRef = useRef(null);
  const [cleanPercentage, setCleanPercentage] = useState(0);
  const [isWiping, setIsWiping] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Create dirty window effect
    ctx.fillStyle = 'rgba(139, 90, 43, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some dirt spots
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        10 + Math.random() * 30,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(100, 70, 30, ${0.3 + Math.random() * 0.4})`;
      ctx.fill();
    }
  }, []);

  const handleWipe = (e) => {
    if (!isWiping) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    
    // Clear circular area
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Calculate clean percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let totalPixels = imageData.data.length / 4;
    let cleanPixels = 0;
    
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) cleanPixels++;
    }
    
    const newPercentage = Math.round((cleanPixels / totalPixels) * 100);
    setCleanPercentage(newPercentage);
    
    if (newPercentage >= 85) {
      setGameOver(true);
    }
  };

  const handleFinish = () => {
    const reward = Math.round(cleanPercentage * 0.25);
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
          <h2 className="text-xl font-bold text-white">🪟 Clean the Window!</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white/60" />
          </Button>
        </div>

        <div className="flex justify-between text-white/80 mb-4">
          <span>✨ Clean: {cleanPercentage}%</span>
          <span className="text-xs text-white/50">Drag to wipe!</span>
        </div>

        {!gameOver ? (
          <div className="relative rounded-2xl overflow-hidden border-4 border-amber-700/50">
            {/* Sky background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200" />
            
            {/* Dirty overlay canvas */}
            <canvas
              ref={canvasRef}
              className="relative w-full h-64 cursor-pointer touch-none"
              onMouseDown={() => setIsWiping(true)}
              onMouseUp={() => setIsWiping(false)}
              onMouseLeave={() => setIsWiping(false)}
              onMouseMove={handleWipe}
              onTouchStart={() => setIsWiping(true)}
              onTouchEnd={() => setIsWiping(false)}
              onTouchMove={handleWipe}
            />
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                animate={{ width: `${cleanPercentage}%` }}
              />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-64 flex flex-col items-center justify-center"
          >
            <span className="text-6xl mb-4">✨</span>
            <h3 className="text-2xl font-bold text-white mb-2">Sparkling Clean!</h3>
            <p className="text-white/70 mb-4">You earned <span className="text-yellow-400 font-bold">{Math.round(cleanPercentage * 0.25)}</span> coins!</p>
            <Button 
              onClick={handleFinish}
              className="bg-gradient-to-r from-cyan-400 to-teal-500 text-teal-900 font-bold"
            >
              Collect Reward 💰
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}