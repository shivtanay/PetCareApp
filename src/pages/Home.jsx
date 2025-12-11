import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Heart, Coins, Trophy, ArrowLeft, Star } from 'lucide-react';

const features = [
  { icon: '🐲', title: '4 Mythical Pets', desc: 'Dragon, Cerberus, Kitsune, Phoenix' },
  { icon: '🥚', title: '3 Life Stages', desc: 'Egg → Hatchling → Fully Grown' },
  { icon: '💰', title: 'Economy System', desc: 'Earn coins through mini-games' },
  { icon: '🏆', title: 'Achievements', desc: 'Unlock badges as you progress' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

const floatVariants = {
  float: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

export default function Home() {
  const navigate = useNavigate();
  const { data: pets, isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: () => base44.entities.Pet.list(),
  });

  const hasPet = pets && pets.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(120, 0, 255, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(255, 100, 0, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(0, 255, 200, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(120, 0, 255, 0.15) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Animated stars/particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-yellow-300/40' : i % 3 === 1 ? 'bg-purple-400/30' : 'bg-white/30'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
            animate={{
              y: [0, -300],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.5, 1, 0.5],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
        
        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ top: `${10 + i * 20}%`, left: '-5%' }}
            animate={{
              x: ['0vw', '110vw'],
              y: ['0vh', '30vh'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 7 + 3,
              ease: "easeIn",
            }}
          >
            <div className="absolute w-20 h-0.5 bg-gradient-to-r from-white to-transparent -left-20 top-0" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Back button if user has pet */}
        {hasPet && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4"
          >
            <Button
              onClick={() => navigate(createPageUrl('PetCare'))}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pet
            </Button>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Floating pets with enhanced animations */}
          <div className="flex justify-center gap-4 mb-8">
            {['🐲', '🐺', '🦊', '🔥'].map((emoji, i) => (
              <motion.div
                key={emoji}
                className="relative"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
              >
                <motion.span
                  className="text-5xl md:text-6xl block"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  {emoji}
                </motion.span>
                {/* Glow effect under each pet */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-500/30 rounded-full blur-md"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              </motion.div>
            ))}
          </div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 inline-block"
              animate={{ 
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 100%' }}
            >
              Mythical Pet Care
            </motion.span>
          </motion.h1>
          <motion.h2 
            className="text-2xl md:text-3xl font-semibold text-purple-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Adventure
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-white/60 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Adopt, nurture, and watch your magical companion grow through three amazing life stages.
          </motion.p>
        </motion.div>

        {/* CTA Buttons with bounce animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          {hasPet ? (
            <Link to={createPageUrl('PetCare')}>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 10px 40px rgba(16, 185, 129, 0.3)',
                    '0 20px 60px rgba(16, 185, 129, 0.5)',
                    '0 10px 40px rgba(16, 185, 129, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button className="w-full sm:w-auto px-8 py-7 text-lg bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-emerald-900 font-bold rounded-2xl shadow-xl">
                  <motion.span 
                    className="mr-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Heart className="w-5 h-5" />
                  </motion.span>
                  Visit Your Pet
                </Button>
              </motion.div>
            </Link>
          ) : (
            <Link to={createPageUrl('PetAdopt')}>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    '0 10px 40px rgba(245, 158, 11, 0.3)',
                    '0 20px 60px rgba(245, 158, 11, 0.5)',
                    '0 10px 40px rgba(245, 158, 11, 0.3)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button className="w-full sm:w-auto px-8 py-7 text-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-900 font-bold rounded-2xl shadow-xl">
                  <motion.span 
                    className="mr-2"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.span>
                  Adopt Your Pet
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>

        {/* Features Grid with stagger animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.08, 
                y: -8,
                rotateY: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center cursor-pointer group relative overflow-hidden"
            >
              {/* Animated background gradient on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-purple-500/0 group-hover:from-amber-500/10 group-hover:to-purple-500/10 transition-all duration-300"
              />
              
              <motion.span 
                className="text-4xl block mb-3 relative z-10"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  y: [0, -3, 0],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: index * 0.5,
                  ease: "easeInOut" 
                }}
              >
                {feature.icon}
              </motion.span>
              <h3 className="text-white font-semibold text-sm mb-1 relative z-10">{feature.title}</h3>
              <p className="text-white/50 text-xs relative z-10">{feature.desc}</p>
              
              {/* Sparkle effect on hover */}
              <motion.div
                className="absolute top-2 right-2 text-yellow-400 opacity-0 group-hover:opacity-100"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-3 h-3" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gameplay Preview with 3D-like card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
          whileHover={{ scale: 1.02, rotateX: -2 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{ 
              background: 'linear-gradient(90deg, transparent, rgba(255,200,100,0.3), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.h3 
            className="text-2xl font-bold text-white text-center mb-6 relative z-10"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            How It Works
          </motion.h3>
          
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {[
              { emoji: '🥚', title: '1. Adopt', desc: 'Choose from 4 mythical creatures and give them a name', color: 'from-amber-400 to-orange-500' },
              { emoji: '❤️', title: '2. Care', desc: 'Feed, play, clean, and keep your pet healthy', color: 'from-pink-400 to-purple-500' },
              { emoji: '⭐', title: '3. Grow', desc: 'Watch your pet evolve and unlock achievements', color: 'from-emerald-400 to-green-500' },
            ].map((step, i) => (
              <motion.div 
                key={step.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.2 }}
              >
                <motion.div 
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center relative`}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  animate={{ 
                    y: [0, -5, 0],
                    boxShadow: [
                      '0 5px 20px rgba(0,0,0,0.3)',
                      '0 15px 40px rgba(0,0,0,0.4)',
                      '0 5px 20px rgba(0,0,0,0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <motion.span 
                    className="text-3xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {step.emoji}
                  </motion.span>
                </motion.div>
                <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                <p className="text-white/60 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mini-games Preview with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <motion.h3 
            className="text-xl font-bold text-white mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Earn Coins with Mini-Games
          </motion.h3>
          <div className="flex justify-center gap-6">
            {[
              { emoji: '🗑️', label: 'Trash Task', delay: 0 },
              { emoji: '🪟', label: 'Window Clean', delay: 0.1 },
              { emoji: '⚡', label: 'Wire Fix', delay: 0.2 },
            ].map((game) => (
              <motion.div 
                key={game.label}
                whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }} 
                whileTap={{ scale: 0.9 }}
                className="text-center cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + game.delay }}
              >
                <motion.span 
                  className="text-4xl block mb-2"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: game.delay * 5,
                    ease: "easeInOut"
                  }}
                >
                  {game.emoji}
                </motion.span>
                <span className="text-white/60 text-xs group-hover:text-amber-400 transition-colors">
                  {game.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer with sparkle animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-white/40 text-sm mt-12 relative"
        >
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Care for your pet daily to unlock their full potential! ✨
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
}
