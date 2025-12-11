import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, Heart, Coins, Trophy, ArrowLeft } from 'lucide-react';

const features = [
  { icon: '🐲', title: '4 Mythical Pets', desc: 'Dragon, Cerberus, Kitsune, Phoenix' },
  { icon: '🥚', title: '3 Life Stages', desc: 'Egg → Hatchling → Fully Grown' },
  { icon: '💰', title: 'Economy System', desc: 'Earn coins through mini-games' },
  { icon: '🏆', title: 'Achievements', desc: 'Unlock badges as you progress' },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: pets, isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: () => base44.entities.Pet.list(),
  });

  const hasPet = pets && pets.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
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
          {/* Floating pets */}
          <div className="flex justify-center gap-4 mb-8">
            {['🐲', '🐺', '🦊', '🔥'].map((emoji, i) => (
              <motion.span
                key={emoji}
                className="text-5xl md:text-6xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
              Mythical Pet Care
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-purple-300 mb-4">
            Adventure
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Adopt, nurture, and watch your magical companion grow through three amazing life stages.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
        >
          {hasPet ? (
            <Link to={createPageUrl('PetCare')}>
              <Button className="w-full sm:w-auto px-8 py-7 text-lg bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-emerald-900 font-bold rounded-2xl shadow-xl shadow-emerald-500/30">
                <Heart className="w-5 h-5 mr-2" />
                Visit Your Pet
              </Button>
            </Link>
          ) : (
            <Link to={createPageUrl('PetAdopt')}>
              <Button className="w-full sm:w-auto px-8 py-7 text-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-900 font-bold rounded-2xl shadow-xl shadow-amber-500/30">
                <Sparkles className="w-5 h-5 mr-2" />
                Adopt Your Pet
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center"
            >
              <span className="text-4xl block mb-3">{feature.icon}</span>
              <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-white/50 text-xs">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Gameplay Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-6">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🥚</span>
              </div>
              <h4 className="text-white font-semibold mb-2">1. Adopt</h4>
              <p className="text-white/60 text-sm">Choose from 4 mythical creatures and give them a name</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">❤️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">2. Care</h4>
              <p className="text-white/60 text-sm">Feed, play, clean, and keep your pet healthy</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">⭐</span>
              </div>
              <h4 className="text-white font-semibold mb-2">3. Grow</h4>
              <p className="text-white/60 text-sm">Watch your pet evolve and unlock achievements</p>
            </div>
          </div>
        </motion.div>

        {/* Mini-games Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-4">Earn Coins with Mini-Games</h3>
          <div className="flex justify-center gap-6">
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <span className="text-4xl block mb-2">🗑️</span>
              <span className="text-white/60 text-xs">Trash Task</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <span className="text-4xl block mb-2">🪟</span>
              <span className="text-white/60 text-xs">Window Clean</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="text-center">
              <span className="text-4xl block mb-2">⚡</span>
              <span className="text-white/60 text-xs">Wire Fix</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-white/40 text-sm mt-12"
        >
          ✨ Care for your pet daily to unlock their full potential! ✨
        </motion.p>
      </div>
    </div>
  );
}