/**
 * Budgeting & Alerts Component - Spending Caps & Notifications
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { 
  Target, 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly';
  alertThreshold: number;
  isActive: boolean;
  color: string;
}

interface Alert {
  id: string;
  type: 'budget_warning' | 'budget_exceeded' | 'unusual_spending' | 'low_balance';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: 'low' | 'medium' | 'high';
}

export const BudgetingAlerts: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      category: 'Food & Dining',
      limit: 800,
      spent: 456.78,
      period: 'monthly',
      alertThreshold: 80,
      isActive: true,
      color: 'emerald'
    },
    {
      id: '2',
      category: 'Transportation',
      limit: 300,
      spent: 289.45,
      period: 'monthly',
      alertThreshold: 90,
      isActive: true,
      color: 'blue'
    },
    {
      id: '3',
      category: 'Entertainment',
      limit: 200,
      spent: 156.89,
      period: 'monthly',
      alertThreshold: 75,
      isActive: true,
      color: 'purple'
    },
    {
      id: '4',
      category: 'Shopping',
      limit: 500,
      spent: 634.23,
      period: 'monthly',
      alertThreshold: 85,
      isActive: true,
      color: 'orange'
    }
  ]);

  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'budget_exceeded',
      title: 'Shopping Budget Exceeded',
      message: 'You\'ve spent $634.23 of your $500 shopping budget this month',
      timestamp: '2 hours ago',
      isRead: false,
      severity: 'high'
    },
    {
      id: '2',
      type: 'budget_warning',
      title: 'Transportation Budget Warning',
      message: 'You\'re at 96% of your transportation budget ($289/$300)',
      timestamp: '1 day ago',
      isRead: false,
      severity: 'medium'
    },
    {
      id: '3',
      type: 'unusual_spending',
      title: 'Unusual Spending Pattern',
      message: 'Your dining spending is 40% higher than usual this week',
      timestamp: '2 days ago',
      isRead: true,
      severity: 'low'
    }
  ]);

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    
    if (percentage >= 100) return { status: 'exceeded', color: 'red' };
    if (percentage >= budget.alertThreshold) return { status: 'warning', color: 'yellow' };
    return { status: 'good', color: 'emerald' };
  };

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'high') return <AlertTriangle className="w-5 h-5 text-red-400" />;
    if (severity === 'medium') return <Bell className="w-5 h-5 text-yellow-400" />;
    return <CheckCircle className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Budget Management</h1>
          <p className="text-gray-400">Set spending limits and receive smart alerts</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
          <Plus className="w-4 h-4" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {budgets.map((budget) => {
          const status = getBudgetStatus(budget);
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          
          return (
            <div key={budget.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${budget.color}-500/20`}>
                  <Target className={`w-5 h-5 text-${budget.color}-400`} />
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-white font-semibold mb-2">{budget.category}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Spent</span>
                  <span className="text-white font-medium">${budget.spent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Budget</span>
                  <span className="text-gray-300">${budget.limit.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium text-${status.color}-400`}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${status.color}-500/20 text-${status.color}-300`}>
                    {status.status}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r from-${status.color}-500 to-${status.color}-600 transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts Section */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Smart Alerts</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm">{alerts.filter(a => !a.isRead).length} unread</span>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                alert.isRead 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  alert.severity === 'high' ? 'bg-red-500/20' :
                  alert.severity === 'medium' ? 'bg-yellow-500/20' :
                  'bg-blue-500/20'
                }`}>
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${alert.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {alert.title}
                    </h4>
                    <span className="text-gray-500 text-xs">{alert.timestamp}</span>
                  </div>
                  <p className={`text-sm ${alert.isRead ? 'text-gray-400' : 'text-gray-300'}`}>
                    {alert.message}
                  </p>
                </div>

                {!alert.isRead && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Spending Trends</h3>
          <div className="h-48 flex items-end space-x-2">
            {[320, 280, 450, 380, 520, 480, 590, 540, 620, 580, 680, 640, 720, 690].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t transition-all duration-300 hover:from-cyan-400 hover:to-blue-500"
                  style={{ height: `${height / 10}px` }}
                />
                <span className="text-xs text-gray-400 mt-1">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Budget Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Great Job!</span>
              </div>
              <p className="text-emerald-200 text-sm">You're staying within your food budget this month</p>
            </div>
            
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 font-medium">Consider Adjusting</span>
              </div>
              <p className="text-yellow-200 text-sm">Your shopping budget might be too low based on recent patterns</p>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">Opportunity</span>
              </div>
              <p className="text-blue-200 text-sm">You could save $150/month by reducing entertainment spending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};