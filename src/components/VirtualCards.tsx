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
  Lock,
  Globe,
  ShoppingCart
} from 'lucide-react';

interface VirtualCard {
  id: string;
  nickname: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  spendingLimit: number;
  usedAmount: number;
  merchant?: string;
  status: 'active' | 'paused' | 'expired' | 'cancelled';
  usageType: 'single-use' | 'merchant-locked' | 'subscription' | 'general';
  createdAt: string;
  lastUsed?: string;
  transactionCount: number;
}

export const VirtualCards: React.FC = () => {
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([
    {
      id: 'vc_001',
      nickname: 'Netflix Subscription',
      cardNumber: '4532 1234 5678 9012',
      expiryDate: '12/25',
      cvv: '123',
      spendingLimit: 20.00,
      usedAmount: 15.99,
      merchant: 'Netflix',
      status: 'active',
      usageType: 'subscription',
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20',
      transactionCount: 1
    },
    {
      id: 'vc_002',
      nickname: 'Amazon Purchase',
      cardNumber: '4532 9876 5432 1098',
      expiryDate: '03/25',
      cvv: '456',
      spendingLimit: 500.00,
      usedAmount: 0.00,
      merchant: 'Amazon',
      status: 'active',
      usageType: 'merchant-locked',
      createdAt: '2024-01-20',
      transactionCount: 0
    },
    {
      id: 'vc_003',
      nickname: 'One-time Purchase',
      cardNumber: '4532 1111 2222 3333',
      expiryDate: '02/25',
      cvv: '789',
      spendingLimit: 150.00,
      usedAmount: 149.99,
      status: 'expired',
      usageType: 'single-use',
      createdAt: '2024-01-18',
      lastUsed: '2024-01-18',
      transactionCount: 1
    }
  ]);

  const [newCardForm, setNewCardForm] = useState({
    nickname: '',
    spendingLimit: '',
    usageType: 'general' as const,
    merchant: '',
    expiryDays: '30'
  });

  const createVirtualCard = async () => {
    setIsCreating(true);
    
    // Simulate API call to create virtual card
    const apiKey = "vcard_demo_12345abcdef67890";
    const baseUrl = "https://api.virtualcards.demo/v1/";
    
    try {
      // Demo API structure (would be real API call in production)
      const newCard: VirtualCard = {
        id: `vc_${Date.now()}`,
        nickname: newCardForm.nickname || 'Virtual Card',
        cardNumber: generateCardNumber(),
        expiryDate: calculateExpiryDate(parseInt(newCardForm.expiryDays)),
        cvv: generateCVV(),
        spendingLimit: parseFloat(newCardForm.spendingLimit) || 100,
        usedAmount: 0,
        merchant: newCardForm.merchant || undefined,
        status: 'active',
        usageType: newCardForm.usageType,
        createdAt: new Date().toISOString().split('T')[0],
        transactionCount: 0
      };

      setVirtualCards(prev => [newCard, ...prev]);
      setNewCardForm({
        nickname: '',
        spendingLimit: '',
        usageType: 'general',
        merchant: '',
        expiryDays: '30'
      });
      
      console.log('Virtual card created:', { apiKey: apiKey.substring(0, 10) + '...', baseUrl, card: newCard });
    } catch (error) {
      console.error('Failed to create virtual card:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const generateCardNumber = () => {
    return '4532 ' + Math.random().toString().slice(2, 6) + ' ' + 
           Math.random().toString().slice(2, 6) + ' ' + 
           Math.random().toString().slice(2, 6);
  };

  const generateCVV = () => {
    return Math.floor(Math.random() * 900 + 100).toString();
  };

  const calculateExpiryDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const pauseCard = (cardId: string) => {
    setVirtualCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, status: card.status === 'active' ? 'paused' : 'active' }
        : card
    ));
  };

  const deleteCard = (cardId: string) => {
    setVirtualCards(prev => prev.filter(card => card.id !== cardId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'paused': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'expired': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getUsageTypeIcon = (type: string) => {
    switch (type) {
      case 'single-use': return <Lock className="w-4 h-4" />;
      case 'merchant-locked': return <ShoppingCart className="w-4 h-4" />;
      case 'subscription': return <Calendar className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
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
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Virtual Card</span>
          </button>
        </div>
      </div>

      {/* Security Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Enhanced Security</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Your real card details stay protected. Even if a merchant is breached, only the virtual number is compromised.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Spending Control</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Set custom spending limits and expiration dates to prevent overcharges and unwanted recurring payments.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Privacy Protection</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Shop online without exposing your real card information to various merchants and websites.
          </p>
        </div>
      </div>

      {/* Create New Virtual Card */}
      {isCreating && (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Create Virtual Card</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Nickname</label>
                <input
                  type="text"
                  value={newCardForm.nickname}
                  onChange={(e) => setNewCardForm(prev => ({ ...prev, nickname: e.target.value }))}
                  placeholder="e.g., Amazon Shopping, Netflix Sub"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Usage Type</label>
                <select
                  value={newCardForm.usageType}
                  onChange={(e) => setNewCardForm(prev => ({ ...prev, usageType: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="general">General Use</option>
                  <option value="single-use">Single Transaction</option>
                  <option value="merchant-locked">Specific Merchant</option>
                  <option value="subscription">Subscription Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Spending Limit ($)</label>
                <input
                  type="number"
                  value={newCardForm.spendingLimit}
                  onChange={(e) => setNewCardForm(prev => ({ ...prev, spendingLimit: e.target.value }))}
                  placeholder="100.00"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              {newCardForm.usageType === 'merchant-locked' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Merchant Name</label>
                  <input
                    type="text"
                    value={newCardForm.merchant}
                    onChange={(e) => setNewCardForm(prev => ({ ...prev, merchant: e.target.value }))}
                    placeholder="e.g., Amazon, Netflix, Spotify"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Expires In (Days)</label>
                <select
                  value={newCardForm.expiryDays}
                  onChange={(e) => setNewCardForm(prev => ({ ...prev, expiryDays: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="1">1 Day</option>
                  <option value="7">1 Week</option>
                  <option value="30">1 Month</option>
                  <option value="90">3 Months</option>
                  <option value="365">1 Year</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  onClick={createVirtualCard}
                  disabled={isCreating}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all font-semibold"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Virtual Card</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {virtualCards.map((card) => (
          <div
            key={card.id}
            className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:border-cyan-500/30 transition-all duration-300"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  card.status === 'active' ? 'bg-emerald-500/20' :
                  card.status === 'paused' ? 'bg-yellow-500/20' :
                  'bg-gray-500/20'
                }`}>
                  {getUsageTypeIcon(card.usageType)}
                  <span className={`${
                    card.status === 'active' ? 'text-emerald-400' :
                    card.status === 'paused' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{card.nickname}</h3>
                  <p className="text-gray-400 text-sm capitalize">{card.usageType.replace('-', ' ')}</p>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(card.status)}`}>
                {card.status}
              </span>
            </div>

            {/* Card Details */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <CreditCard className="w-6 h-6 text-cyan-400" />
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(card.cardNumber.replace(/\s/g, ''))}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Copy card number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-mono text-lg">
                  {showCardNumbers ? card.cardNumber : '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">EXPIRES</p>
                    <p className="text-white font-mono">
                      {showCardNumbers ? card.expiryDate : '••/••'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">CVV</p>
                    <p className="text-white font-mono">
                      {showCardNumbers ? card.cvv : '•••'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Progress */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Spending</span>
                <span className="text-white font-medium">
                  ${card.usedAmount.toFixed(2)} / ${card.spendingLimit.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  style={{ width: `${Math.min((card.usedAmount / card.spendingLimit) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{card.transactionCount} transactions</span>
                <span>{card.lastUsed ? `Last used ${card.lastUsed}` : 'Never used'}</span>
              </div>
            </div>

            {/* Merchant Info */}
            {card.merchant && (
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <p className="text-gray-400 text-xs">LOCKED TO MERCHANT</p>
                <p className="text-white font-medium">{card.merchant}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              {card.status === 'active' && (
                <button
                  onClick={() => pauseCard(card.id)}
                  className="flex-1 px-3 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                >
                  Pause
                </button>
              )}
              {card.status === 'paused' && (
                <button
                  onClick={() => pauseCard(card.id)}
                  className="flex-1 px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm font-medium"
                >
                  Activate
                </button>
              )}
              <button
                onClick={() => deleteCard(card.id)}
                className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                title="Delete card"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Statistics */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Virtual Card Usage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{virtualCards.length}</div>
            <div className="text-gray-400 text-sm">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {virtualCards.filter(c => c.status === 'active').length}
            </div>
            <div className="text-gray-400 text-sm">Active Cards</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              ${virtualCards.reduce((sum, card) => sum + card.usedAmount, 0).toFixed(0)}
            </div>
            <div className="text-gray-400 text-sm">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {virtualCards.reduce((sum, card) => sum + card.transactionCount, 0)}
            </div>
            <div className="text-gray-400 text-sm">Transactions</div>
          </div>
        </div>
      </div>
    </div>
  );
};