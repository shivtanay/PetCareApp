/**
 * Layout.jsx - Main Application Layout Component
 * 
 * This component provides the overall structure for the Mythical Pet Sanctuary app:
 * - Animated background particles for visual appeal
 * - Page transitions with AnimatePresence
 * - Bottom navigation bar with active state indicators
 * - Help button for accessing instructions
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render
 * @param {string} props.currentPageName - Name of current page for nav highlighting
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Heart, Plus, Sparkles, Flower2, HelpCircle } from 'lucide-react';
import HelpModal from '@/components/ui/HelpModal';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  // State for showing/hiding the help modal
  const [showHelp, setShowHelp] = useState(false);
  
  /**
   * Navigation items configuration
   * Each item has: name, icon component, page route, and gradient color
   */
  const navItems = [
    { name: 'Home', icon: Home, page: 'Home', color: 'from-amber-400 to-orange-500' },
    { name: 'My Pet', icon: Heart, page: 'PetCare', color: 'from-pink-400 to-rose-500' },
    { name: 'Adopt', icon: Plus, page: 'PetAdopt', color: 'from-emerald-400 to-teal-500' },
    { name: 'Memorial', icon: Flower2, page: 'Graveyard', color: 'from-purple-400 to-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-20 overflow-y-auto relative">
      {/* Animated background particles - creates floating effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Page content with transition animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Floating Help Button - Always accessible */}
      <motion.button
        onClick={() => setShowHelp(true)}
        className="fixed top-4 right-4 z-40 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(251, 191, 36, 0.3)',
            '0 0 30px rgba(251, 191, 36, 0.5)',
            '0 0 20px rgba(251, 191, 36, 0.3)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        title="Help & Instructions"
      >
        <HelpCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      
      {/* Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 z-30"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated glow line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <div className="max-w-lg mx-auto flex justify-around items-center">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.page;
            
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex flex-col items-center py-2 px-4 relative"
              >
                <motion.div
                  initial={false}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isActive ? { y: -5 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`p-2.5 rounded-xl relative overflow-hidden ${
                    isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
                  style={isActive ? { boxShadow: '0 5px 20px rgba(251, 191, 36, 0.3)' } : {}}
                >
                  {/* Active indicator ring */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0.5, 0, 0.5],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ 
                        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                      }}
                    />
                  )}
                  
                  {/* Shimmer effect on active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  
                  <motion.div
                    animate={isActive ? {
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className="w-5 h-5 relative z-10" />
                  </motion.div>
                </motion.div>
                
                <motion.span 
                  className={`text-xs mt-1 font-medium ${isActive ? 'text-amber-400' : 'text-white/40'}`}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {item.name}
                </motion.span>
                
                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 right-2"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </motion.div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
