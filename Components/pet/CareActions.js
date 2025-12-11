import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Utensils, Gamepad2, Moon, Sparkles, Stethoscope } from 'lucide-react';

const actions = [
  { id: 'feed', label: 'Feed', icon: Utensils, color: 'from-orange-400 to-red-500', cost: 10 },
  { id: 'play', label: 'Play', icon: Gamepad2, color: 'from-pink-400 to-purple-500', cost: 5 },
  { id: 'rest', label: 'Rest', icon: Moon, color: 'from-blue-400 to-indigo-500', cost: 0 },
  { id: 'clean', label: 'Clean', icon: Sparkles, color: 'from-cyan-400 to-teal-500', cost: 7 },
  { id: 'health', label: 'Health Check', icon: Stethoscope, color: 'from-emerald-400 to-green-500', cost: 15 },
];

export default function CareActions({ onAction, coins, disabled, costMultiplier = 1 }) {
  return (
    <div className="grid grid-cols-5 gap-2 md:gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const actualCost = Math.ceil(action.cost * costMultiplier);
        const canAfford = coins >= actualCost;
        
        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              onClick={() => onAction(action.id, action.cost)}
              disabled={disabled || !canAfford}
              className={`w-full h-auto flex flex-col items-center gap-1 py-3 px-2 bg-gradient-to-br ${action.color} hover:opacity-90 disabled:opacity-40 border-0 shadow-lg`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[10px] md:text-xs font-medium">{action.label}</span>
              {actualCost > 0 && (
                <span className="text-[9px] md:text-[10px] opacity-80">💰 {actualCost}</span>
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}