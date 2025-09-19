/**
 * Sidebar Component - Main Navigation Menu
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Shield, 
  Users, 
  CreditCard, 
  BarChart3, 
  Code, 
  Book,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accounts', label: 'All Accounts', icon: CreditCard },
  { id: 'transactions', label: 'Categories', icon: BarChart3 },
  { id: 'payments', label: 'Payments', icon: Code },
  { id: 'wallet', label: 'Send Money', icon: Shield },
  { id: 'budgets', label: 'Budgets', icon: Users },
  { id: 'bills', label: 'Bills', icon: Book },
  { id: 'biometric', label: 'Biometric', icon: Shield },
  { id: 'fraud', label: 'Fraud Alerts', icon: Book },
  { id: 'analytics', label: 'Analytics', icon: Users },
  { id: 'security', label: 'Security', icon: Book },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-black/20 backdrop-blur-xl border-r border-white/10 p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'api' && (
                <Zap className="w-4 h-4 text-green-400 ml-auto" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-sm font-medium">System Status</span>
          </div>
          <p className="text-green-400 text-xs">All systems operational</p>
          <p className="text-gray-400 text-xs">99.98% uptime</p>
        </div>
      </div>
    </aside>
  );
};