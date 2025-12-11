import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Coins, Trophy, Shield, AlertTriangle, Sparkles, RotateCcw, HelpCircle, Receipt, Clock } from 'lucide-react';

import PetDisplay from '@/components/pet/PetDisplay';
import StatBar from '@/components/pet/StatBar';
import CareActions from '@/components/pet/CareActions';
import ChoresMenu from '@/components/pet/ChoresMenu';
import Achievements from '@/components/pet/Achievements';
import TrashGame from '@/components/games/TrashGame';
import WindowGame from '@/components/games/WindowGame';
import WireGame from '@/components/games/WireGame';
import ExpenseChart from '@/components/pet/ExpenseChart';

export default function PetCare() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showChores, setShowChores] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showInsurancePrompt, setShowInsurancePrompt] = useState(false);
  const [dayTimeLeft, setDayTimeLeft] = useState(0);

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
    if (!pet) return 45000;
    const ageGroup = Math.floor(pet.days_alive / 5);
    const duration = Math.max(10, 45 - (ageGroup * 5)); // Min 10 seconds
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
      
      // Apply daily decay
      const hungerDecay = 10 + Math.random() * 20; // 10-30%
      const hygieneDecay = 10 + Math.random() * 20; // 10-30%
      const energyDecay = 5 + Math.random() * 5; // 5-10%
      
      updates.hunger = Math.max(0, pet.hunger - hungerDecay);
      updates.hygiene = Math.max(0, pet.hygiene - hygieneDecay);
      updates.energy = Math.max(0, pet.energy - energyDecay);
      updates.happiness = Math.max(0, pet.happiness - 5);
      
      // Health decays only if other stats are below 50%
      const lowStats = [pet.hunger, pet.happiness, pet.hygiene, pet.energy].filter(s => s < 50).length;
      if (lowStats > 0) {
        const healthDecay = 10 + Math.random() * 10; // 10-20%
        updates.health = Math.max(0, pet.health - healthDecay);
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

  // Check for evolution based on experience
  useEffect(() => {
    if (!pet) return;
    
    if (pet.stage === 'egg' && pet.experience >= 3) {
      updatePetMutation.mutate({
        id: pet.id,
        data: { 
          stage: 'hatchling',
          experience: 0,
          achievements: [...(pet.achievements || []), 'hatchling']
        }
      });
      showNotification('🐣 Your pet hatched into a hatchling!');
    } else if (pet.stage === 'hatchling' && pet.experience >= 5) {
      updatePetMutation.mutate({
        id: pet.id,
        data: { 
          stage: 'grown',
          experience: 5,
          achievements: [...(pet.achievements || []), 'fully_grown']
        }
      });
      showNotification('⭐ Your pet is now fully grown!');
    }
  }, [pet?.experience, pet?.stage]);

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

  const mood = getMood();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-24">
      {/* Notification toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-medium"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{pet.name}</h1>
            <p className="text-white/50 text-sm capitalize">{pet.species} • Day {pet.days_alive || 1}</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAchievements(true)}
              className="p-2 bg-white/10 rounded-xl"
            >
              <Trophy className="w-5 h-5 text-yellow-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowExpenses(true)}
              className="p-2 bg-white/10 rounded-xl"
            >
              <Receipt className="w-5 h-5 text-amber-400" />
            </motion.button>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-4 py-2 rounded-xl border border-amber-500/30">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 font-bold">{Math.round(pet.coins)}</span>
            </div>
          </div>
        </div>

        {/* Day Timer */}
        <div className="flex items-center justify-center gap-2 bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30 mb-4">
          <Clock className="w-4 h-4 text-purple-300" />
          <span className="text-purple-200 text-sm">
            Day {pet.days_alive + 1} ends in {Math.floor(dayTimeLeft / 60)}:{String(dayTimeLeft % 60).padStart(2, '0')}
          </span>
        </div>

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
          <PetDisplay pet={pet} mood={mood} isAnimating={isAnimating} />
        </div>

        {/* Stats */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-5 mb-6 border border-white/10 space-y-3">
          <StatBar label="Hunger" value={pet.hunger} icon="🍖" color="bg-orange-500" />
          <StatBar label="Happiness" value={pet.happiness} icon="😊" color="bg-pink-500" />
          <StatBar label="Energy" value={pet.energy} icon="⚡" color="bg-yellow-500" />
          <StatBar label="Hygiene" value={pet.hygiene} icon="✨" color="bg-cyan-500" />
          <StatBar label="Health" value={pet.health} icon="❤️" color="bg-red-500" />
          
          {/* Experience bar */}
          <div className="pt-2 border-t border-white/10">
            <StatBar 
              label={`Experience (${pet.stage === 'egg' ? 'to Hatchling' : pet.stage === 'hatchling' ? 'to Grown' : 'Max'})`}
              value={pet.experience} 
              icon="⭐" 
              color="bg-purple-500"
              maxValue={pet.stage === 'egg' ? 3 : pet.stage === 'hatchling' ? 5 : 5}
            />
          </div>
        </div>

        {/* Care Actions */}
        <CareActions 
          onAction={handleCareAction} 
          coins={pet.coins}
          costMultiplier={getCostMultiplier()}
          disabled={updatePetMutation.isPending}
        />

        {/* Bottom buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => setShowChores(true)}
            className="flex-1 py-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Earn Coins
          </Button>
          
          {!pet.has_insurance && (
            <Button
              onClick={() => setShowInsurancePrompt(true)}
              className="py-6 px-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl"
            >
              <Shield className="w-5 h-5" />
            </Button>
          )}
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
      </AnimatePresence>
    </div>
  );
}