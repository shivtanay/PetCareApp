import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingDown, Coins } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ExpenseChart({ expenses, onClose }) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const expensesByType = expenses.reduce((acc, exp) => {
    acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
    return acc;
  }, {});

  const typeIcons = {
    feed: '🍖',
    play: '🎮',
    clean: '✨',
    health: '💊',
    insurance: '🛡️'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/10 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Expenses</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl p-4 mb-6 border border-amber-500/30">
          <p className="text-white/60 text-sm mb-1">Total Expenses</p>
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-3xl font-bold text-yellow-300">{totalExpenses.toFixed(1)}</span>
          </div>
        </div>

        {/* By Category */}
        <div className="space-y-3 mb-6">
          <h3 className="text-white/70 text-sm font-medium mb-3">By Category</h3>
          {Object.entries(expensesByType).map(([type, amount]) => (
            <div key={type} className="flex items-center justify-between bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{typeIcons[type]}</span>
                <span className="text-white capitalize">{type}</span>
              </div>
              <span className="text-yellow-300 font-bold">{amount.toFixed(1)}</span>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-white/70 text-sm font-medium mb-3">Recent Transactions</h3>
          <div className="space-y-2">
            {expenses.slice(-10).reverse().map((expense, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>{typeIcons[expense.type]}</span>
                  <span className="text-white/70">{expense.description || expense.type}</span>
                </div>
                <span className="text-red-300">-{expense.amount.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}