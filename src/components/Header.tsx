import React from 'react';
import { Shield, Zap } from 'lucide-react';

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                FinTech Bank
              </h1>
              <p className="text-xs text-gray-500">Secure Banking Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {children}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-full">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}