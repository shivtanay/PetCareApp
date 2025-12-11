import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Home, Heart, Plus } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'My Pet', icon: Heart, page: 'PetCare' },
    { name: 'Adopt', icon: Plus, page: 'PetAdopt' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {children}
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 px-4 py-2 z-30">
        <div className="max-w-lg mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPageName === item.page;
            
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="flex flex-col items-center py-2 px-4"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900' 
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-xs mt-1 ${isActive ? 'text-amber-400' : 'text-white/40'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}