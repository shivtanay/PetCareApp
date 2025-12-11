import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Sparkles } from 'lucide-react';

export default function WindowGame({ onComplete, onClose }) {
  const canvasRef = useRef(null);
  const [cleanPercentage, setCleanPercentage] = useState(0);
  const [isWiping, setIsWiping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [sparkleEffects, setSparkleEffects] = useState([]);
  const totalDirtyPixelsRef = useRef(0);
  const canvasSizeRef = useRef({ width: 400, height: 256 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set fixed canvas size for consistency
    canvas.width = 400;
    canvas.height = 256;
    canvasSizeRef.current = { width: 400, height: 256 };
    
    // Create dirty window effect
    ctx.fillStyle = 'rgba(139, 90, 43, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some dirt spots
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        15 + Math.random() * 25,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(80, 50, 20, ${0.4 + Math.random() * 0.4})`;
      ctx.fill();
    }
    
    // Count initial dirty pixels (non-transparent)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let dirtyCount = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) dirtyCount++;
    }
    totalDirtyPixelsRef.current = dirtyCount;
  }, []);

  const handleWipe = (e) => {
    if (!isWiping) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get position and scale to canvas coordinates
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    // Add sparkle effect
    if (Math.random() > 0.6) {
      const effect = { id: Date.now() + Math.random(), x: (clientX - rect.left) / rect.width * 100, y: (clientY - rect.top) / rect.height * 100 };
      setSparkleEffects(prev => [...prev.slice(-5), effect]);
      setTimeout(() => {
        setSparkleEffects(prev => prev.filter(e => e.id !== effect.id));
      }, 600);
    }
    
    // Clear circular area with larger brush
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Calculate clean percentage based on remaining dirty pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let remainingDirty = 0;
    
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) remainingDirty++;
    }
    
    const cleaned = totalDirtyPixelsRef.current - remainingDirty;
    const newPercentage = totalDirtyPixelsRef.current > 0 
      ? Math.min(100, Math.round((cleaned / totalDirtyPixelsRef.current) * 100))
      : 0;
    
    setCleanPercentage(newPercentage);
    
    if (newPercentage >= 75) {
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
      {/* Background sparkles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-cyan-400/30 pointer-events-none"
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
            background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.2), transparent)',
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
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🪟
            </motion.span>
            Clean the Window!
          </motion.h2>
          <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-white/60" />
            </Button>
          </motion.div>
        </div>

        <div className="flex justify-between text-white/80 mb-4 relative z-10">
          <motion.span
            key={cleanPercentage}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.span>
            Clean: {cleanPercentage}%
          </motion.span>
          <span className="text-xs text-white/50">Drag to wipe!</span>
        </div>

        {!gameOver ? (
          <div className="relative rounded-2xl overflow-hidden border-4 border-amber-700/50">
            {/* Sky background with animated clouds */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-3xl"
                  style={{ top: `${20 + i * 25}%` }}
                  animate={{ x: ['-20%', '120%'] }}
                  transition={{ 
                    duration: 20 + i * 5, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: i * 5
                  }}
                >
                  ☁️
                </motion.div>
              ))}
            </div>
            
            {/* Sparkle effects while wiping */}
            {sparkleEffects.map(effect => (
              <motion.div
                key={effect.id}
                className="absolute text-xl pointer-events-none z-10"
                style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
              >
                ✨
              </motion.div>
            ))}
            
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
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 relative"
                animate={{ width: `${cleanPercentage}%` }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-64 flex flex-col items-center justify-center relative"
          >
            {/* Celebration sparkles */}
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
                ✨
              </motion.div>
            ))}
            
            <motion.span 
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.h3 
              className="text-2xl font-bold text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Sparkling Clean!
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
              >{Math.round(cleanPercentage * 0.25)}</motion.span> coins!
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
                className="bg-gradient-to-r from-cyan-400 to-teal-500 text-teal-900 font-bold relative overflow-hidden"
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
