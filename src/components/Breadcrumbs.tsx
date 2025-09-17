/**
 * Breadcrumbs Navigation Component
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../lib/navigation/linkingStrategy';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
  separator?: React.ReactNode;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHomeIcon = true,
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li 
            key={item.path}
            className="flex items-center space-x-2"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <span className="flex-shrink-0" aria-hidden="true">
                {separator}
              </span>
            )}
            
            {item.isActive ? (
              <span 
                className="text-cyan-300 font-medium"
                itemProp="name"
                aria-current="page"
              >
                {index === 0 && showHomeIcon && (
                  <Home className="w-4 h-4 inline mr-1" aria-hidden="true" />
                )}
                {item.label}
              </span>
            ) : (
              <a
                href={item.path}
                className="text-gray-300 hover:text-white transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
                itemProp="item"
                rel="nofollow"
              >
                <span itemProp="name">
                  {index === 0 && showHomeIcon && (
                    <Home className="w-4 h-4 inline mr-1" aria-hidden="true" />
                  )}
                  {item.label}
                </span>
              </a>
            )}
            
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Hook for generating breadcrumbs based on current route
export const useBreadcrumbs = (currentPath: string): BreadcrumbItem[] => {
  const pathSegments = currentPath.split('/').filter(segment => segment);
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  let currentRoute = '';
  pathSegments.forEach((segment, index) => {
    currentRoute += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Map route segments to user-friendly labels
    const label = getRouteLabel(segment, currentRoute);
    
    breadcrumbs.push({
      label,
      path: currentRoute,
      isActive: isLast
    });
  });

  return breadcrumbs;
};

// Map route segments to user-friendly labels
const getRouteLabel = (segment: string, fullPath: string): string => {
  const routeLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'accounts': 'Accounts',
    'transactions': 'Transactions',
    'payments': 'Payments',
    'wallet': 'Wallet',
    'analytics': 'Analytics',
    'security': 'Security',
    'settings': 'Settings',
    'auth': 'Authentication',
    'login': 'Sign In',
    'register': 'Create Account',
    'forgot-password': 'Reset Password',
    'profile': 'Profile',
    'notifications': 'Notifications',
    'billing': 'Billing',
    'api': 'API Management',
    'developer': 'Developer Portal',
    'help': 'Help Center',
    'support': 'Support',
    'docs': 'Documentation'
  };

  return routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};