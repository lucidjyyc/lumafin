/**
 * Bill Tracking Component - Upcoming Due Dates & One-Tap Pay
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Plus,
  CreditCard,
  Home,
  Wifi,
  Car,
  Phone,
  Lightbulb,
  DollarSign
} from 'lucide-react';

interface Bill {
  id: string;
  name: string;
  company: string;
  amount: number;
  dueDate: string;
  status: 'upcoming' | 'due_soon' | 'overdue' | 'paid';
  category: string;
  isAutoPay: boolean;
  icon: React.ComponentType<any>;
  color: string;
  accountId: string;
}

export const BillTracking: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      name: 'Electric Bill',
      company: 'City Power & Light',
      amount: 127.45,
      dueDate: '2024-01-25',
      status: 'due_soon',
      category: 'Utilities',
      isAutoPay: false,
      icon: Lightbulb,
      color: 'yellow',
      accountId: 'acc_1234567890'
    },
    {
      id: '2',
      name: 'Internet Service',
      company: 'FastNet ISP',
      amount: 89.99,
      dueDate: '2024-01-28',
      status: 'upcoming',
      category: 'Utilities',
      isAutoPay: true,
      icon: Wifi,
      color: 'blue',
      accountId: 'acc_1234567890'
    },
    {
      id: '3',
      name: 'Car Insurance',
      company: 'SafeDrive Insurance',
      amount: 156.78,
      dueDate: '2024-01-22',
      status: 'due_soon',
      category: 'Insurance',
      isAutoPay: false,
      icon: Car,
      color: 'emerald',
      accountId: 'acc_1234567890'
    },
    {
      id: '4',
      name: 'Phone Bill',
      company: 'MobileConnect',
      amount: 65.00,
      dueDate: '2024-02-01',
      status: 'upcoming',
      category: 'Utilities',
      isAutoPay: true,
      icon: Phone,
      color: 'purple',
      accountId: 'acc_1234567890'
    },
    {
      id: '5',
      name: 'Rent Payment',
      company: 'Downtown Apartments',
      amount: 1850.00,
      dueDate: '2024-01-21',
      status: 'due_soon',
      category: 'Housing',
      isAutoPay: false,
      icon: Home,
      color: 'orange',
      accountId: 'acc_1234567890'
    }
  ]);

  const handlePayBill = async (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'paid' as const }
        : bill
    ));
    
    // Simulate payment processing
    console.log(`Processing payment for bill ${billId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'upcoming': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'due_soon': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingBills = bills.filter(bill => bill.status !== 'paid');
  const totalUpcoming = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bill Tracking</h1>
          <p className="text-gray-400">Never miss a payment with smart reminders</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Bill</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Upcoming Bills</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">{upcomingBills.length}</p>
          <p className="text-cyan-400 text-sm">Next 30 days</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Total Due</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">${totalUpcoming.toFixed(2)}</p>
          <p className="text-emerald-400 text-sm">This month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AutoPay Active</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            {bills.filter(b => b.isAutoPay).length}
          </p>
          <p className="text-purple-400 text-sm">Bills automated</p>
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Your Bills</h3>
        
        <div className="space-y-4">
          {bills.map((bill) => {
            const Icon = bill.icon;
            const daysUntilDue = getDaysUntilDue(bill.dueDate);
            const isUrgent = daysUntilDue <= 3 && bill.status !== 'paid';
            
            return (
              <div
                key={bill.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isUrgent 
                    ? 'bg-yellow-500/10 border-yellow-500/30' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-${bill.color}-500/20`}>
                      <Icon className={`w-6 h-6 text-${bill.color}-400`} />
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold">{bill.name}</h4>
                      <p className="text-gray-400 text-sm">{bill.company}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(bill.status)}`}>
                          {bill.status.replace('_', ' ')}
                        </span>
                        {bill.isAutoPay && (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                            AutoPay
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${bill.amount.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">
                      Due {new Date(bill.dueDate).toLocaleDateString()}
                    </p>
                    <p className={`text-xs mt-1 ${
                      daysUntilDue <= 0 ? 'text-red-400' :
                      daysUntilDue <= 3 ? 'text-yellow-400' :
                      'text-gray-400'
                    }`}>
                      {daysUntilDue <= 0 ? 'Overdue' :
                       daysUntilDue === 1 ? 'Due tomorrow' :
                       `${daysUntilDue} days left`}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    {bill.status !== 'paid' && !bill.isAutoPay && (
                      <button
                        onClick={() => handlePayBill(bill.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm font-medium"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Pay Now</span>
                      </button>
                    )}
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
                      <CreditCard className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};