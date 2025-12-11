/**
 * PetAdopt.jsx - Pet Adoption Page
 * 
 * This page handles the complete pet adoption flow:
 * Step 1: Select a mythical creature (Dragon, Cerberus, Kitsune, Phoenix)
 * Step 2: Name your pet and choose a color variant
 * Step 3: Confirm and create your new companion
 * 
 * Features:
 * - 4 unique mythical pets with distinct traits
 * - 4 color variants (Classic, Golden, Cosmic, Frost)
 * - Input validation for pet names
 * - Animated UI with smooth transitions
 * 
 * @component
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

/**
 * Available mythical pets configuration
 * Each pet has unique visual properties and traits
 */
const pets = [
  { 
    id: 'dragon', 
    name: 'Dragon', 
    emoji: '🐲', 
    color: 'from-red-500 to-orange-600',
    glowColor: 'rgba(255, 100, 50, 0.5)',
    description: 'A fierce and loyal companion with fiery breath',
    trait: 'Fire Element'
  },
  { 
    id: 'cerberus', 
    name: 'Cerberus', 
    emoji: '🐺', 
    color: 'from-purple-600 to-indigo-700',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    description: 'A three-headed guardian of immense power',
    trait: 'Shadow Element'
  },
  { 
    id: 'kitsune', 
    name: 'Kitsune', 
    emoji: '🦊', 
    color: 'from-amber-400 to-orange-500',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    description: 'A mystical fox spirit with magical abilities',
    trait: 'Spirit Element'
  },
  { 
    id: 'phoenix', 
    name: 'Phoenix', 
    emoji: '🔥', 
    color: 'from-yellow-400 to-red-500',
    glowColor: 'rgba(250, 204, 21, 0.5)',
    description: 'An immortal bird that rises from the ashes',
    trait: 'Light Element'
  },
];

/**
 * Color variant options for pet customization
 */
const colorVariants = [
  { id: 'default', name: 'Classic', color: 'bg-slate-500' },
  { id: 'golden', name: 'Golden', color: 'bg-amber-500' },
  { id: 'cosmic', name: 'Cosmic', color: 'bg-purple-500' },
  { id: 'frost', name: 'Frost', color: 'bg-cyan-500' },
];

/**
 * Animation variants for card elements
 */
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }),
  hover: {
    scale: 1.05,
    y: -10,
    transition: { type: "spring", stiffness: 300 }
  },
  tap: { scale: 0.98 }
};

