/**
 * Header Component - Navigation and User Controls
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React from 'react';
import { Bell, Settings, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NavigationLink } from './InternalLink';

export const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <NavigationLink 
          href="/dashboard" 
          className="text-2xl font-bold text-white hover:text-cyan-300 transition-colors"
          priority="high"
          context="header-logo"
          aria-label="Go to dashboard"
        >
          FinTech Pro
        </NavigationLink>
        <div className="h-6 w-px bg-white/20" />
        {children}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search APIs, users, transactions..."
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-80"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <NavigationLink
          href="/notifications"
          className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          priority="medium"
          context="header-notifications"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </NavigationLink>

        <div className="flex items-center space-x-3 px-3 py-2 bg-white/10 rounded-lg">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="text-sm">
            <NavigationLink 
              href="/profile" 
              className="text-white font-medium hover:text-cyan-300 transition-colors"
              priority="medium"
              context="header-profile"
            >
              {user?.name}
            </NavigationLink>
            <p className="text-gray-400">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};