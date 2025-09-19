import React, { useState } from 'react';
import { useAccounts, useCreateAccount } from '../hooks/useApi';
import { useRealTimeBalances } from '../hooks/useWebSocket';
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
  const { data: accounts, loading, error, refetch } = useAccounts();
  const { createAccount, loading: creating } = useCreateAccount();
  const [showBalances, setShowBalances] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    account_type: 'checking',
    currency: 'USD',
    initial_deposit: ''
  });

  // Real-time balance updates
  const accountIds = accounts?.map(acc => acc.id) || [];
  const { balances } = useRealTimeBalances(accountIds);

  const handleCreateAccount = async () => {
    try {
      await createAccount(newAccountData);
      setShowCreateModal(false);
      setNewAccountData({
        account_type: 'checking',
        currency: 'USD',
        initial_deposit: ''
      });
      refetch();
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
        <span className="ml-3 text-white">Loading accounts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
        <h3 className="font-semibold mb-2">Error Loading Accounts</h3>
        <p>{error}</p>
        <button 
          onClick={refetch}
          className="mt-3 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalBalance = accounts
    ?.filter(acc => acc.currency === 'USD')
    .reduce((sum, acc) => sum + parseFloat(acc.available_balance || '0'), 0) || 0;

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

  const getAccountIcon = (account_type: string) => {
    switch (account_type) {
      case 'checking': return <CreditCard className="w-6 h-6" />;
      case 'savings': return <TrendingUp className="w-6 h-6" />;
      case 'investment': return <TrendingUp className="w-6 h-6" />;
      case 'crypto': return <Wallet className="w-6 h-6" />;
      default: return <CreditCard className="w-6 h-6" />;
    }
  };

  const formatBalance = (balance: string | number, currency: string) => {
    const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
    if (currency === 'ETH' || currency === 'BTC') {
      return numBalance.toFixed(6);
    }
    return numBalance.toLocaleString('en-US', { minimumFractionDigits: 2 });
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
        {accounts?.map((account) => {
          // Get real-time balance if available
          const currentBalance = balances[account.id]?.available_balance || account.available_balance;
          const change = parseFloat(currentBalance) - parseFloat(account.available_balance);
          const isPositiveChange = change >= 0;
          
          return (
            <div
              key={account.id}
              className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${
                    account.account_type === 'checking' ? 'bg-blue-500/20 text-blue-400' :
                    account.account_type === 'savings' ? 'bg-emerald-500/20 text-emerald-400' :
                    account.account_type === 'investment' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {getAccountIcon(account.account_type)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} Account
                    </h3>
                    <p className="text-gray-400 text-sm">****{account.account_number?.slice(-4)}</p>
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
                      {showBalances ? formatBalance(currentBalance, account.currency) : '••••••'}
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
                      {isPositiveChange ? '+' : ''}{Math.abs(change).toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({isPositiveChange ? '+' : ''}{formatBalance(Math.abs(change), account.currency)} {account.currency})
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {account.last_transaction_at ? 
                      new Date(account.last_transaction_at).toLocaleDateString() : 
                      'No recent activity'
                    }
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Account Button */}
        <div
          onClick={() => setShowCreateModal(true)}
          className="bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 min-h-[200px]"
        >
          <div className="p-4 bg-cyan-500/20 rounded-full mb-4">
            <Plus className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Add Account</h3>
          <p className="text-gray-400 text-sm text-center">
            Create a new checking, savings, or investment account
          </p>
        </div>
      </div>

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Account</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                <select 
                  value={newAccountData.account_type}
                  onChange={(e) => setNewAccountData(prev => ({ ...prev, account_type: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="investment">Investment Account</option>
                  <option value="crypto">Crypto Wallet</option>
                  <option value="business">Business Account</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select 
                  value={newAccountData.currency}
                  onChange={(e) => setNewAccountData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  {newAccountData.account_type === 'crypto' && (
                    <>
                      <option value="ETH">ETH - Ethereum</option>
                      <option value="BTC">BTC - Bitcoin</option>
                      <option value="USDC">USDC - USD Coin</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Initial Deposit (Optional)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={newAccountData.initial_deposit}
                  onChange={(e) => setNewAccountData(prev => ({ ...prev, initial_deposit: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={creating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all"
              >
                {creating ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
          >
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