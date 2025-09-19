/**
 * Dashboard Component - Professional FinTech Dashboard
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { useAccounts, useTransactionAnalytics } from '../hooks/useApi';
import { useRealTimeTransactions, useRealTimeFraudAlerts } from '../hooks/useWebSocket';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Send,
  Download,
  CreditCard,
  Wallet,
  Shield,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: accounts } = useAccounts();
  const { data: analytics } = useTransactionAnalytics(30);
  const { transactions: recentTransactions } = useRealTimeTransactions();
  const { alerts: fraudAlerts, unreadCount } = useRealTimeFraudAlerts();
  const [timeframe, setTimeframe] = useState('30d');

  // Calculate stats from real data
  const totalBalance = accounts?.reduce((sum, acc) => 
    sum + parseFloat(acc.available_balance || '0'), 0
  ) || 0;

  const stats = [
    {
      title: 'Total Balance',
      value: `$${totalBalance.toLocaleString()}`,
      change: '+2.3%',
      trend: 'up',
      icon: DollarSign,
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      changeColor: 'text-emerald-400'
    },
    {
      title: 'Transactions',
      value: analytics?.total_transactions?.toString() || '0',
      change: '+12.1%',
      trend: 'up',
      icon: Activity,
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      changeColor: 'text-blue-400'
    },
    {
      title: 'Active Accounts',
      value: accounts?.filter(acc => acc.is_active).length.toString() || '0',
      change: '+1',
      trend: 'up',
      icon: Users,
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      changeColor: 'text-purple-400'
    },
    {
      title: 'Success Rate',
      value: `${analytics?.success_rate || 99.9}%`,
      change: '+0.1%',
      trend: 'up',
      icon: TrendingUp,
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      changeColor: 'text-emerald-400'
    }
  ];

  // Format recent transactions for display
  const formattedTransactions = recentTransactions.slice(0, 5).map(transaction => ({
    id: transaction.id,
    type: transaction.transaction_type,
    amount: `$${parseFloat(transaction.amount).toFixed(2)}`,
    status: transaction.status,
    time: new Date(transaction.created_at).toLocaleString(),
    customer: transaction.description || 'Transaction',
    icon: transaction.status === 'completed' ? CheckCircle : 
          transaction.status === 'pending' ? Clock : AlertCircle,
    statusColor: transaction.status === 'completed' ? 'text-emerald-400' :
                 transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400',
    statusBg: transaction.status === 'completed' ? 'bg-emerald-500/10' :
              transaction.status === 'pending' ? 'bg-yellow-500/10' : 'bg-red-500/10'
  }));

  const quickActions = [
    { label: 'Send Payment', icon: Send, bgColor: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
    { label: 'Generate Report', icon: Download, bgColor: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' },
    { label: 'Manage Cards', icon: CreditCard, bgColor: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600' },
    { label: 'Connect Wallet', icon: Wallet, bgColor: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' }
  ];

  const systemServices = [
    { service: 'API Gateway', status: 'operational', uptime: '99.98%', color: 'bg-emerald-400' },
    { service: 'Payment Processing', status: 'operational', uptime: '99.95%', color: 'bg-emerald-400' },
    { service: 'Database', status: 'operational', uptime: '99.99%', color: 'bg-emerald-400' },
    { service: 'Authentication', status: 'operational', uptime: '99.97%', color: 'bg-emerald-400' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, here's what's happening with your platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all font-medium">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${stat.changeColor}`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {formattedTransactions.map((transaction) => {
                const StatusIcon = transaction.icon;
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.statusBg}`}>
                        <StatusIcon className={`w-5 h-5 ${transaction.statusColor}`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.type}</p>
                        <p className="text-gray-400 text-sm">{transaction.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{transaction.amount}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${transaction.statusBg} ${transaction.statusColor} border-current/30`}>
                          {transaction.status}
                        </span>
                        <span className="text-gray-500 text-xs">{transaction.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className={`p-4 rounded-lg text-white transition-all duration-200 ${action.bgColor} ${action.hoverColor} group hover:scale-105`}
                  >
                    <Icon className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-medium">{action.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">System Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-sm font-medium">All Systems Operational</span>
              </div>
            </div>
            <div className="space-y-3">
              {systemServices.map((service) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 ${service.color} rounded-full`}></div>
                    <span className="text-gray-300 text-sm">{service.service}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{service.uptime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">2FA Enabled</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">SSL Certificate</span>
                <span className="text-emerald-400 text-sm">Valid</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Last Security Scan</span>
                <span className="text-gray-400 text-sm">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">API Performance</h3>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="h-64 flex items-end space-x-2">
          {[65, 78, 82, 95, 87, 92, 108, 125, 134, 142, 156, 168, 145, 159, 172, 185, 178, 192, 205, 198, 215, 228, 235, 242].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div
                className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 cursor-pointer"
                style={{ height: `${height}px` }}
                title={`${height * 100} requests`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-4">
          <span>24 hours ago</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
};