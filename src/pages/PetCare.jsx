/**
 * PetCare.jsx - Main Pet Care Page
 * 
 * This is the core gameplay page where users interact with their pet.
 * 
 * FEATURES:
 * - Real-time stat management (Hunger, Happiness, Energy, Hygiene, Health)
 * - Day/Night cycle with stat decay
 * - Care actions (Feed, Play, Rest, Clean)
 * - Mini-games for earning coins (Chores)
 * - Tricks system with purchasable abilities
 * - Pet evolution based on experience
 * - Insurance system to prevent death
 * - Expense tracking and reporting
 * - Achievement system
 * - Memorial creation for deceased pets
 * 
 * DATA FLOW:
 * - Pet data is fetched from Base44 API
 * - Stats decay over time based on day duration
 * - User actions update stats and deduct coins
 * - Expenses are tracked for reporting
 * 
 * @component
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Coins, Trophy, Shield, AlertTriangle, Sparkles, RotateCcw, HelpCircle, Receipt, Clock, Wand2, ShoppingBag } from 'lucide-react';

// Component imports for modular structure
import PetDisplay from '@/components/pet/PetDisplay';
import StatBar from '@/components/pet/StatBar';
import CareActions from '@/components/pet/CareActions';
import ChoresMenu from '@/components/pet/ChoresMenu';
import Achievements from '@/components/pet/Achievements';
import TrashGame from '@/components/games/TrashGame';
import WindowGame from '@/components/games/WindowGame';
import WireGame from '@/components/games/WireGame';
import ExpenseChart from '@/components/pet/ExpenseChart';

/**
 * Background gradient themes based on pet color variant
 * Changes the entire page atmosphere
 */
const variantBackgrounds = {
  default: 'from-slate-900 via-purple-900 to-slate-900',
  golden: 'from-slate-900 via-amber-900 to-slate-900',
  cosmic: 'from-slate-900 via-violet-900 to-slate-900',
  frost: 'from-slate-900 via-cyan-900 to-slate-900',
};

/**
 * Particle colors that match the pet's color variant
 * Creates cohesive visual atmosphere
 */
const variantParticleClasses = {
  default: ['bg-amber-400/10', 'bg-purple-400/10', 'bg-pink-400/10'],
  golden: ['bg-amber-400/15', 'bg-yellow-400/15', 'bg-orange-400/10'],
  cosmic: ['bg-purple-400/15', 'bg-violet-400/15', 'bg-pink-400/15'],
  frost: ['bg-cyan-400/15', 'bg-blue-400/15', 'bg-teal-400/10'],
};

