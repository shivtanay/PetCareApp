import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const petEmojis = {
  dragon: { egg: '🥚', hatchling: '🐣', grown: '🐲' },
  cerberus: { egg: '🥚', hatchling: '🐕', grown: '🐺' },
  kitsune: { egg: '🥚', hatchling: '🦊', grown: '🦊' },
  phoenix: { egg: '🥚', hatchling: '🐤', grown: '🔥' }
};

const moodFaces = {
  happy: '😊',
  content: '🙂',
  tired: '😴',
  hungry: '😩',
  sad: '😢',
  sick: '🤒',
  excited: '🤩'
};

// Particle colors based on pet species
const particleColors = {
  dragon: ['#ff6b6b', '#ffa502', '#ff4757'],
  cerberus: ['#9b59b6', '#8e44ad', '#6c5ce7'],
  kitsune: ['#f39c12', '#e67e22', '#fd9644'],
  phoenix: ['#ffd32a', '#ff6b81', '#ff4757']
};

// Color variant glow colors
const variantGlowColors = {
  default: null, // Use species default
  golden: 'rgba(251, 191, 36, 0.6)',
  cosmic: 'rgba(168, 85, 247, 0.6)',
  frost: 'rgba(34, 211, 238, 0.6)',
};

// Color variant particle colors
const variantParticleColors = {
  default: null, // Use species default
  golden: ['#fbbf24', '#f59e0b', '#fcd34d', '#fef3c7'],
  cosmic: ['#a855f7', '#7c3aed', '#c084fc', '#e879f9'],
  frost: ['#22d3ee', '#06b6d4', '#67e8f9', '#a5f3fc'],
};

const trickData = [
  { id: 'roll', name: 'Roll Over', icon: '🔄' },
  { id: 'dead', name: 'Play Dead', icon: '💀' },
  { id: 'dance', name: 'Dance', icon: '💃' },
  { id: 'fireball', name: 'Fireball', icon: '🔥' },
];

