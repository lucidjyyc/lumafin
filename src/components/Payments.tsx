/**
 * Payments Component - Transaction Processing and Payment Analytics
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  customer: string;
  method: string;
  timestamp: string;
  fee: number;
}

export const Payments: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [transactions] = useState<Transaction[]>([
    { id: 'tx_1234567890', amount: 1299.99, currency: 'USD', status: 'completed', customer: 'john@example.com', method: 'Visa ****1234', timestamp: '2024-01-20 14:30:25', fee: 38.99 },
    { id: 'tx_0987654321', amount: 2459.00, currency: 'USD', status: 'pending', customer: 'sarah@company.com', method: 'Mastercard ****5678', timestamp: '2024-01-20 14:25:10', fee: 73.77 },
    { id: 'tx_1122334455', amount: 599.99, currency: 'USD', status: 'failed', customer: 'mike@startup.io', method: 'Visa ****9012', timestamp: '2024-01-20 14:20:45', fee: 0 },
    { id: 'tx_5566778899', amount: 3299.99, currency: 'USD', status: 'completed', customer: 'enterprise@corp.com', method: 'American Express ****3456', timestamp: '2024-01-20 14:15:30', fee: 98.99 },
    { id: 'tx_9988776655', amount: 149.99, currency: 'USD', status: 'completed', customer: 'user@domain.com', method: 'PayPal', timestamp: '2024-01-20 14:10:15', fee: 4.49 },
  ]);

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' || tx.status === filter
  );

  const totalRevenue = transactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalFees = transactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.fee, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payments</h1>
          <p className="text-gray-400">Monitor transactions and payment analytics</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">${totalRevenue.toLocaleString()}</p>
          <p className="text-green-400 text-sm">+12.5% from last month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CreditCard className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Transactions</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">{transactions.length}</p>
          <p className="text-blue-400 text-sm">Today</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Success Rate</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {((transactions.filter(tx => tx.status === 'completed').length / transactions.length) * 100).toFixed(1)}%
          </p>
          <p className="text-purple-400 text-sm">Last 24 hours</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Processing Fees</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">${totalFees.toFixed(2)}</p>
          <p className="text-orange-400 text-sm">2.9% average rate</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
          <div className="flex space-x-2">
            {['all', 'completed', 'pending', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Transaction ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Method</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <code className="text-cyan-400 text-sm">{transaction.id}</code>
                  </td>
                  <td className="py-3 px-4 text-white">{transaction.customer}</td>
                  <td className="py-3 px-4">
                    <span className="text-white font-medium">
                      ${transaction.amount.toLocaleString()} {transaction.currency}
                    </span>
                    {transaction.fee > 0 && (
                      <div className="text-xs text-gray-400">Fee: ${transaction.fee}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{transaction.method}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{transaction.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Payment Methods</h3>
          <div className="space-y-4">
            {[
              { method: 'Credit Cards', percentage: 65.2, amount: '$1,856,420' },
              { method: 'PayPal', percentage: 18.7, amount: '$532,890' },
              { method: 'Bank Transfer', percentage: 12.3, amount: '$350,120' },
              { method: 'Apple Pay', percentage: 2.9, amount: '$82,450' },
              { method: 'Google Pay', percentage: 0.9, amount: '$25,670' },
            ].map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{method.method}</span>
                  <div className="text-right">
                    <p className="text-white text-sm">{method.percentage}%</p>
                    <p className="text-gray-400 text-xs">{method.amount}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Transaction Volume</h3>
          <div className="h-48 flex items-end space-x-2">
            {[120, 85, 165, 145, 200, 175, 190, 220, 185, 245, 210, 280].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t transition-all duration-300 hover:from-cyan-400 hover:to-blue-500"
                  style={{ height: `${height}px` }}
                />
                <span className="text-xs text-gray-400 mt-1">
                  {(new Date().getHours() - 11 + index) % 24}:00
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};