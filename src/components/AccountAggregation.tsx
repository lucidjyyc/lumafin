import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Euro,
  PoundSterling
} from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'crypto';
  balance: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'ETH' | 'BTC';
  change: number;
  changePercent: number;
  lastTransaction: string;
  accountNumber: string;
}

export const AccountAggregation: React.FC = () => {
  const [showBalances, setShowBalances] = useState(true);
  const [accounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Main Checking',
      type: 'checking',
      balance: 12450.75,
      currency: 'USD',
      change: 234.50,
      changePercent: 1.9,
      lastTransaction: '2 hours ago',
      accountNumber: '****1234'
    },
    {
      id: '2',
      name: 'High Yield Savings',
      type: 'savings',
      balance: 45890.25,
      currency: 'USD',
      change: 1250.00,
      changePercent: 2.8,
      lastTransaction: '1 day ago',
      accountNumber: '****5678'
    },
    {
      id: '3',
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 78920.50,
      currency: 'USD',
      change: -1890.25,
      changePercent: -2.3,
      lastTransaction: '3 hours ago',
      accountNumber: '****9012'
    },
    {
      id: '4',
      name: 'Crypto Wallet',
      type: 'crypto',
      balance: 2.45678,
      currency: 'ETH',
      change: 0.12345,
      changePercent: 5.3,
      lastTransaction: '15 min ago',
      accountNumber: '0x...7890'
    }
  ]);

  const totalBalance = accounts
    .filter(acc => acc.currency === 'USD')
    .reduce((sum, acc) => sum + acc.balance, 0) + 
    (accounts.find(acc => acc.currency === 'ETH')?.balance || 0) * 2400; // ETH price simulation

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'USD': return <DollarSign className="w-4 h-4" />;
      case 'EUR': return <Euro className="w-4 h-4" />;
      case 'GBP': return <PoundSterling className="w-4 h-4" />;
      case 'ETH': return <span className="text-sm font-bold">Ξ</span>;
      case 'BTC': return <span className="text-sm font-bold">₿</span>;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking': return <CreditCard className="w-6 h-6" />;
      case 'savings': return <TrendingUp className="w-6 h-6" />;
      case 'investment': return <TrendingUp className="w-6 h-6" />;
      case 'crypto': return <Wallet className="w-6 h-6" />;
      default: return <CreditCard className="w-6 h-6" />;
    }
  };

  const formatBalance = (balance: number, currency: string) => {
    if (currency === 'ETH' || currency === 'BTC') {
      return balance.toFixed(6);
    }
    return balance.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      {/* Total Balance Overview */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Total Balance</h2>
            <p className="text-cyan-300">All accounts combined</p>
          </div>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            {showBalances ? <EyeOff className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
          </button>
        </div>
        
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-white">
            {showBalances ? `$${totalBalance.toLocaleString()}` : '••••••'}
          </span>
          <span className="text-cyan-300 text-lg">.00</span>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-medium">+$2,847 this month</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">+3.2%</span>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((account) => {
          const isPositiveChange = account.change >= 0;
          return (
            <div
              key={account.id}
              className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${
                    account.type === 'checking' ? 'bg-blue-500/20 text-blue-400' :
                    account.type === 'savings' ? 'bg-emerald-500/20 text-emerald-400' :
                    account.type === 'investment' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{account.name}</h3>
                    <p className="text-gray-400 text-sm">{account.accountNumber}</p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-white transition-all">
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCurrencyIcon(account.currency)}
                    <span className="text-2xl font-bold text-white">
                      {showBalances ? formatBalance(account.balance, account.currency) : '••••••'}
                    </span>
                    <span className="text-gray-400 text-sm">{account.currency}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isPositiveChange ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      isPositiveChange ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {isPositiveChange ? '+' : ''}{account.changePercent}%
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({isPositiveChange ? '+' : ''}{formatBalance(account.change, account.currency)} {account.currency})
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">{account.lastTransaction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
            <div className="p-3 bg-blue-500/20 rounded-xl mb-3 group-hover:bg-blue-500/30 transition-colors">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-white font-medium">Add Account</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
            <div className="p-3 bg-emerald-500/20 rounded-xl mb-3 group-hover:bg-emerald-500/30 transition-colors">
              <ArrowUpRight className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-white font-medium">Transfer</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
            <div className="p-3 bg-purple-500/20 rounded-xl mb-3 group-hover:bg-purple-500/30 transition-colors">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-white font-medium">Invest</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
            <div className="p-3 bg-orange-500/20 rounded-xl mb-3 group-hover:bg-orange-500/30 transition-colors">
              <Wallet className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-white font-medium">Crypto</span>
          </button>
        </div>
      </div>
    </div>
  );
};