export default function PetDisplay({ pet, mood, isAnimating, performingTrick, onPerformTrick }) {
  const baseEmoji = petEmojis[pet.species]?.[pet.stage] || '🥚';
  const colorVariant = pet.color_variant || 'default';
  
  // Special case: Show egg yolk when egg plays dead
  const isEggPlayingDead = pet.stage === 'egg' && performingTrick === 'dead';
  const emoji = isEggPlayingDead ? '🍳' : baseEmoji;
  
  // Get colors based on variant, fallback to species colors
  const colors = variantParticleColors[colorVariant] || particleColors[pet.species] || particleColors.dragon;
  const learnedTricks = pet.tricks || [];
  
  // Trick-specific animations - use simpler keyframes for roll
  const getTrickAnimation = () => {
    switch(performingTrick) {
      case 'roll':
        return { 
          rotateZ: [0, 360, 720], 
          scale: [1, 0.9, 1],
          y: [0, 10, 0]
        };
      case 'dead':
        // Special animation for egg playing dead - cracking effect
        if (isEggPlayingDead) {
          return { 
            scale: [1, 1.2, 1.1, 1.1, 1.1, 1], 
            rotate: [0, -10, 10, 0, 0, 0], 
            y: [0, -20, 0, 0, 0, 0],
            opacity: [1, 1, 1, 1, 1, 1]
          };
        }
        return { rotate: [0, 0, 90, 90, 0], opacity: [1, 1, 0.5, 0.5, 1], y: [0, 0, 20, 20, 0] };
      case 'dance':
        return { rotate: [0, -15, 15, -15, 15, 0], x: [-20, 20, -20, 20, 0], scale: [1, 1.1, 1, 1.1, 1] };
      case 'fireball':
        return { 
          scale: [1, 1.2, 1.4, 1.2, 1], 
          y: [0, -20, -40, -20, 0],
        };
      default:
        return null;
    }
  };

  const getTrickTransition = () => {
    switch(performingTrick) {
      case 'roll':
        return { duration: 1.5, ease: "easeInOut" };
      case 'fireball':
        return { duration: 2, ease: "easeOut" };
      default:
        return { duration: 2, ease: "easeInOut" };
    }
  };

  const getMoodAnimation = () => {
    switch(mood) {
      case 'happy':
      case 'excited':
        return { y: [0, -25, 0], rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] };
      case 'tired':
        return { y: [0, 3, 0], opacity: [1, 0.6, 1], rotate: [-2, 2, -2] };
      case 'sad':
      case 'hungry':
        return { y: [0, 8, 0], scale: [1, 0.92, 1], rotate: [0, -3, 0] };
      case 'sick':
        return { rotate: [-5, 5, -5], x: [-5, 5, -5], scale: [1, 0.95, 1] };
      default:
        return { y: [0, -8, 0], scale: [1, 1.02, 1] };
    }
  };

  const getGlowColor = () => {
    // Check for color variant first
    if (colorVariant !== 'default' && variantGlowColors[colorVariant]) {
      return variantGlowColors[colorVariant];
    }
    // Fall back to species-based colors
    switch(pet.species) {
      case 'dragon': return 'rgba(255, 100, 50, 0.5)';
      case 'cerberus': return 'rgba(139, 92, 246, 0.5)';
      case 'kitsune': return 'rgba(251, 146, 60, 0.5)';
      case 'phoenix': return 'rgba(250, 204, 21, 0.6)';
      default: return 'rgba(150, 100, 255, 0.4)';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Multi-layer magical glow effect */}
      <motion.div
        className="absolute w-48 h-48 rounded-full blur-3xl"
        style={{ backgroundColor: getGlowColor() }}
        animate={{ 
          scale: [1, 1.3, 1], 
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-32 h-32 rounded-full blur-2xl"
        style={{ backgroundColor: getGlowColor() }}
        animate={{ 
          scale: [1.2, 1, 1.2], 
          opacity: [0.4, 0.7, 0.4] 
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: colors[i % colors.length],
            boxShadow: `0 0 10px ${colors[i % colors.length]}`
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: colors[i % colors.length],
              transform: `translateX(${50 + i * 8}px)`
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        </motion.div>
      ))}
      
      {/* Floating sparkle particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 70}%`,
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
            backgroundColor: colors[i % colors.length],
            boxShadow: `0 0 8px ${colors[i % colors.length]}`,
          }}
          animate={{
            y: [-30, -60, -30],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0, 1, 0],
            scale: [0.3, 1.2, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Egg Play Dead Effect - Cracking and Sizzling */}
      <AnimatePresence>
        {isEggPlayingDead && (
          <>
            {/* Eggshell pieces flying out */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`shell-${i}`}
                className="absolute z-20 text-xl"
                style={{ left: '50%', top: '40%' }}
                initial={{ scale: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1, 0.5],
                  x: Math.cos(i * 45 * Math.PI / 180) * 80,
                  y: Math.sin(i * 45 * Math.PI / 180) * 60 + 30,
                  rotate: [0, Math.random() * 360],
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
              >
                🥚
              </motion.div>
            ))}
            {/* Steam/sizzle effect */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`steam-${i}`}
                className="absolute z-20 text-lg"
                style={{ 
                  left: `${40 + i * 5}%`, 
                  top: '35%' 
                }}
                initial={{ y: 0, opacity: 0, scale: 0.5 }}
                animate={{
                  y: [-20, -60],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0.8],
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: 0.3 + i * 0.15,
                  repeat: 1,
                }}
              >
                💨
              </motion.div>
            ))}
            {/* Yellow yolk glow */}
            <motion.div
              className="absolute z-5 rounded-full blur-2xl"
              style={{
                left: '50%',
                top: '50%',
                width: '120px',
                height: '120px',
                marginLeft: '-60px',
                marginTop: '-60px',
                background: 'radial-gradient(circle, rgba(255,200,50,0.7) 0%, rgba(255,150,0,0.3) 50%, transparent 70%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1.3], opacity: [0, 0.8, 0.6] }}
              transition={{ duration: 0.5 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
            />
            {/* "Crack!" text effect */}
            <motion.div
              className="absolute z-30 text-2xl font-bold text-white"
              style={{ 
                left: '50%', 
                top: '20%',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(255,200,0,0.8)'
              }}
              initial={{ scale: 0, x: '-50%', y: 0 }}
              animate={{ 
                scale: [0, 1.5, 1],
                y: [0, -20, -30],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1 }}
            >
              💥 CRACK!
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fireball Effect Particles */}
      <AnimatePresence>
        {performingTrick === 'fireball' && (
          <>
            {/* Fire particles shooting out */}
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={`fire-${i}`}
                className="absolute z-20 rounded-full"
                style={{
                  left: '50%',
                  top: '40%',
                  width: `${8 + Math.random() * 12}px`,
                  height: `${8 + Math.random() * 12}px`,
                  background: `radial-gradient(circle, ${['#ff4500', '#ff6600', '#ffcc00', '#ff3300'][i % 4]} 0%, transparent 70%)`,
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: [0, (Math.random() - 0.5) * 150],
                  y: [0, -80 - Math.random() * 100],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
              />
            ))}
            {/* Center fire glow */}
            <motion.div
              className="absolute z-15 rounded-full blur-xl"
              style={{
                left: '50%',
                top: '40%',
                width: '100px',
                height: '100px',
                marginLeft: '-50px',
                marginTop: '-50px',
                background: 'radial-gradient(circle, rgba(255,100,0,0.8) 0%, rgba(255,200,0,0.4) 50%, transparent 70%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 2.5, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2 }}
            />
            {/* Fire emoji burst */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`emoji-fire-${i}`}
                className="absolute z-20 text-2xl"
                style={{ left: '50%', top: '40%' }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos(i * 45 * Math.PI / 180) * 80,
                  y: Math.sin(i * 45 * Math.PI / 180) * 80 - 40,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.05 }}
              >
                🔥
              </motion.div>
            ))}
          </>
        )}

        {/* Dance Confetti Effect */}
        {performingTrick === 'dance' && (
          <>
            {/* Confetti pieces falling */}
            {[...Array(24)].map((_, i) => {
              const confettiColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#1dd1a1', '#5f27cd', '#ff9f43', '#00d2d3'];
              const startX = (Math.random() - 0.5) * 200;
              return (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute z-20"
                  style={{
                    left: '50%',
                    top: '30%',
                    width: `${6 + Math.random() * 8}px`,
                    height: `${6 + Math.random() * 8}px`,
                    backgroundColor: confettiColors[i % confettiColors.length],
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  }}
                  initial={{ x: startX, y: -50, rotate: 0, opacity: 1 }}
                  animate={{
                    x: [startX, startX + (Math.random() - 0.5) * 100],
                    y: [-50, 150],
                    rotate: [0, Math.random() * 720 - 360],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                />
              );
            })}
            {/* Sparkle bursts */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`dance-sparkle-${i}`}
                className="absolute z-20 text-2xl"
                style={{ left: '50%', top: '40%' }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: Math.cos(i * 60 * Math.PI / 180) * 70,
                  y: Math.sin(i * 60 * Math.PI / 180) * 70,
                  rotate: [0, 180],
                }}
                transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
              >
                {['✨', '🎵', '🎶', '⭐', '💫', '🌟'][i]}
              </motion.div>
            ))}
            {/* Disco glow */}
            <motion.div
              className="absolute z-5 rounded-full blur-2xl"
              style={{
                left: '50%',
                top: '50%',
                width: '150px',
                height: '150px',
                marginLeft: '-75px',
                marginTop: '-75px',
              }}
              animate={{
                background: [
                  'radial-gradient(circle, rgba(255,100,200,0.5) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(100,200,255,0.5) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(255,200,100,0.5) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(100,255,200,0.5) 0%, transparent 70%)',
                ],
                scale: [1, 1.3, 1, 1.3, 1],
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Pet character with enhanced animation */}
      <motion.div
        className="relative z-10 text-8xl md:text-9xl select-none"
        style={{ transformStyle: 'preserve-3d' }}
        animate={performingTrick ? getTrickAnimation() : (isAnimating ? getMoodAnimation() : { 
          y: [0, -12, 0],
          scale: [1, 1.03, 1],
        })}
        transition={performingTrick ? getTrickTransition() : { 
          duration: isAnimating ? 0.5 : 2.5, 
          repeat: isAnimating ? 3 : Infinity,
          ease: "easeInOut" 
        }}
        whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
      >
        <motion.span
          style={{ 
            display: 'inline-block',
            filter: performingTrick === 'fireball' 
              ? 'drop-shadow(0 0 30px rgba(255,100,0,0.9))' 
              : `drop-shadow(0 0 20px ${getGlowColor()})`,
          }}
          animate={performingTrick === 'fireball' ? {
            filter: [
              'drop-shadow(0 0 20px rgba(255,100,0,0.5))',
              'drop-shadow(0 0 60px rgba(255,200,0,1))',
              'drop-shadow(0 0 80px rgba(255,50,0,1))',
              'drop-shadow(0 0 20px rgba(255,100,0,0.5))',
            ]
          } : {
            filter: [
              `drop-shadow(0 0 20px ${getGlowColor()})`,
              `drop-shadow(0 0 40px ${getGlowColor()})`,
              `drop-shadow(0 0 20px ${getGlowColor()})`,
            ]
          }}
          transition={{ duration: performingTrick === 'fireball' ? 2 : 2, repeat: performingTrick ? 0 : Infinity }}
        >
          {emoji}
        </motion.span>
      </motion.div>

      {/* Floating Trick Buttons */}
      {learnedTricks.length > 0 && onPerformTrick && (
        <div className="absolute inset-0 pointer-events-none z-30" style={{ width: '300px', height: '300px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          {trickData.filter(t => learnedTricks.includes(t.id)).map((trick, index, arr) => {
            const angle = (index / arr.length) * 360 - 90; // Start from top
            const radius = 130; // Distance from center
            const xPos = 150 + Math.cos(angle * Math.PI / 180) * radius - 20;
            const yPos = 150 + Math.sin(angle * Math.PI / 180) * radius - 20;
            
            return (
              <motion.button
                key={trick.id}
                className="absolute pointer-events-auto z-40"
                style={{ left: xPos, top: yPos }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                disabled={performingTrick || pet.energy < 10}
                onClick={() => onPerformTrick(trick)}
                title={`${trick.name} (10 energy)`}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${performingTrick || pet.energy < 10 
                      ? 'bg-gray-500/50 cursor-not-allowed' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 cursor-pointer'}
                    shadow-lg border-2 border-white/30`}
                  animate={{ 
                    y: [0, -5, 0],
                    boxShadow: [
                      '0 4px 15px rgba(168, 85, 247, 0.4)',
                      '0 8px 25px rgba(168, 85, 247, 0.6)',
                      '0 4px 15px rgba(168, 85, 247, 0.4)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {trick.icon}
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Mood indicator with bounce animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <motion.span 
            className="text-2xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {moodFaces[mood]}
          </motion.span>
          <span className="text-white/90 font-medium capitalize">{mood}</span>
        </motion.div>
      </AnimatePresence>

      {/* Stage badge with glow */}
      <motion.div
        className="mt-3 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-xs font-bold text-amber-900 uppercase tracking-wider relative overflow-hidden"
        whileHover={{ scale: 1.1 }}
        animate={{
          boxShadow: [
            '0 0 10px rgba(251, 191, 36, 0.3)',
            '0 0 25px rgba(251, 191, 36, 0.6)',
            '0 0 10px rgba(251, 191, 36, 0.3)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <span className="relative z-10">
          {pet.stage === 'egg' ? '🥚 Egg' : pet.stage === 'hatchling' ? '🐣 Hatchling' : '⭐ Fully Grown'}
        </span>
      </motion.div>
    </div>
  );
}