export default function PetAdopt() {
  const navigate = useNavigate();
  
  // Step tracker: 1=select pet, 2=name pet, 3=confirm
  const [step, setStep] = useState(1);
  
  // Selected pet species ID
  const [selectedPet, setSelectedPet] = useState(null);
  
  // Pet name with validation
  const [petName, setPetName] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Color variant selection
  const [selectedColor, setSelectedColor] = useState('default');
  
  // Loading state during pet creation
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Validates the pet name input
   * @param {string} name - The name to validate
   * @returns {string} Error message or empty string if valid
   */
  const validatePetName = (name) => {
    const trimmedName = name.trim();
    
    // Check if name is empty
    if (!trimmedName) {
      return 'Please enter a name for your pet';
    }
    
    // Check minimum length (2 characters)
    if (trimmedName.length < 2) {
      return 'Name must be at least 2 characters';
    }
    
    // Check maximum length (20 characters)
    if (trimmedName.length > 20) {
      return 'Name must be 20 characters or less';
    }
    
    // Check for valid characters (letters, numbers, spaces, basic punctuation)
    const validNamePattern = /^[a-zA-Z0-9\s'-]+$/;
    if (!validNamePattern.test(trimmedName)) {
      return 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes';
    }
    
    // Check for inappropriate content (basic filter)
    const inappropriateWords = ['test123', 'admin', 'null', 'undefined'];
    if (inappropriateWords.some(word => trimmedName.toLowerCase().includes(word))) {
      return 'Please choose a different name';
    }
    
    return ''; // No error
  };

  /**
   * Handles pet name input change with real-time validation
   * @param {Event} e - Input change event
   */
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setPetName(newName);
    
    // Clear error when user starts typing
    if (nameError) {
      const error = validatePetName(newName);
      setNameError(error);
    }
  };

  /**
   * Validates name when user leaves the input field
   */
  const handleNameBlur = () => {
    const error = validatePetName(petName);
    setNameError(error);
  };

  /**
   * Creates a new pet in the database
   * Handles cleanup of existing pets and navigation
   */
  const handleAdopt = async () => {
    // Final validation before submission
    const error = validatePetName(petName);
    if (error) {
      setNameError(error);
      return;
    }
    
    if (!selectedPet) {
      return;
    }
    
    setIsCreating(true);
    try {
      // Check if user already has a pet - only one pet allowed at a time
      const existingPets = await base44.entities.Pet.list();
      
      // Delete existing pet and its expenses (cleanup)
      if (existingPets && existingPets.length > 0) {
        for (const pet of existingPets) {
          // Delete all expenses for this pet first (foreign key constraint)
          const expenses = await base44.entities.Expense.filter({ pet_id: pet.id });
          for (const expense of expenses) {
            await base44.entities.Expense.delete(expense.id);
          }
          // Then delete the pet
          await base44.entities.Pet.delete(pet.id);
        }
      }
      
      // Create new pet with default starting stats
      await base44.entities.Pet.create({
        name: petName.trim(),        // Sanitized name
        species: selectedPet,        // Pet type (dragon, cerberus, etc.)
        stage: 'egg',               // Always starts as egg
        hunger: 50,                 // Starting at 50% - needs care!
        happiness: 50,
        energy: 50,
        hygiene: 50,
        health: 100,                // Full health to start
        experience: 0,              // No XP yet
        coins: 50,                  // Starting coins for basics
        has_insurance: false,       // No insurance initially
        color_variant: selectedColor,
        achievements: [],           // Empty achievements array
        days_alive: 0,              // Just born
        tricks: [],                 // No tricks learned yet
        toys: [],                   // No toys owned
      });
      
      // Navigate to pet care page after successful creation
      navigate(createPageUrl('PetCare'));
    } catch (error) {
      console.error('Failed to create pet:', error);
      setNameError('Failed to create pet. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 pb-24 overflow-hidden">
      {/* Simplified magical background - reduced particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Fewer floating orbs - reduced from 30 to 8 */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'bg-amber-400/15' : 
              i % 4 === 1 ? 'bg-purple-500/15' : 
              i % 4 === 2 ? 'bg-pink-400/15' : 'bg-cyan-400/15'
            }`}
            style={{
              left: `${10 + i * 12}%`,
              top: `${10 + (i % 3) * 30}%`,
              width: `${20 + (i % 3) * 15}px`,
              height: `${20 + (i % 3) * 15}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header - simplified animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 mb-2">
            ✨ Mythical Pet Sanctuary ✨
          </h1>
          <p className="text-white/60">
            Adopt your magical companion
          </p>
        </motion.div>

        {/* Simple Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-16 h-1.5 rounded-full transition-all duration-300 ${
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
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Choose Your Companion
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {pets.map((pet, index) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPet(pet.id)}
                    className={`p-6 rounded-3xl bg-gradient-to-br ${pet.color} 
                      ${selectedPet === pet.id ? 'ring-4 ring-white shadow-2xl' : 'opacity-80'}
                      transition-all duration-200 cursor-pointer relative overflow-hidden`}
                    style={{
                      boxShadow: selectedPet === pet.id ? `0 15px 40px ${pet.glowColor}` : 'none'
                    }}
                  >
                    <span className="text-6xl block mb-3">{pet.emoji}</span>
                    <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{pet.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                      {pet.trait}
                    </span>
                    
                    {/* Show "Choose" button when selected */}
                    {selectedPet === pet.id && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStep(2);
                        }}
                        className="mt-4 w-full py-2 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Choose {pet.name} →
                      </motion.button>
                    )}
                  </motion.div>
                ))}
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
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Name Your {pets.find(p => p.id === selectedPet)?.name}
              </h2>

              <div className="text-center mb-6">
                <span className="text-8xl inline-block">
                  {pets.find(p => p.id === selectedPet)?.emoji}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Pet Name</label>
                  <Input
                    value={petName}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    placeholder="Enter a magical name..."
                    className={`bg-white/10 border-white/20 text-white text-lg py-6 text-center rounded-2xl ${
                      nameError ? 'border-red-500 ring-2 ring-red-500/30' : ''
                    }`}
                    maxLength={20}
                  />
                  {/* Validation error message */}
                  <AnimatePresence>
                    {nameError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm mt-2 text-center"
                      >
                        ⚠️ {nameError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  {/* Character counter */}
                  <p className="text-white/40 text-xs text-right mt-1">
                    {petName.length}/20 characters
                  </p>
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
                          transition-all duration-200`}
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
              transition={{ duration: 0.3 }}
              className="max-w-md mx-auto text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Welcome {petName}!
              </h2>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative inline-block mb-6"
              >
                <div className="text-9xl">
                  {pets.find(p => p.id === selectedPet)?.emoji}
                </div>
                <div className="absolute -inset-8 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full blur-2xl -z-10" />
              </motion.div>

              <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                <h3 className="text-amber-300 font-semibold mb-4">
                  🎊 Your Journey Begins! 🎊
                </h3>
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
