/**
 * CareActions.jsx - Pet Care Action Buttons Component
 * 
 * This component displays the main care actions available for the pet.
 * Each action affects different pet stats and costs coins (except Rest).
 * 
 * ACTIONS:
 * - Feed: Increases hunger stat (+10 coins cost)
 * - Play: Increases happiness stat (+5 coins cost)
 * - Rest: Increases energy stat (FREE)
 * - Clean: Increases hygiene stat (+7 coins cost)
 * - Health: Increases health stat (+15 coins cost)
 * 
 * FEATURES:
 * - Cost multiplier increases with pet age
 * - Visual feedback for affordable vs unaffordable actions
 * - Animated hover effects and button states
 * - Disabled state when action is in progress
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onAction - Callback when action is triggered (actionId, cost)
 * @param {number} props.coins - Current coin balance for affordability check
 * @param {boolean} props.disabled - Whether actions are disabled (during animations)
 * @param {number} props.costMultiplier - Multiplier for costs (increases with age)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Utensils, Gamepad2, Moon, Sparkles, Stethoscope } from 'lucide-react';

/**
 * Care action configuration array
 * Each action has: id, display label, icon, gradient colors, glow effect, base cost
 */
const actions = [
  { id: 'feed', label: 'Feed', icon: Utensils, color: 'from-orange-400 to-red-500', glowColor: 'rgba(249, 115, 22, 0.4)', cost: 10 },
  { id: 'play', label: 'Play', icon: Gamepad2, color: 'from-pink-400 to-purple-500', glowColor: 'rgba(236, 72, 153, 0.4)', cost: 5 },
  { id: 'rest', label: 'Rest', icon: Moon, color: 'from-blue-400 to-indigo-500', glowColor: 'rgba(96, 165, 250, 0.4)', cost: 0 },
  { id: 'clean', label: 'Clean', icon: Sparkles, color: 'from-cyan-400 to-teal-500', glowColor: 'rgba(34, 211, 238, 0.4)', cost: 7 },
  { id: 'health', label: 'Health', icon: Stethoscope, color: 'from-emerald-400 to-green-500', glowColor: 'rgba(52, 211, 153, 0.4)', cost: 15 },
];

/**
 * Animation variants for staggered container
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

/**
 * Animation variants for individual buttons
 */
const buttonVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

export default function CareActions({ onAction, coins, disabled, costMultiplier = 1 }) {
  return (
    <motion.div 
      className="grid grid-cols-5 gap-2 md:gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {actions.map((action, index) => {
        const Icon = action.icon;
        // Calculate actual cost with age multiplier
        const actualCost = Math.ceil(action.cost * costMultiplier);
        // Check if user can afford this action
        const canAfford = coins >= actualCost;
        
        return (
          <motion.div
            key={action.id}
            variants={buttonVariants}
            whileHover={{ 
              scale: canAfford && !disabled ? 1.1 : 1, 
              y: canAfford && !disabled ? -5 : 0,
            }}
            whileTap={{ scale: canAfford && !disabled ? 0.9 : 1 }}
          >
            <Button
              onClick={() => onAction(action.id, action.cost)}
              disabled={disabled || !canAfford}
              className={`w-full h-auto flex flex-col items-center gap-1 py-3 px-2 bg-gradient-to-br ${action.color} hover:opacity-90 disabled:opacity-40 border-0 shadow-lg relative overflow-hidden group`}
              style={{
                boxShadow: canAfford ? `0 5px 20px ${action.glowColor}` : 'none'
              }}
            >
              {/* Animated background shimmer on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Floating particles on hover - visual feedback */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={false}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100"
                    style={{ left: `${20 + i * 30}%`, bottom: '20%' }}
                    animate={{
                      y: [0, -20],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.div
                animate={{ 
                  rotate: disabled ? 0 : [0, -5, 5, 0],
                  scale: disabled ? 1 : [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2 + index * 0.3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 relative z-10" />
              </motion.div>
              <span className="text-[10px] md:text-xs font-medium relative z-10">{action.label}</span>
              {actualCost > 0 && (
                <motion.span 
                  className="text-[9px] md:text-[10px] opacity-80 relative z-10"
                  animate={!canAfford ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  💰 {actualCost}
                </motion.span>
              )}
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
