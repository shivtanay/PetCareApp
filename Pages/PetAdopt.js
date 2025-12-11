import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const pets = [
  { 
    id: 'dragon', 
    name: 'Dragon', 
    emoji: '🐲', 
    color: 'from-red-500 to-orange-600',
    description: 'A fierce and loyal companion with fiery breath',
    trait: 'Fire Element'
  },
  { 
    id: 'cerberus', 
    name: 'Cerberus', 
    emoji: '🐺', 
    color: 'from-purple-600 to-indigo-700',
    description: 'A three-headed guardian of immense power',
    trait: 'Shadow Element'
  },
  { 
    id: 'kitsune', 
    name: 'Kitsune', 
    emoji: '🦊', 
    color: 'from-amber-400 to-orange-500',
    description: 'A mystical fox spirit with magical abilities',
    trait: 'Spirit Element'
  },
  { 
    id: 'phoenix', 
    name: 'Phoenix', 
    emoji: '🔥', 
    color: 'from-yellow-400 to-red-500',
    description: 'An immortal bird that rises from the ashes',
    trait: 'Light Element'
  },
];

const colorVariants = [
  { id: 'default', name: 'Classic', color: 'bg-slate-500' },
  { id: 'golden', name: 'Golden', color: 'bg-amber-500' },
  { id: 'cosmic', name: 'Cosmic', color: 'bg-purple-500' },
  { id: 'frost', name: 'Frost', color: 'bg-cyan-500' },
];

export default function PetAdopt() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petName, setPetName] = useState('');
  const [selectedColor, setSelectedColor] = useState('default');
  const [isCreating, setIsCreating] = useState(false);

  const handleAdopt = async () => {
    if (!selectedPet || !petName.trim()) return;
    
    setIsCreating(true);
    try {
      // Check if user already has a pet
      const existingPets = await base44.entities.Pet.list();
      
      // Delete existing pet and its expenses
      if (existingPets && existingPets.length > 0) {
        for (const pet of existingPets) {
          // Delete all expenses for this pet
          const expenses = await base44.entities.Expense.filter({ pet_id: pet.id });
          for (const expense of expenses) {
            await base44.entities.Expense.delete(expense.id);
          }
          // Delete the pet
          await base44.entities.Pet.delete(pet.id);
        }
      }
      
      // Create new pet
      await base44.entities.Pet.create({
        name: petName.trim(),
        species: selectedPet,
        stage: 'egg',
        hunger: 50,
        happiness: 50,
        energy: 50,
        hygiene: 50,
        health: 100,
        experience: 0,
        coins: 50,
        has_insurance: false,
        color_variant: selectedColor,
        achievements: [],
        days_alive: 0,
      });
      
      navigate(createPageUrl('PetCare'));
    } catch (error) {
      console.error('Failed to create pet:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 mb-2">
            ✨ Mythical Pet Sanctuary ✨
          </h1>
          <p className="text-white/60">Adopt your magical companion</p>
        </motion.div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-16 h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Pet */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Choose Your Companion
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <motion.button
                    key={pet.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPet(pet.id)}
                    className={`p-6 rounded-3xl bg-gradient-to-br ${pet.color} 
                      ${selectedPet === pet.id ? 'ring-4 ring-white shadow-2xl' : 'opacity-80'}
                      transition-all`}
                  >
                    <span className="text-6xl block mb-3">{pet.emoji}</span>
                    <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{pet.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                      {pet.trait}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedPet}
                  className="px-8 py-6 text-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 font-bold rounded-2xl disabled:opacity-50"
                >
                  Continue →
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Name & Customize */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-md mx-auto"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Name Your {pets.find(p => p.id === selectedPet)?.name}
              </h2>

              <div className="text-center mb-6">
                <span className="text-8xl">{pets.find(p => p.id === selectedPet)?.emoji}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Pet Name</label>
                  <Input
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Enter a magical name..."
                    className="bg-white/10 border-white/20 text-white text-lg py-6 text-center rounded-2xl"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-3 block">Color Variant</label>
                  <div className="flex justify-center gap-3">
                    {colorVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedColor(variant.id)}
                        className={`w-12 h-12 rounded-full ${variant.color} 
                          ${selectedColor === variant.id ? 'ring-4 ring-white scale-110' : 'opacity-60'}
                          transition-all`}
                        title={variant.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="px-6 py-5 border-white/30 text-white hover:bg-white/10"
                >
                  ← Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!petName.trim()}
                  className="px-8 py-5 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 font-bold rounded-xl disabled:opacity-50"
                >
                  Continue →
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-md mx-auto text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Welcome {petName}!
              </h2>

              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="relative inline-block mb-6"
              >
                <div className="text-9xl">{pets.find(p => p.id === selectedPet)?.emoji}</div>
                <motion.div
                  className="absolute -inset-8 bg-gradient-to-r from-amber-400/30 to-yellow-500/30 rounded-full blur-2xl -z-10"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                <h3 className="text-amber-300 font-semibold mb-4">Your Journey Begins!</h3>
                <ul className="text-white/70 text-sm space-y-2 text-left">
                  <li>🥚 Your pet starts as an egg - keep it warm!</li>
                  <li>💰 You start with 50 coins</li>
                  <li>🍖 Feed, play, and care for your pet daily</li>
                  <li>⭐ Watch your pet grow through 3 stages</li>
                  <li>🧹 Complete chores to earn more coins</li>
                </ul>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="px-6 py-5 border-white/30 text-white hover:bg-white/10"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleAdopt}
                  disabled={isCreating}
                  className="px-8 py-5 bg-gradient-to-r from-emerald-400 to-green-500 text-emerald-900 font-bold rounded-xl"
                >
                  {isCreating ? 'Creating...' : '🎉 Adopt Now!'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}