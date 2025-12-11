/**
 * HelpModal.jsx - Interactive Help & Instructions Component
 * 
 * This component provides users with comprehensive help and instructions
 * for using the Mythical Pet Sanctuary application. It includes:
 * - FAQ section with common questions and answers
 * - Navigation guide explaining how to use the app
 * - Tips for keeping your pet happy and healthy
 * - Game instructions for mini-games
 * 
 * @component
 * @example
 * <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, ChevronDown, ChevronUp, Gamepad2, Heart, Coins, Trophy, Shield, Sparkles } from 'lucide-react';
import { Button } from './button';

// FAQ data structure containing all help topics
const helpTopics = [
  {
    category: 'Getting Started',
    icon: '🚀',
    questions: [
      {
        q: 'How do I adopt a pet?',
        a: 'Go to the "Adopt" page using the bottom navigation. Choose from 4 mythical creatures (Dragon, Cerberus, Kitsune, or Phoenix), select a color variant, give your pet a name, and click "Begin Your Journey" to adopt!'
      },
      {
        q: 'What do the different color variants mean?',
        a: 'Color variants (Classic, Golden, Cosmic, Frost) change your pet\'s appearance and the background theme. They\'re purely cosmetic and don\'t affect gameplay.'
      },
      {
        q: 'How do I navigate between pages?',
        a: 'Use the bottom navigation bar. Tap "Home" for the main menu, "My Pet" to care for your pet, "Adopt" to get a new pet, and "Memorial" to visit the graveyard.'
      }
    ]
  },
  {
    category: 'Pet Care',
    icon: '❤️',
    questions: [
      {
        q: 'How do I keep my pet healthy?',
        a: 'Monitor the 5 stat bars: Hunger, Happiness, Energy, Hygiene, and Health. Use care actions (Feed, Play, Rest, Clean) to maintain stats above 50%. If any stat drops too low, health will decrease!'
      },
      {
        q: 'What happens when my pet\'s health reaches 0?',
        a: 'Your pet will pass away. You can create a memorial (costs 50-100 coins) to honor them in the Memorial Garden, then adopt a new pet.'
      },
      {
        q: 'How does pet insurance work?',
        a: 'Buy insurance from the header (costs increase with age). Insurance prevents your pet\'s health from dropping below 20%, giving you time to recover their stats.'
      },
      {
        q: 'How does my pet evolve?',
        a: 'Pets have 3 stages: Egg → Hatchling → Fully Grown. Evolution happens automatically based on experience points gained from caring for your pet.'
      }
    ]
  },
  {
    category: 'Economy & Coins',
    icon: '💰',
    questions: [
      {
        q: 'How do I earn coins?',
        a: 'Complete chore mini-games! Tap "Do Chores" to access 3 games: Trash Sorting (30 coins), Window Cleaning (35 coins), and Wire Fixing (40 coins). You can also earn bonus coins from achievements.'
      },
      {
        q: 'What can I spend coins on?',
        a: 'Coins are used for: Care actions (feeding, playing, etc.), Pet insurance, Tricks and toys from the shop, and Memorial creation when your pet passes.'
      },
      {
        q: 'Why do costs increase over time?',
        a: 'As your pet ages, costs increase by 20% every 5 days. This simulates real-world pet ownership where older pets require more resources. Plan your coin spending wisely!'
      }
    ]
  },
  {
    category: 'Mini-Games',
    icon: '🎮',
    questions: [
      {
        q: 'How does Trash Sorting work?',
        a: 'Drag falling trash items to the correct bins: organic waste (green), recyclables (blue), and general waste (gray). Sort correctly to earn coins!'
      },
      {
        q: 'How does Window Cleaning work?',
        a: 'Click and drag across dirty spots on the window to clean them. Clean enough of the window before time runs out to earn coins.'
      },
      {
        q: 'How does Wire Fixing work?',
        a: 'Connect matching colored wires by clicking the endpoints. Match all wire pairs to complete the circuit and earn coins.'
      }
    ]
  },
  {
    category: 'Tricks & Toys',
    icon: '✨',
    questions: [
      {
        q: 'How do I teach my pet tricks?',
        a: 'Open the Tricks menu (wand icon). Buy tricks with coins, then use "Quick Perform" buttons that float around your pet to perform tricks instantly!'
      },
      {
        q: 'What do toys do?',
        a: 'Toys from the Toy Shop boost specific stats. They\'re single-use items that provide larger stat boosts than regular care actions.'
      }
    ]
  },
  {
    category: 'Achievements',
    icon: '🏆',
    questions: [
      {
        q: 'How do I unlock achievements?',
        a: 'Achievements unlock automatically as you play! Keep your pet healthy, earn coins, perform tricks, and play games to unlock various badges.'
      },
      {
        q: 'What do achievements do?',
        a: 'Achievements track your progress and some provide bonus rewards. View your collection by tapping the trophy icon in the pet care screen.'
      }
    ]
  }
];

// Tips for keeping your pet happy
const proTips = [
  '🍖 Feed your pet before hunger drops below 30% to avoid health damage',
  '😴 Let your pet rest when energy is low - tired pets are unhappy pets!',
  '🧼 Regular cleaning prevents hygiene-related health issues',
  '🎮 Play mini-games daily to maintain a healthy coin balance',
  '🛡️ Insurance is worth it for older pets - it can save their life!',
  '⚡ Perform tricks to keep happiness high between care sessions',
  '📊 Check the Expense Report to track your spending patterns'
];

/**
 * HelpModal Component
 * Displays an interactive help dialog with FAQs and tips
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback function when modal closes
 */
export default function HelpModal({ isOpen, onClose }) {
  // Track which FAQ item is expanded
  const [expandedItem, setExpandedItem] = useState(null);
  // Track current tip index for cycling through tips
  const [currentTip, setCurrentTip] = useState(0);

  /**
   * Toggle FAQ item expansion
   * @param {string} key - Unique key for the FAQ item
   */
  const toggleItem = (key) => {
    setExpandedItem(expandedItem === key ? null : key);
  };

  /**
   * Cycle to next pro tip
   */
  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % proTips.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center"
                >
                  <HelpCircle className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white">Help & Instructions</h2>
                  <p className="text-white/50 text-sm">Learn how to play</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Pro Tips Carousel */}
            <motion.div
              className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 mb-4 border border-amber-500/30 cursor-pointer"
              onClick={nextTip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">Pro Tip (tap for more)</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTip}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-white text-sm"
                >
                  {proTips[currentTip]}
                </motion.p>
              </AnimatePresence>
              <div className="flex justify-center gap-1 mt-2">
                {proTips.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentTip ? 'bg-amber-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* FAQ Accordion */}
            <div className="overflow-y-auto flex-1 space-y-3 pr-2 custom-scrollbar">
              {helpTopics.map((topic, topicIndex) => (
                <div key={topic.category} className="space-y-2">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 text-white/70 text-sm font-medium sticky top-0 bg-slate-800/90 backdrop-blur py-1">
                    <span>{topic.icon}</span>
                    <span>{topic.category}</span>
                  </div>
                  
                  {/* Questions */}
                  {topic.questions.map((item, qIndex) => {
                    const key = `${topicIndex}-${qIndex}`;
                    const isExpanded = expandedItem === key;
                    
                    return (
                      <motion.div
                        key={key}
                        className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
                        initial={false}
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-3 pb-3 text-white/70 text-sm border-t border-white/10 pt-3">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-white/40 text-xs">
                Mythical Pet Sanctuary v1.0 • Made with ❤️
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
