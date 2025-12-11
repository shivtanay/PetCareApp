/**
 * ExpenseChart.jsx - Expense Tracking & Analytics Component
 * 
 * This component provides a comprehensive expense report for pet care costs.
 * It displays:
 * - Total expenses summary
 * - Breakdown by category (feed, play, clean, health, insurance)
 * - Visual bar chart representation
 * - Recent transaction history
 * - Spending insights and tips
 * 
 * DATA STORAGE:
 * - Uses arrays (expenses) for complex data storage
 * - Each expense has: type, amount, description, date
 * - Grouped by category for analysis
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.expenses - Array of expense objects
 * @param {Function} props.onClose - Callback when modal closes
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingDown, TrendingUp, Coins, PieChart, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ExpenseChart({ expenses, onClose }) {
  /**
   * Calculate total expenses from all transactions
   * Uses reduce for efficient summation
   */
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);
  
  /**
   * Group expenses by category type
   * Returns object with type keys and summed amounts
   */
  const expensesByType = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
      return acc;
    }, {});
  }, [expenses]);

  /**
   * Calculate the highest expense category
   */
  const highestCategory = useMemo(() => {
    const entries = Object.entries(expensesByType);
    if (entries.length === 0) return null;
    return entries.reduce((max, curr) => curr[1] > max[1] ? curr : max);
  }, [expensesByType]);

  /**
   * Calculate average expense per transaction
   */
  const averageExpense = useMemo(() => {
    return expenses.length > 0 ? totalExpenses / expenses.length : 0;
  }, [expenses, totalExpenses]);

  /**
   * Category icons for visual identification
   */
  const typeIcons = {
    feed: '🍖',
    play: '🎮',
    clean: '✨',
    health: '💊',
    insurance: '🛡️',
    trick: '🎪',
    toy: '🧸'
  };

  /**
   * Category colors for visual consistency
   */
  const typeColors = {
    feed: 'from-orange-500 to-red-500',
    play: 'from-blue-500 to-purple-500',
    clean: 'from-cyan-500 to-blue-500',
    health: 'from-pink-500 to-red-500',
    insurance: 'from-green-500 to-emerald-500',
    trick: 'from-purple-500 to-pink-500',
    toy: 'from-amber-500 to-orange-500'
  };

  /**
   * Generate spending insight based on data
   */
  const getSpendingInsight = () => {
    if (expenses.length === 0) {
      return { icon: '📊', text: 'Start caring for your pet to see spending patterns!' };
    }
    
    if (highestCategory) {
      const [type, amount] = highestCategory;
      const percentage = ((amount / totalExpenses) * 100).toFixed(0);
      
      if (percentage > 50) {
        return { 
          icon: '💡', 
          text: `${percentage}% of your spending is on ${type}. Consider balancing your care routine!` 
        };
      }
    }
    
    if (averageExpense > 5) {
      return { icon: '⚡', text: 'Your average transaction is high. Try using mini-games to earn more coins!' };
    }
    
    return { icon: '✨', text: 'Great job managing your expenses! Keep up the balanced care.' };
  };

  const insight = getSpendingInsight();

  /**
   * Calculate maximum value for bar chart scaling
   */
  const maxCategoryValue = Math.max(...Object.values(expensesByType), 1);

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
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/10 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PieChart className="w-6 h-6 text-amber-400" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">Expense Report</h2>
              <p className="text-white/50 text-xs">{expenses.length} transactions recorded</p>
            </div>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Total Spent */}
          <motion.div 
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-3 border border-red-500/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <p className="text-white/60 text-xs">Total Spent</p>
            </div>
            <span className="text-xl font-bold text-red-300">{totalExpenses.toFixed(1)} 🪙</span>
          </motion.div>
          
          {/* Average */}
          <motion.div 
            className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-3 border border-blue-500/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4 text-blue-400" />
              <p className="text-white/60 text-xs">Avg Transaction</p>
            </div>
            <span className="text-xl font-bold text-blue-300">{averageExpense.toFixed(1)} 🪙</span>
          </motion.div>
        </div>

        {/* Spending Insight */}
        <motion.div 
          className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl p-3 mb-6 border border-amber-500/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">{insight.icon}</span>
            <p className="text-white/80 text-sm">{insight.text}</p>
          </div>
        </motion.div>

        {/* Category Breakdown with Visual Bar Chart */}
        <div className="space-y-3 mb-6">
          <h3 className="text-white/70 text-sm font-medium flex items-center gap-2">
            <span>📊</span> Spending by Category
          </h3>
          {Object.entries(expensesByType).length > 0 ? (
            Object.entries(expensesByType)
              .sort((a, b) => b[1] - a[1]) // Sort by amount descending
              .map(([type, amount], index) => {
                const percentage = (amount / maxCategoryValue) * 100;
                const totalPercentage = ((amount / totalExpenses) * 100).toFixed(0);
                
                return (
                  <motion.div 
                    key={type} 
                    className="bg-white/5 rounded-xl p-3 overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{typeIcons[type] || '📦'}</span>
                        <span className="text-white capitalize font-medium">{type}</span>
                        <span className="text-white/40 text-xs">({totalPercentage}%)</span>
                      </div>
                      <span className="text-yellow-300 font-bold">{amount.toFixed(1)}</span>
                    </div>
                    {/* Visual bar */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${typeColors[type] || 'from-gray-500 to-gray-600'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                );
              })
          ) : (
            <div className="text-center py-4 text-white/50">
              <p>No expenses recorded yet</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
            <span>📜</span> Recent Transactions
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {expenses.length > 0 ? (
              expenses.slice(-10).reverse().map((expense, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-center justify-between bg-white/5 rounded-lg p-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center gap-2">
                    <span>{typeIcons[expense.type] || '📦'}</span>
                    <span className="text-white/70">{expense.description || expense.type}</span>
                  </div>
                  <span className="text-red-300 font-medium">-{expense.amount.toFixed(1)}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-white/40 text-center py-4">No transactions yet</p>
            )}
          </div>
        </div>

        {/* Footer Tip */}
        <motion.div 
          className="mt-6 pt-4 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/40 text-xs flex items-center justify-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Tip: Complete chores to earn coins and offset expenses!
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