export default function PetCare() {
  // React Query client for cache invalidation
  const queryClient = useQueryClient();
  // Navigation for redirects
  const navigate = useNavigate();
  
  // ============================================
  // UI STATE MANAGEMENT
  // ============================================
  const [showChores, setShowChores] = useState(false);       // Chores menu visibility
  const [showAchievements, setShowAchievements] = useState(false); // Achievements modal
  const [showExpenses, setShowExpenses] = useState(false);   // Expense report modal
  const [activeGame, setActiveGame] = useState(null);        // Currently active mini-game
  const [isAnimating, setIsAnimating] = useState(false);     // Prevents actions during animations
  const [notification, setNotification] = useState(null);    // Toast notification message
  const [showInsurancePrompt, setShowInsurancePrompt] = useState(false);  // Insurance modal
  const [showTricks, setShowTricks] = useState(false);       // Tricks menu visibility
  const [showToyShop, setShowToyShop] = useState(false);     // Toy shop modal
  const [dayTimeLeft, setDayTimeLeft] = useState(0);         // Time remaining in current day
  const [petDied, setPetDied] = useState(false);             // Death state flag
  const [performingTrick, setPerformingTrick] = useState(null);  // Currently performing trick
  const [deathStats, setDeathStats] = useState(null);        // Stats captured at death
  const [showMemorialModal, setShowMemorialModal] = useState(false);  // Memorial creation modal
  const [memorialEpitaph, setMemorialEpitaph] = useState('Forever in our hearts');  // Memorial text
  const [memorialType, setMemorialType] = useState('basic'); // Memorial style (basic/golden/legendary)
  const [isCreatingMemorial, setIsCreatingMemorial] = useState(false);  // Loading state
  const [isEvolving, setIsEvolving] = useState(false);  // Prevents duplicate evolution triggers

  const { data: pets, isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: () => base44.entities.Pet.list(),
  });

  const { data: expenses } = useQuery({
    queryKey: ['expenses', pets?.[0]?.id],
    queryFn: () => base44.entities.Expense.filter({ pet_id: pets[0].id }),
    enabled: !!pets?.[0]?.id,
    initialData: [],
  });

  const pet = pets?.[0];

  // Calculate dynamic costs based on pet age
  const getCostMultiplier = () => {
    if (!pet) return 1;
    const ageGroup = Math.floor(pet.days_alive / 5);
    return 1 + (ageGroup * 0.2); // 20% increase every 5 days
  };

  const getInsuranceCost = () => {
    if (!pet) return 0.5;
    const ageGroup = Math.floor(pet.days_alive / 5);
    return 0.5 + (ageGroup * 0.5); // +0.5 coins every 5 days
  };

  const getDayDuration = () => {
    if (!pet) return 120000; // 2 minutes default
    const ageGroup = Math.floor(pet.days_alive / 10);
    // Day duration: starts at 2 minutes, minimum 1 minute
    // Decreases by 10 seconds every 10 days
    const duration = Math.max(60, 120 - (ageGroup * 10)); // Min 60 seconds (1 minute)
    return duration * 1000; // Convert to milliseconds
  };

  const updatePetMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Pet.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['pets']),
  });

  // Calculate mood based on stats
  const getMood = useCallback(() => {
    if (!pet) return 'content';
    const avgStats = (pet.hunger + pet.happiness + pet.energy + pet.hygiene + pet.health) / 5;
    
    if (pet.health < 30) return 'sick';
    if (pet.energy < 20) return 'tired';
    if (pet.hunger < 20) return 'hungry';
    if (pet.happiness < 30) return 'sad';
    if (avgStats > 80) return 'happy';
    if (avgStats > 60) return 'content';
    return 'sad';
  }, [pet]);

  // Daily stat decay and day progression with dynamic timer
  useEffect(() => {
    if (!pet) return;
    
    const dayDuration = getDayDuration();
    const now = Date.now();
    const lastUpdate = pet.last_fed ? new Date(pet.last_fed).getTime() : new Date(pet.created_date).getTime();
    const timeSinceLastUpdate = now - lastUpdate;
    const timeUntilNextDay = dayDuration - (timeSinceLastUpdate % dayDuration);
    
    setDayTimeLeft(Math.floor(timeUntilNextDay / 1000));
    
    const progressDay = () => {
      const updates = {
        days_alive: pet.days_alive + 1,
        last_fed: new Date().toISOString(),
        experience: pet.experience + 1, // Gain 1 experience per day
      };
      
      // ===== BALANCED DECAY SYSTEM =====
      // Base decay is gentler, increases slightly with pet age
      const ageMultiplier = 1 + Math.floor(pet.days_alive / 15) * 0.1; // +10% decay every 15 days (slower progression)
      
      // Base decay rates (gentle for all stages)
      const hungerDecay = (5 + Math.random() * 8) * ageMultiplier; // 5-13%
      const hygieneDecay = (4 + Math.random() * 6) * ageMultiplier; // 4-10%
      const energyDecay = (3 + Math.random() * 4) * ageMultiplier; // 3-7%
      const happinessDecay = 3; // 3% flat
      
      updates.hunger = Math.max(0, pet.hunger - hungerDecay);
      updates.hygiene = Math.max(0, pet.hygiene - hygieneDecay);
      updates.energy = Math.max(0, pet.energy - energyDecay);
      updates.happiness = Math.max(0, pet.happiness - happinessDecay);
      
      // ===== SMART HEALTH SYSTEM =====
      // Health only decays when multiple stats are critically low
      const criticalStats = [pet.hunger, pet.happiness, pet.hygiene, pet.energy].filter(s => s < 25).length;
      const lowStats = [pet.hunger, pet.happiness, pet.hygiene, pet.energy].filter(s => s < 50).length;
      
      if (criticalStats >= 2) {
        // Critical: 2+ stats below 25% - serious health decline
        const healthDecay = 8 + Math.random() * 7; // 8-15%
        updates.health = Math.max(0, pet.health - healthDecay);
      } else if (lowStats >= 3) {
        // Warning: 3+ stats below 50% - slow health decline
        const healthDecay = 3 + Math.random() * 4; // 3-7%
        updates.health = Math.max(0, pet.health - healthDecay);
      } else if (lowStats === 0 && pet.health < 100) {
        // All stats healthy - slow health REGENERATION!
        updates.health = Math.min(100, pet.health + 5);
      }
      
      // ===== INSURANCE PROTECTION =====
      // Insurance prevents health from dropping below 20%
      if (pet.has_insurance && updates.health < 20) {
        updates.health = 20;
        showNotification('🛡️ Insurance saved your pet from critical health!');
      }
      
      // Daily insurance cost
      if (pet.has_insurance) {
        const insuranceCost = getInsuranceCost();
        updates.coins = Math.max(0, pet.coins - insuranceCost);
        
        // Track insurance expense
        base44.entities.Expense.create({
          pet_id: pet.id,
          type: 'insurance',
          amount: insuranceCost,
          description: 'Daily insurance payment'
        });
      }
      
      updatePetMutation.mutate({ id: pet.id, data: updates });
    };
    
    const dayTimeout = setTimeout(progressDay, timeUntilNextDay);
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
      setDayTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => {
      clearTimeout(dayTimeout);
      clearInterval(countdownInterval);
    };
  }, [pet?.id, pet?.days_alive, pet?.last_fed]);

  // Check for pet death
  useEffect(() => {
    if (!pet) return;
    
    if (pet.health <= 0 && !petDied) {
      // Calculate total expenses
      const totalSpent = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
      
      setDeathStats({
        name: pet.name,
        daysLived: pet.days_alive || 1,
        happiness: pet.happiness || 0,
        totalSpent: Math.round(totalSpent),
        achievements: pet.achievements?.length || 0,
        coins: pet.coins || 0
      });
      setPetDied(true);
    }
  }, [pet?.health, petDied, expenses]);

  // Check for evolution based on experience
  // Evolution thresholds: Egg (3 XP) → Hatchling (5 XP) → Grown
  useEffect(() => {
    if (!pet || isEvolving) return;
    
    console.log(`[Evolution Check] Stage: ${pet.stage}, Experience: ${pet.experience}, isEvolving: ${isEvolving}`);
    
    // Egg → Hatchling at 3 experience
    if (pet.stage === 'egg' && pet.experience >= 3) {
      console.log('[Evolution] Evolving from egg to hatchling!');
      setIsEvolving(true);
      updatePetMutation.mutate({
        id: pet.id,
        data: { 
          stage: 'hatchling',
          experience: 0,
          achievements: [...(pet.achievements || []), 'hatchling']
        }
      }, {
        onSuccess: () => {
          showNotification('🐣 Your pet hatched into a hatchling!');
          setTimeout(() => setIsEvolving(false), 1000); // Debounce
        },
        onError: () => setIsEvolving(false)
      });
    } 
    // Hatchling → Grown at 5 experience
    else if (pet.stage === 'hatchling' && pet.experience >= 5) {
      console.log('[Evolution] Evolving from hatchling to fully grown!');
      setIsEvolving(true);
      updatePetMutation.mutate({
        id: pet.id,
        data: { 
          stage: 'grown',
          experience: pet.experience, // Keep experience for grown pets
          achievements: [...(pet.achievements || []), 'fully_grown']
        }
      }, {
        onSuccess: () => {
          showNotification('⭐ Your pet is now fully grown!');
          setTimeout(() => setIsEvolving(false), 1000); // Debounce
        },
        onError: () => setIsEvolving(false)
      });
    }
  }, [pet?.experience, pet?.stage, isEvolving]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCareAction = (action, baseCost) => {
    const cost = baseCost * getCostMultiplier();
    if (!pet || pet.coins < cost) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    let updates = { coins: pet.coins - cost };
    let newAchievements = [...(pet.achievements || [])];
    let expenseDescription = '';

    switch (action) {
      case 'feed':
        updates.hunger = Math.min(100, pet.hunger + 30);
        updates.energy = Math.min(100, pet.energy + 10);
        expenseDescription = 'Fed pet';
        if (!newAchievements.includes('first_feed')) {
          newAchievements.push('first_feed');
          showNotification('🏆 Achievement: First Meal!');
        }
        showNotification('🍖 Yummy! Your pet is satisfied!');
        break;
      case 'play':
        updates.happiness = Math.min(100, pet.happiness + 25);
        updates.energy = Math.max(0, pet.energy - 10);
        expenseDescription = 'Played with pet';
        showNotification('🎮 Your pet had fun playing!');
        break;
      case 'rest':
        updates.energy = Math.min(100, pet.energy + 40);
        updates.happiness = Math.min(100, pet.happiness + 5);
        expenseDescription = 'Pet rest time';
        showNotification('💤 Your pet feels refreshed!');
        break;
      case 'clean':
        updates.hygiene = Math.min(100, pet.hygiene + 35);
        updates.happiness = Math.min(100, pet.happiness + 5);
        expenseDescription = 'Cleaned pet';
        showNotification('✨ Sparkly clean!');
        break;
      case 'health':
        updates.health = Math.min(100, pet.health + 30);
        expenseDescription = 'Health checkup';
        showNotification('💊 Health check complete!');
        break;
    }

    updates.achievements = newAchievements;
    
    // Track expense (non-blocking)
    if (cost > 0) {
      base44.entities.Expense.create({
        pet_id: pet.id,
        type: action,
        amount: cost,
        description: expenseDescription
      });
    }
    
    updatePetMutation.mutate({ id: pet.id, data: updates });
  };

  const handleGameComplete = (reward) => {
    if (!pet) return;
    
    const newCoins = pet.coins + reward;
    let newAchievements = [...(pet.achievements || [])];
    
    if (newCoins >= 200 && !newAchievements.includes('wealthy')) {
      newAchievements.push('wealthy');
      showNotification('🏆 Achievement: Financial Genius!');
    }

    updatePetMutation.mutate({
      id: pet.id,
      data: { 
        coins: newCoins,
        achievements: newAchievements
      }
    });
    
    setActiveGame(null);
    showNotification(`💰 You earned ${reward} coins!`);
  };

  const handleBuyInsurance = async () => {
    if (!pet || pet.coins < 15) return;
    
    await base44.entities.Expense.create({
      pet_id: pet.id,
      type: 'insurance',
      amount: 15,
      description: 'Insurance activation fee'
    });
    
    updatePetMutation.mutate({
      id: pet.id,
      data: { 
        has_insurance: true, 
        coins: pet.coins - 15,
        achievements: [...(pet.achievements || []), 'insured']
      }
    });
    setShowInsurancePrompt(false);
    showNotification('🛡️ Pet insurance activated!');
  };

  const handleResetPet = async () => {
    if (!pet) return;
    if (window.confirm('Are you sure you want to reset your pet? This cannot be undone.')) {
      await base44.entities.Pet.delete(pet.id);
      navigate(createPageUrl('PetAdopt'));
    }
  };

  const handleBuyMemorial = async () => {
    if (!deathStats || deathStats.coins < 50) return;
    setShowMemorialModal(true);
  };

  const handleCreateMemorial = async () => {
    if (!pet || !deathStats) return;
    setIsCreatingMemorial(true);
    
    // Calculate memorial cost based on type
    const costs = { basic: 50, golden: 75, legendary: 100 };
    const cost = costs[memorialType] || 50;
    
    if (deathStats.coins < cost) {
      showNotification('❌ Not enough coins for this memorial type');
      setIsCreatingMemorial(false);
      return;
    }
    
    try {
      // Create memorial record
      const memorialData = {
        pet_name: pet.name,
        species: pet.species,
        color_variant: pet.color_variant || 'default',
        days_lived: deathStats.daysLived,
        stage_reached: pet.stage,
        achievements: pet.achievements || [],
        tricks_learned: pet.tricks || [],
        date_adopted: pet.created_date || new Date().toISOString(),
        date_passed: new Date().toISOString(),
        epitaph: memorialEpitaph,
        memorial_type: memorialType,
        total_coins_earned: deathStats.totalSpent || 0
      };
      
      console.log('Creating memorial with data:', memorialData);
      const result = await base44.entities.Memorial.create(memorialData);
      console.log('Memorial created:', result);
      
      showNotification('🪦 Memorial created. Your pet will be remembered forever.');
      
      // Delete pet and redirect to graveyard
      await base44.entities.Pet.delete(pet.id);
      navigate(createPageUrl('Graveyard'));
    } catch (error) {
      console.error('Failed to create memorial:', error);
      console.error('Error details:', error.message);
      showNotification('❌ Failed to create memorial: ' + error.message);
    }
    setIsCreatingMemorial(false);
  };

  const handleAdoptNewPet = async () => {
    if (!pet) return;
    await base44.entities.Pet.delete(pet.id);
    navigate(createPageUrl('PetAdopt'));
  };

  // Get life quality message
  const getLifeMessage = (stats) => {
    if (!stats) return '';
    const avgHappiness = stats.happiness;
    if (avgHappiness >= 70) return `"${stats.name} lived a wonderful life full of joy and love."`;
    if (avgHappiness >= 50) return `"${stats.name} lived a decent life and will be remembered forever."`;
    if (avgHappiness >= 30) return `"${stats.name} had a difficult life but found moments of happiness."`;
    return `"${stats.name} struggled through life. May they find peace now."`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-8xl mb-6 block">🥚</span>
          <h2 className="text-2xl font-bold text-white mb-4">No Pet Yet!</h2>
          <p className="text-white/60 mb-6">Adopt a magical companion to begin your adventure.</p>
          <Link to={createPageUrl('PetAdopt')}>
            <Button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 font-bold px-8 py-6 text-lg rounded-2xl">
              Adopt a Pet ✨
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Pet Death Memorial Screen
  if (petDied && deathStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated falling petals/stars in background */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl pointer-events-none"
            style={{ 
              left: `${Math.random() * 100}%`,
              top: '-10%',
            }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.sin(i) * 50],
              rotate: [0, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear",
            }}
          >
            {['🌸', '⭐', '🌺', '✨', '💫'][i % 5]}
          </motion.div>
        ))}
        
        {/* Soft ambient glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10 text-center relative backdrop-blur-xl"
        >
          {/* Decorative candles */}
          <motion.div
            className="absolute -top-2 left-8 text-2xl"
            animate={{ 
              y: [0, -3, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🕯️
          </motion.div>
          <motion.div
            className="absolute -top-2 right-8 text-2xl"
            animate={{ 
              y: [0, -3, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            🕯️
          </motion.div>
          
          {/* Skull Icon with halo */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ 
                rotate: 360,
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                opacity: { duration: 3, repeat: Infinity }
              }}
            >
              <div className="w-24 h-24 rounded-full border border-amber-400/30" />
            </motion.div>
            <motion.span
              className="text-7xl block mb-4"
              animate={{ 
                scale: [1, 1.05, 1],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              💀
            </motion.span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Rest in Peace
          </motion.h2>
          <motion.p 
            className="text-amber-400 text-xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {deathStats.name}
          </motion.p>
          
          {/* Stats Card */}
          <motion.div 
            className="bg-slate-700/50 rounded-2xl p-4 mb-6 space-y-3 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            
            {[
              { label: 'Days Lived:', value: deathStats.daysLived, icon: '📅' },
              { label: 'Happiness Level:', value: `${Math.round(deathStats.happiness)}%`, icon: '💖' },
              { label: 'Total Spent:', value: deathStats.totalSpent, isCoins: true, icon: '💰' },
              { label: 'Achievements:', value: deathStats.achievements, icon: '🏆' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="flex justify-between items-center relative z-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <span className="text-white/70 flex items-center gap-2">
                  <span>{stat.icon}</span>
                  {stat.label}
                </span>
                <span className={`font-bold ${stat.isCoins ? 'text-amber-400 flex items-center gap-1' : 'text-white'}`}>
                  {stat.isCoins && <Coins className="w-4 h-4" />}
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Life Message */}
          <motion.p 
            className="text-white/50 text-sm italic mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {getLifeMessage(deathStats)}
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{ 
                boxShadow: deathStats.coins >= 50 ? [
                  '0 0 20px rgba(168, 85, 247, 0.2)',
                  '0 0 40px rgba(168, 85, 247, 0.4)',
                  '0 0 20px rgba(168, 85, 247, 0.2)',
                ] : 'none'
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-2xl"
            >
              <Button
                onClick={handleBuyMemorial}
                disabled={deathStats.coins < 50}
                className="w-full py-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-2xl disabled:opacity-50 relative overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🪦
                  </motion.span>
                  Buy Grave Memorial (50 coins)
                </span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleAdoptNewPet}
                variant="outline"
                className="w-full py-5 border-white/30 text-white hover:bg-white/10 rounded-xl"
              >
                Adopt New Pet →
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Memorial Customization Modal */}
        <AnimatePresence>
          {showMemorialModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => !isCreatingMemorial && setShowMemorialModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 rounded-3xl p-6 max-w-md w-full border border-purple-500/30 shadow-2xl"
                style={{ boxShadow: '0 0 60px rgba(168, 85, 247, 0.3)' }}
              >
                {/* Header */}
                <motion.div 
                  className="text-center mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-5xl mb-3"
                  >
                    🪦
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-1">Create Memorial</h2>
                  <p className="text-purple-200/70 text-sm">Honor {deathStats.name}'s memory forever</p>
                </motion.div>

                {/* Memorial Type Selection */}
                <motion.div 
                  className="mb-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="text-purple-200 text-sm font-medium mb-3 block">Memorial Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'basic', emoji: '🪦', name: 'Stone', cost: 50, color: 'from-gray-500 to-gray-600' },
                      { type: 'golden', emoji: '✨', name: 'Golden', cost: 75, color: 'from-yellow-500 to-amber-600' },
                      { type: 'legendary', emoji: '💎', name: 'Crystal', cost: 100, color: 'from-purple-500 to-pink-600' }
                    ].map((option) => (
                      <motion.button
                        key={option.type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMemorialType(option.type)}
                        disabled={deathStats.coins < option.cost}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          memorialType === option.type 
                            ? `border-white bg-gradient-to-br ${option.color}` 
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        } ${deathStats.coins < option.cost ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <motion.div 
                          className="text-2xl mb-1"
                          animate={memorialType === option.type ? { 
                            scale: [1, 1.2, 1],
                            rotate: [0, -10, 10, 0]
                          } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {option.emoji}
                        </motion.div>
                        <div className="text-white text-xs font-medium">{option.name}</div>
                        <div className="text-purple-200/70 text-xs">{option.cost} 🪙</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Epitaph Selection */}
                <motion.div 
                  className="mb-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="text-purple-200 text-sm font-medium mb-3 block">Epitaph</label>
                  <div className="space-y-2 mb-3">
                    {[
                      "Forever in our hearts ❤️",
                      "The best companion ever 🌟",
                      "Rest peacefully, dear friend 🕊️",
                      "Your magic lives on ✨"
                    ].map((epitaph) => (
                      <motion.button
                        key={epitaph}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMemorialEpitaph(epitaph)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          memorialEpitaph === epitaph 
                            ? 'bg-purple-500/40 border-2 border-purple-400' 
                            : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <span className="text-white text-sm">{epitaph}</span>
                      </motion.button>
                    ))}
                  </div>
                  <div className="text-purple-200/50 text-xs text-center">or write your own:</div>
                  <input
                    type="text"
                    value={memorialEpitaph}
                    onChange={(e) => setMemorialEpitaph(e.target.value.slice(0, 50))}
                    placeholder="Custom epitaph..."
                    className="w-full mt-2 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-purple-400"
                    maxLength={50}
                  />
                  <div className="text-right text-purple-200/40 text-xs mt-1">{memorialEpitaph.length}/50</div>
                </motion.div>

                {/* Preview */}
                <motion.div 
                  className="mb-5 p-4 bg-black/30 rounded-xl border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-purple-200/50 text-xs mb-2 text-center">Preview</div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">
                      {memorialType === 'legendary' ? '💎' : memorialType === 'golden' ? '✨' : '🪦'}
                    </div>
                    <div className="text-white font-bold">{deathStats.name}</div>
                    <div className="text-purple-200/70 text-sm italic">"{memorialEpitaph || 'Your epitaph here...'}"</div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => setShowMemorialModal(false)}
                    disabled={isCreatingMemorial}
                    variant="outline"
                    className="flex-1 py-4 border-white/30 text-white hover:bg-white/10 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <motion.div className="flex-1">
                    <Button
                      onClick={handleCreateMemorial}
                      disabled={isCreatingMemorial || !memorialEpitaph}
                      className={`w-full py-4 font-bold rounded-xl relative overflow-hidden ${
                        memorialType === 'legendary' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                          : memorialType === 'golden'
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                          : 'bg-gradient-to-r from-gray-500 to-gray-600'
                      }`}
                    >
                      {isCreatingMemorial ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block"
                        >
                          ⏳
                        </motion.span>
                      ) : (
                        <>
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="relative">
                            Create ({memorialType === 'legendary' ? 100 : memorialType === 'golden' ? 75 : 50} 🪙)
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const mood = getMood();
  const colorVariant = pet?.color_variant || 'default';
  const bgGradient = variantBackgrounds[colorVariant] || variantBackgrounds.default;
  const particleClasses = variantParticleClasses[colorVariant] || variantParticleClasses.default;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-4 pb-24 relative overflow-hidden transition-colors duration-1000`}>
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${particleClasses[i % 3]}`}
            style={{
              width: 4 + Math.random() * 8,
              height: 4 + Math.random() * 8,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%', scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-medium"
            style={{ boxShadow: '0 10px 40px rgba(52, 211, 153, 0.3)' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-2xl"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="relative">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-lg mx-auto relative z-10">
        <motion.div 
          className="flex justify-between items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.h1 
              className="text-2xl font-bold text-white"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(251, 191, 36, 0)',
                  '0 0 20px rgba(251, 191, 36, 0.3)',
                  '0 0 10px rgba(251, 191, 36, 0)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {pet.name}
            </motion.h1>
            <motion.p 
              className="text-white/50 text-sm capitalize"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {pet.species} • Day {pet.days_alive || 1} • {pet.stage} ({pet.experience || 0} XP)
            </motion.p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAchievements(true)}
              className="p-2 bg-white/10 rounded-xl relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-5 h-5 text-yellow-400" />
              </motion.div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowExpenses(true)}
              className="p-2 bg-white/10 rounded-xl"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Receipt className="w-5 h-5 text-amber-400" />
              </motion.div>
            </motion.button>
            <motion.div 
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-4 py-2 rounded-xl border border-amber-500/30"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(251, 191, 36, 0.1)',
                  '0 0 20px rgba(251, 191, 36, 0.2)',
                  '0 0 10px rgba(251, 191, 36, 0.1)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Coins className="w-5 h-5 text-yellow-400" />
              </motion.div>
              <motion.span 
                className="text-yellow-300 font-bold"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {Math.round(pet.coins)}
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* Day Timer */}
        <motion.div 
          className="flex items-center justify-center gap-2 bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-4 h-4 text-purple-300" />
          </motion.div>
          <span className="text-purple-200 text-sm">
            Day {pet.days_alive + 1} ends in {Math.floor(dayTimeLeft / 60)}:{String(dayTimeLeft % 60).padStart(2, '0')}
          </span>
          {dayTimeLeft < 10 && (
            <motion.span
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-red-400 text-xs ml-2"
            >
              ⚠️
            </motion.span>
          )}
        </motion.div>

        {/* Insurance badge */}
        {pet.has_insurance && (
          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-300 text-xs mb-4 w-fit">
            <Shield className="w-4 h-4" />
            <span>Insured ({getInsuranceCost().toFixed(1)} coins/day)</span>
          </div>
        )}

        {/* Low stats warning */}
        {(pet.hunger < 30 || pet.health < 30) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-xl text-red-300 text-sm mb-4 border border-red-500/30"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{pet.hunger < 30 ? 'Your pet is hungry!' : 'Your pet needs medical attention!'}</span>
          </motion.div>
        )}

        {/* Pet Display */}
        <div className="h-72 flex items-center justify-center mb-6">
          <PetDisplay 
            pet={pet} 
            mood={mood} 
            isAnimating={isAnimating} 
            performingTrick={performingTrick}
            onPerformTrick={(trick) => {
              if (pet.energy >= 10 && !performingTrick) {
                setPerformingTrick(trick.id);
                updatePetMutation.mutate({
                  id: pet.id,
                  data: {
                    happiness: Math.min(100, pet.happiness + 15),
                    energy: Math.max(0, pet.energy - 10),
                    experience: (pet.experience || 0) + 1
                  }
                });
                showNotification(`🌟 ${pet.name} performed ${trick.name}! +15 happiness, +1 XP`);
                setTimeout(() => setPerformingTrick(null), 2000);
              }
            }}
          />
        </div>

        {/* Stats */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-5 mb-6 border border-white/10 space-y-3">
          <StatBar label="Hunger" value={pet.hunger} icon="🍖" color="bg-orange-500" />
          <StatBar label="Happiness" value={pet.happiness} icon="😊" color="bg-pink-500" />
          <StatBar label="Energy" value={pet.energy} icon="⚡" color="bg-yellow-500" />
          <StatBar label="Hygiene" value={pet.hygiene} icon="✨" color="bg-cyan-500" />
          <StatBar label="Health" value={pet.health} icon="❤️" color="bg-red-500" />
          
          {/* Experience/Growth bar - syncs to growth phases */}
          <div className="pt-2 border-t border-white/10">
            {/* Calculate progress based on stage thresholds:
                - Egg: 0-3 XP (needs 3 to evolve)
                - Hatchling: 0-5 XP (needs 5 to evolve)
                - Grown: Always 100% (final stage) */}
            {pet.stage === 'grown' ? (
              <StatBar 
                label="Growth (⭐ FULLY GROWN)"
                value={100} 
                icon="👑" 
                color="bg-gradient-to-r from-amber-400 to-yellow-500"
                maxValue={100}
              />
            ) : (
              <StatBar 
                label={`Growth (${pet.stage === 'egg' ? '🥚 Egg' : '🐣 Hatchling'} - ${pet.experience || 0}/${pet.stage === 'egg' ? 3 : 5} XP)`}
                value={pet.experience || 0} 
                icon={pet.stage === 'egg' ? '🥚' : '🐣'} 
                color="bg-purple-500"
                maxValue={pet.stage === 'egg' ? 3 : 5}
              />
            )}
          </div>
        </div>

        {/* Care Actions */}
        <CareActions 
          onAction={handleCareAction} 
          coins={pet.coins}
          costMultiplier={getCostMultiplier()}
          disabled={updatePetMutation.isPending}
        />

        {/* Bottom buttons - Row 1 */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button
            onClick={() => setShowChores(true)}
            className="py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Earn Coins
          </Button>
          
          <Button
            onClick={() => setShowTricks(true)}
            className="py-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Tricks
          </Button>
        </div>

        {/* Bottom buttons - Row 2 */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Button
            onClick={() => setShowToyShop(true)}
            className="py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Toy Shop
          </Button>
          
          <Button
            onClick={() => setShowInsurancePrompt(true)}
            className="py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl"
          >
            <Shield className="w-5 h-5 mr-2" />
            Insurance
          </Button>
        </div>

        {/* Help and Reset buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={() => navigate(createPageUrl('Home'))}
            className="flex-1 py-4 bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
          <Button
            onClick={handleResetPet}
            className="flex-1 py-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/30"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Pet
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showChores && (
          <ChoresMenu 
            onSelectChore={(game) => { setShowChores(false); setActiveGame(game); }}
            onClose={() => setShowChores(false)}
          />
        )}

        {showAchievements && (
          <Achievements 
            unlockedAchievements={pet.achievements || []}
            onClose={() => setShowAchievements(false)}
          />
        )}

        {showExpenses && (
          <ExpenseChart 
            expenses={expenses || []}
            onClose={() => setShowExpenses(false)}
          />
        )}

        {activeGame === 'trash' && (
          <TrashGame 
            onComplete={handleGameComplete}
            onClose={() => setActiveGame(null)}
          />
        )}

        {activeGame === 'window' && (
          <WindowGame 
            onComplete={handleGameComplete}
            onClose={() => setActiveGame(null)}
          />
        )}

        {activeGame === 'wire' && (
          <WireGame 
            onComplete={handleGameComplete}
            onClose={() => setActiveGame(null)}
          />
        )}

        {showInsurancePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10 text-center"
            >
              <span className="text-6xl mb-4 block">🛡️</span>
              <h3 className="text-xl font-bold text-white mb-2">Pet Insurance</h3>
              <p className="text-white/60 text-sm mb-4">
                Protect your pet from unexpected emergencies! Insurance costs {getInsuranceCost().toFixed(1)} coins/day and covers emergency vet visits.
              </p>
              <p className="text-yellow-400 font-bold mb-4">One-time activation fee: 15 coins</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowInsurancePrompt(false)}
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleBuyInsurance}
                  disabled={pet.coins < 15}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 font-bold"
                >
                  Buy Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Tricks Modal */}
        {showTricks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowTricks(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10"
            >
              <div className="text-center mb-4">
                <span className="text-5xl mb-2 block">✨</span>
                <h3 className="text-xl font-bold text-white">Pet Tricks</h3>
                <p className="text-white/60 text-sm">Teach your pet special abilities!</p>
              </div>
              
              {/* Unlocked Tricks Section - Quick Perform */}
              {pet.tricks?.length > 0 && (
                <div className="mb-4 p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                  <h4 className="text-emerald-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>🌟</span> Quick Perform
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Roll Over', id: 'roll', icon: '🔄' },
                      { name: 'Play Dead', id: 'dead', icon: '💀' },
                      { name: 'Dance', id: 'dance', icon: '💃' },
                      { name: 'Fireball', id: 'fireball', icon: '🔥' },
                    ].filter(t => pet.tricks?.includes(t.id)).map((trick) => (
                      <Button
                        key={trick.id}
                        size="sm"
                        disabled={pet.energy < 10 || performingTrick}
                        onClick={() => {
                          if (pet.energy >= 10 && !performingTrick) {
                            setPerformingTrick(trick.id);
                            updatePetMutation.mutate({
                              id: pet.id,
                              data: {
                                happiness: Math.min(100, pet.happiness + 15),
                                energy: Math.max(0, pet.energy - 10),
                                experience: (pet.experience || 0) + 1
                              }
                            });
                            showNotification(`🌟 ${pet.name} performed ${trick.name}! +15 happiness, +1 XP`);
                            setTimeout(() => setPerformingTrick(null), 2000);
                          }
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-xs flex items-center gap-1"
                      >
                        <span>{trick.icon}</span> {trick.name}
                      </Button>
                    ))}
                  </div>
                  <p className="text-white/40 text-xs mt-2">Costs 10 energy • +15 happiness • +1 XP</p>
                </div>
              )}

              {/* Learn New Tricks Section */}
              <h4 className="text-white/60 text-sm font-semibold mb-2">Learn New Tricks</h4>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {[
                  { name: 'Roll Over', id: 'roll', icon: '🔄', cost: 20, unlocked: pet.tricks?.includes('roll') },
                  { name: 'Play Dead', id: 'dead', icon: '💀', cost: 30, unlocked: pet.tricks?.includes('dead') },
                  { name: 'Dance', id: 'dance', icon: '💃', cost: 50, unlocked: pet.tricks?.includes('dance') },
                  { name: 'Fireball', id: 'fireball', icon: '🔥', cost: 100, unlocked: pet.tricks?.includes('fireball') },
                ].map((trick) => (
                  <div key={trick.name} className={`flex items-center justify-between p-3 rounded-xl ${trick.unlocked ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{trick.icon}</span>
                      <span className="text-white font-medium">{trick.name}</span>
                    </div>
                    {trick.unlocked ? (
                      <span className="text-emerald-400 text-sm">✓ Learned</span>
                    ) : (
                      <Button
                        size="sm"
                        disabled={pet.coins < trick.cost}
                        onClick={() => {
                          if (pet.coins >= trick.cost) {
                            updatePetMutation.mutate({
                              id: pet.id,
                              data: {
                                coins: pet.coins - trick.cost,
                                tricks: [...(pet.tricks || []), trick.id]
                              }
                            });
                            showNotification(`🎉 Your pet learned ${trick.name}!`);
                          }
                        }}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-xs"
                      >
                        {trick.cost} 🪙
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => setShowTricks(false)}
                className="w-full mt-4 bg-white/10 text-white hover:bg-white/20"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Toy Shop Modal */}
        {showToyShop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowToyShop(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/10"
            >
              <div className="text-center mb-4">
                <span className="text-5xl mb-2 block">🧸</span>
                <h3 className="text-xl font-bold text-white">Toy Shop</h3>
                <p className="text-white/60 text-sm">Buy toys to make your pet happier!</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Ball', icon: '⚽', cost: 10, happiness: 5, owned: pet.toys?.includes('ball') },
                  { name: 'Squeaky Toy', icon: '🐤', cost: 20, happiness: 10, owned: pet.toys?.includes('squeaky') },
                  { name: 'Magic Wand', icon: '🪄', cost: 40, happiness: 15, owned: pet.toys?.includes('wand') },
                  { name: 'Golden Crown', icon: '👑', cost: 100, happiness: 25, owned: pet.toys?.includes('crown') },
                ].map((toy) => (
                  <div key={toy.name} className={`flex items-center justify-between p-3 rounded-xl ${toy.owned ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-white/5'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{toy.icon}</span>
                      <div>
                        <span className="text-white font-medium block">{toy.name}</span>
                        <span className="text-white/50 text-xs">+{toy.happiness} happiness</span>
                      </div>
                    </div>
                    {toy.owned ? (
                      <span className="text-amber-400 text-sm">✓ Owned</span>
                    ) : (
                      <Button
                        size="sm"
                        disabled={pet.coins < toy.cost}
                        onClick={() => {
                          if (pet.coins >= toy.cost) {
                            updatePetMutation.mutate({
                              id: pet.id,
                              data: {
                                coins: pet.coins - toy.cost,
                                toys: [...(pet.toys || []), toy.name.toLowerCase().replace(' ', '')],
                                happiness: Math.min(100, pet.happiness + toy.happiness)
                              }
                            });
                            showNotification(`🎁 You bought a ${toy.name}!`);
                          }
                        }}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-xs"
                      >
                        {toy.cost} 🪙
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => setShowToyShop(false)}
                className="w-full mt-4 bg-white/10 text-white hover:bg-white/20"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
