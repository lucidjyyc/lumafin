/**
 * Site Navigation Component with SEO-Optimized Internal Linking
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NavigationLink } from './InternalLink';

interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  children?: NavigationItem[];
  priority: 'high' | 'medium' | 'low';
}

export const SiteNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      description: 'Your financial overview and account summary',
      priority: 'high'
    },
    {
      label: 'Banking',
      href: '/accounts',
      description: 'Traditional and digital banking services',
      priority: 'high',
      children: [
        {
          label: 'Account Management',
          href: '/accounts',
          description: 'Manage your bank accounts and balances',
          priority: 'high'
        },
        {
          label: 'Transaction History',
          href: '/transactions',
          description: 'View and search your transaction history',
          priority: 'high'
        },
        {
          label: 'Payment Processing',
          href: '/payments',
          description: 'Send and receive payments securely',
          priority: 'high'
        },
        {
          label: 'Digital Cards',
          href: '/cards',
          description: 'Manage your virtual and physical cards',
          priority: 'medium'
        }
      ]
    },
    {
      label: 'Web3 & Crypto',
      href: '/wallet',
      description: 'Cryptocurrency and DeFi integration',
      priority: 'high',
      children: [
        {
          label: 'Wallet Connection',
          href: '/wallet',
          description: 'Connect and manage your crypto wallets',
          priority: 'high'
        },
        {
          label: 'DeFi Integration',
          href: '/defi',
          description: 'Access decentralized finance protocols',
          priority: 'medium'
        },
        {
          label: 'Token Management',
          href: '/tokens',
          description: 'Manage your cryptocurrency portfolio',
          priority: 'medium'
        },
        {
          label: 'NFT Gallery',
          href: '/nfts',
          description: 'View and manage your NFT collection',
          priority: 'low'
        }
      ]
    },
    {
      label: 'Analytics',
      href: '/analytics',
      description: 'Financial insights and reporting',
      priority: 'medium',
      children: [
        {
          label: 'Financial Reports',
          href: '/analytics/reports',
          description: 'Detailed financial analysis and reports',
          priority: 'medium'
        },
        {
          label: 'Spending Insights',
          href: '/analytics/spending',
          description: 'Track and analyze your spending patterns',
          priority: 'medium'
        },
        {
          label: 'Investment Performance',
          href: '/analytics/investments',
          description: 'Monitor your investment portfolio performance',
          priority: 'medium'
        }
      ]
    },
    {
      label: 'Security',
      href: '/security',
      description: 'Account security and privacy settings',
      priority: 'high'
    },
    {
      label: 'Support',
      href: '/support',
      description: 'Help center and customer support',
      priority: 'medium',
      children: [
        {
          label: 'Help Center',
          href: '/help',
          description: 'Frequently asked questions and guides',
          priority: 'medium'
        },
        {
          label: 'Contact Support',
          href: '/support/contact',
          description: 'Get help from our support team',
          priority: 'medium'
        },
        {
          label: 'API Documentation',
          href: '/docs',
          description: 'Developer documentation and API reference',
          priority: 'low'
        }
      ]
    }
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="relative" role="navigation" aria-label="Main navigation">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navigationItems.map((item) => (
          <div key={item.label} className="relative group">
            {item.children ? (
              <>
                <button
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors py-2"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  aria-expanded={openDropdown === item.label}
                  aria-haspopup="true"
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown menu */}
                <div
                  className={`absolute top-full left-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl transition-all duration-200 ${
                    openDropdown === item.label 
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible translate-y-2'
                  }`}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  role="menu"
                  aria-label={`${item.label} submenu`}
                >
                  <div className="p-4">
                    <div className="mb-3">
                      <NavigationLink
                        href={item.href}
                        className="text-white font-semibold hover:text-cyan-300"
                      >
                        {item.label} Overview
                      </NavigationLink>
                      <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {item.children.map((child) => (
                        <div key={child.label} role="menuitem">
                          <NavigationLink
                            href={child.href}
                            className="block text-gray-300 hover:text-white font-medium"
                          >
                            {child.label}
                          </NavigationLink>
                          {child.description && (
                            <p className="text-gray-500 text-xs mt-1">{child.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <NavigationLink
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors py-2"
                title={item.description}
              >
                {item.label}
              </NavigationLink>
            )}
          </div>
        ))}
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl transition-all duration-200 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="p-4 space-y-4">
          {navigationItems.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between">
                <NavigationLink
                  href={item.href}
                  className="text-white font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavigationLink>
                
                {item.children && (
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="p-1 text-gray-400 hover:text-white"
                    aria-expanded={openDropdown === item.label}
                  >
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                )}
              </div>
              
              {item.description && (
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
              )}
              
              {item.children && openDropdown === item.label && (
                <div className="ml-4 mt-3 space-y-2 border-l border-white/10 pl-4">
                  {item.children.map((child) => (
                    <div key={child.label}>
                      <NavigationLink
                        href={child.href}
                        className="block text-gray-300 hover:text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.label}
                      </NavigationLink>
                      {child.description && (
                        <p className="text-gray-500 text-xs mt-1">{child.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};