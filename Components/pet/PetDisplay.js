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

export default function PetDisplay({ pet, mood, isAnimating }) {
  const emoji = petEmojis[pet.species]?.[pet.stage] || '🥚';
  
  const getMoodAnimation = () => {
    switch(mood) {
      case 'happy':
      case 'excited':
        return { y: [0, -20, 0], rotate: [0, 5, -5, 0] };
      case 'tired':
        return { y: [0, 2, 0], opacity: [1, 0.7, 1] };
      case 'sad':
      case 'hungry':
        return { y: [0, 5, 0], scale: [1, 0.95, 1] };
      case 'sick':
        return { rotate: [-2, 2, -2], x: [-2, 2, -2] };
      default:
        return { y: [0, -5, 0] };
    }
  };

  const getGlowColor = () => {
    switch(pet.species) {
      case 'dragon': return 'rgba(255, 100, 50, 0.4)';
      case 'cerberus': return 'rgba(100, 50, 150, 0.4)';
      case 'kitsune': return 'rgba(255, 150, 50, 0.4)';
      case 'phoenix': return 'rgba(255, 200, 50, 0.5)';
      default: return 'rgba(150, 100, 255, 0.4)';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Magical glow effect */}
      <motion.div
        className="absolute w-40 h-40 rounded-full blur-3xl"
        style={{ backgroundColor: getGlowColor() }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-yellow-300/60"
          style={{
            left: `${30 + Math.random() * 40}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Pet character */}
      <motion.div
        className="relative z-10 text-8xl md:text-9xl select-none"
        animate={isAnimating ? getMoodAnimation() : { y: [0, -8, 0] }}
        transition={{ 
          duration: isAnimating ? 0.5 : 2, 
          repeat: isAnimating ? 3 : Infinity,
          ease: "easeInOut" 
        }}
      >
        {emoji}
      </motion.div>

      {/* Mood indicator */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <span className="text-2xl">{moodFaces[mood]}</span>
          <span className="text-white/90 font-medium capitalize">{mood}</span>
        </motion.div>
      </AnimatePresence>

      {/* Stage badge */}
      <motion.div
        className="mt-3 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-xs font-bold text-amber-900 uppercase tracking-wider"
        whileHover={{ scale: 1.05 }}
      >
        {pet.stage === 'egg' ? '🥚 Egg' : pet.stage === 'hatchling' ? '🐣 Hatchling' : '⭐ Fully Grown'}
      </motion.div>
    </div>
  );
}