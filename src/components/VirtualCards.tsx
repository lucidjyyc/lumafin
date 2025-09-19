/**
 * Virtual Card Numbers Component - Secure Online Shopping
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Shield, 
  Clock, 
  DollarSign,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Settings,
  CheckCircle,
  AlertCircle,
  Calendar,
  Lock
} from 'lucide-react';

interface VirtualCard {
  id: string;
  nickname: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  type: 'single-use' | 'merchant-locked' | 'subscription' | 'general';
  spendingLimit: number;
  spentAmount: number;
  merchantName?: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  transactionCount: number;
}

export const VirtualCards: React.FC = () => {
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([
    {
      id: '1',
      nickname: 'Amazon Shopping',
      cardNumber: '4532 1234 5678 9012',
      expiryDate: '12/25',
      cvv: '123',
      type: 'merchant-locked',
      spendingLimit: 500.00,
      spentAmount: 234.56,
      merchantName: 'Amazon',
      isActive: true,
      createdAt: '2024-01-15',
      lastUsed: '2 days ago',
      transactionCount: 8
    },
    {
      id: '2',
      nickname: 'Netflix Subscription',
      cardNumber: '4532 9876 5432 1098',
      expiryDate: '06/25',
      cvv: '456',
      type: 'subscription',
      spendingLimit: 50.00,
      spentAmount: 15.99,
      merchantName: 'Netflix',
      isActive: true,
      createdAt: '2024-01-10',
      lastUsed: '1 week ago',
      transactionCount: 1
    },
    {
      id: '3',
      nickname: 'One-Time Purchase',
      cardNumber: '4532 5555 4444 3333',
      expiryDate: '03/25',
      cvv: '789',
      type: 'single-use',
      spendingLimit: 100.00,
      spentAmount: 89.99,
      isActive: false,
      createdAt: '2024-01-18',
      lastUsed: '5 hours ago',
      transactionCount: 1
    }
  ]);

  const handleCreateCard = () => {
    const newCard: VirtualCard = {
      id: Date.now().toString(),
      nickname: 'New Virtual Card',
      cardNumber: '4532 ' + Math.random().toString().slice(2, 6) + ' ' + 
                  Math.random().toString().slice(2, 6) + ' ' + 
                  Math.random().toString().slice(2, 6),
      expiryDate: '12/25',
      cvv: Math.floor(Math.random() * 900 + 100).toString(),
      type: 'general',
      spendingLimit: 1000.00,
      spentAmount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      transactionCount: 0
    };
    
    setVirtualCards(prev => [newCard, ...prev]);
    setShowCreateModal(false);
  };

  const handleDeleteCard = (cardId: string) => {
    setVirtualCards(prev => prev.filter(card => card.id !== cardId));
  };

  const handleToggleCard = (cardId: string) => {
    setVirtualCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isActive: !card.isActive } : card
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'single-use': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'merchant-locked': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'subscription': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'general': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getUsagePercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Virtual Card Numbers</h1>
          <p className="text-gray-400">Secure online shopping with temporary card numbers</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCardNumbers(!showCardNumbers)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            {showCardNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showCardNumbers ? 'Hide' : 'Show'} Numbers</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Virtual Card</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Active Cards</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {virtualCards.filter(card => card.isActive).length}
          </p>
          <p className="text-cyan-400 text-sm">Virtual cards in use</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Protected Spending</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            ${virtualCards.reduce((sum, card) => sum + card.spentAmount, 0).toFixed(2)}
          </p>
          <p className="text-emerald-400 text-sm">Secured transactions</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Security Score</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">98.5%</p>
          <p className="text-purple-400 text-sm">Fraud prevention rate</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">This Month</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {virtualCards.reduce((sum, card) => sum + card.transactionCount, 0)}
          </p>
          <p className="text-orange-400 text-sm">Transactions</p>
        </div>
      </div>

      {/* Virtual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {virtualCards.map((card) => {
          const usagePercentage = getUsagePercentage(card.spentAmount, card.spendingLimit);
          const isNearLimit = usagePercentage > 80;
          
          return (
            <div
              key={card.id}
              className={`bg-white/10 backdrop-blur-xl border rounded-xl p-6 transition-all duration-300 ${
                card.isActive 
                  ? 'border-white/20 hover:border-cyan-500/30' 
                  : 'border-gray-600/20 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    card.isActive ? 'bg-cyan-500/20' : 'bg-gray-500/20'
                  }`}>
                    <CreditCard className={`w-5 h-5 ${
                      card.isActive ? 'text-cyan-400' : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{card.nickname}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getCardTypeColor(card.type)}`}>
                      {card.type.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleCard(card.id)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">Card Number</span>
                  <button
                    onClick={() => copyToClipboard(card.cardNumber.replace(/\s/g, ''))}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-white font-mono text-lg mb-3">
                  {showCardNumbers ? card.cardNumber : '•••• •••• •••• ••••'}
                </p>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">Expires</p>
                    <p className="text-white font-mono">{showCardNumbers ? card.expiryDate : '••/••'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">CVV</p>
                    <p className="text-white font-mono">{showCardNumbers ? card.cvv : '•••'}</p>
                  </div>
                </div>
              </div>

              {/* Spending Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Spending</span>
                  <span className="text-white font-medium">
                    ${card.spentAmount.toFixed(2)} / ${card.spendingLimit.toFixed(2)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isNearLimit 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">{card.transactionCount} transactions</span>
                  <span className={`font-medium ${isNearLimit ? 'text-red-400' : 'text-cyan-400'}`}>
                    {usagePercentage.toFixed(1)}% used
                  </span>
                </div>
              </div>

              {/* Card Status */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {card.isActive ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      card.isActive ? 'text-emerald-400' : 'text-gray-500'
                    }`}>
                      {card.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {card.lastUsed && (
                    <span className="text-gray-400 text-xs">Used {card.lastUsed}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Create New Card Button */}
        <div
          onClick={() => setShowCreateModal(true)}
          className="bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 min-h-[300px]"
        >
          <div className="p-4 bg-cyan-500/20 rounded-full mb-4">
            <Plus className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Create Virtual Card</h3>
          <p className="text-gray-400 text-sm text-center">
            Generate a secure virtual card number for online shopping
          </p>
        </div>
      </div>

      {/* Card Types Info */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Virtual Card Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-4 bg-red-500/20 rounded-xl mb-3">
              <Clock className="w-6 h-6 text-red-400 mx-auto" />
            </div>
            <h4 className="text-white font-semibold mb-2">Single-Use</h4>
            <p className="text-gray-400 text-sm">Perfect for one-time purchases on unfamiliar websites</p>
          </div>
          
          <div className="text-center">
            <div className="p-4 bg-blue-500/20 rounded-xl mb-3">
              <Lock className="w-6 h-6 text-blue-400 mx-auto" />
            </div>
            <h4 className="text-white font-semibold mb-2">Merchant-Locked</h4>
            <p className="text-gray-400 text-sm">Dedicated cards for specific retailers you trust</p>
          </div>
          
          <div className="text-center">
            <div className="p-4 bg-purple-500/20 rounded-xl mb-3">
              <Calendar className="w-6 h-6 text-purple-400 mx-auto" />
            </div>
            <h4 className="text-white font-semibold mb-2">Subscription</h4>
            <p className="text-gray-400 text-sm">Controlled recurring payments with spending limits</p>
          </div>
          
          <div className="text-center">
            <div className="p-4 bg-emerald-500/20 rounded-xl mb-3">
              <Shield className="w-6 h-6 text-emerald-400 mx-auto" />
            </div>
            <h4 className="text-white font-semibold mb-2">General</h4>
            <p className="text-gray-400 text-sm">Flexible virtual cards with custom limits</p>
          </div>
        </div>
      </div>

      {/* Security Benefits */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Security Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Data Breach Protection</h4>
              <p className="text-gray-400 text-sm">If a merchant is compromised, only your virtual card number is exposed, not your real card details</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Spending Control</h4>
              <p className="text-gray-400 text-sm">Set custom spending limits to prevent overcharges and control your online shopping budget</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-1">Temporary Access</h4>
              <p className="text-gray-400 text-sm">Create cards that automatically expire, perfect for free trials and temporary subscriptions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Card Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Create Virtual Card</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Nickname</label>
                <input
                  type="text"
                  placeholder="e.g., Amazon Shopping"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Type</label>
                <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  <option value="general">General Use</option>
                  <option value="single-use">Single Use</option>
                  <option value="merchant-locked">Merchant Locked</option>
                  <option value="subscription">Subscription</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Spending Limit</label>
                <input
                  type="number"
                  placeholder="1000.00"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCard}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
              >
                Create Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};