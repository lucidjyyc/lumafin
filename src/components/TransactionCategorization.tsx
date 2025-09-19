/**
 * Transaction Categorization Component - Auto-label Spending
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Car, 
  Home, 
  Utensils, 
  Gamepad2, 
  Heart, 
  Briefcase,
  Tag,
  Filter,
  TrendingUp,
  PieChart
} from 'lucide-react';

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  confidence: number;
  isManuallyTagged: boolean;
}

interface Category {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  total: number;
  percentage: number;
  transactions: number;
}

export const TransactionCategorization: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      merchant: 'Whole Foods Market',
      amount: -89.45,
      category: 'Food & Dining',
      subcategory: 'Groceries',
      date: '2024-01-20',
      confidence: 0.95,
      isManuallyTagged: false
    },
    {
      id: '2',
      merchant: 'Shell Gas Station',
      amount: -45.20,
      category: 'Transportation',
      subcategory: 'Gas',
      date: '2024-01-20',
      confidence: 0.98,
      isManuallyTagged: false
    },
    {
      id: '3',
      merchant: 'Netflix',
      amount: -15.99,
      category: 'Entertainment',
      subcategory: 'Streaming',
      date: '2024-01-19',
      confidence: 0.99,
      isManuallyTagged: false
    },
    {
      id: '4',
      merchant: 'Starbucks',
      amount: -6.75,
      category: 'Food & Dining',
      subcategory: 'Coffee',
      date: '2024-01-19',
      confidence: 0.92,
      isManuallyTagged: true
    },
    {
      id: '5',
      merchant: 'Amazon',
      amount: -124.99,
      category: 'Shopping',
      subcategory: 'Online',
      date: '2024-01-18',
      confidence: 0.87,
      isManuallyTagged: false
    }
  ]);

  const categories: Category[] = [
    {
      name: 'Food & Dining',
      icon: Utensils,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      total: 456.78,
      percentage: 32.1,
      transactions: 23
    },
    {
      name: 'Transportation',
      icon: Car,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      total: 289.45,
      percentage: 20.3,
      transactions: 12
    },
    {
      name: 'Shopping',
      icon: ShoppingCart,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      total: 234.67,
      percentage: 16.5,
      transactions: 8
    },
    {
      name: 'Entertainment',
      icon: Gamepad2,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      total: 156.89,
      percentage: 11.0,
      transactions: 15
    },
    {
      name: 'Bills & Utilities',
      icon: Home,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      total: 189.23,
      percentage: 13.3,
      transactions: 6
    },
    {
      name: 'Healthcare',
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      total: 98.45,
      percentage: 6.9,
      transactions: 4
    }
  ];

  const filteredTransactions = selectedCategory 
    ? transactions.filter(t => t.category === selectedCategory)
    : transactions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Spending Categories</h1>
          <p className="text-gray-400">AI-powered transaction categorization and insights</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
            <Tag className="w-4 h-4" />
            <span>Manage Categories</span>
          </button>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          
          return (
            <div
              key={category.name}
              onClick={() => setSelectedCategory(isSelected ? null : category.name)}
              className={`cursor-pointer bg-white/10 backdrop-blur-xl border rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'border-cyan-500/50 bg-cyan-500/10' 
                  : 'border-white/20 hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${category.bgColor}`}>
                  <Icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{category.transactions} transactions</p>
                  <p className={`text-sm font-medium ${category.color}`}>{category.percentage}%</p>
                </div>
              </div>
              
              <h3 className="text-white font-semibold mb-2">{category.name}</h3>
              <p className="text-2xl font-bold text-white">${category.total.toFixed(2)}</p>
              
              {/* Progress bar */}
              <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${category.color.replace('text-', 'from-').replace('-400', '-500')} to-${category.color.replace('text-', '').replace('-400', '-600')}`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Spending Breakdown Chart */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Monthly Spending Breakdown</h3>
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 text-sm">This Month</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart Placeholder */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {categories.map((category, index) => {
                  const circumference = 2 * Math.PI * 40;
                  const strokeDasharray = `${(category.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -categories.slice(0, index).reduce((sum, cat) => sum + (cat.percentage / 100) * circumference, 0);
                  
                  return (
                    <circle
                      key={category.name}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={category.color.replace('text-', '').replace('-400', '')}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 hover:stroke-width-10"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">$1,425</p>
                  <p className="text-gray-400 text-sm">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Legend */}
          <div className="space-y-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.bgColor}`}>
                      <Icon className={`w-4 h-4 ${category.color}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{category.name}</p>
                      <p className="text-gray-400 text-sm">{category.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${category.total.toFixed(2)}</p>
                    <p className={`text-sm ${category.color}`}>{category.percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {selectedCategory ? `${selectedCategory} Transactions` : 'Recent Transactions'}
          </h3>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
            >
              View All
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-lg">
                    {transaction.merchant.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{transaction.merchant}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">{transaction.category}</span>
                    {transaction.isManuallyTagged && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Manual</span>
                    )}
                    <span className="text-gray-500 text-xs">
                      {Math.round(transaction.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">${Math.abs(transaction.amount).toFixed(2)}</p>
                <p className="text-gray-400 text-sm">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};