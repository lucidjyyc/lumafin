/**
 * Main Application Component - FinTech Banking Platform
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @created 2024-01-20
 */
import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from './components/Breadcrumbs';
import { RelatedLinks } from './components/RelatedLinks';
import { SiteNavigation } from './components/SiteNavigation';
import { Footer } from './components/Footer';
import { SEOOptimizedContent } from './components/SEOOptimizedContent';
import { useInternalLinking } from './hooks/useInternalLinking';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ApiManagement } from './components/ApiManagement';
import { Analytics } from './components/Analytics';
import { Payments } from './components/Payments';
import { Users } from './components/Users';
import { Security } from './components/Security';
import { Settings } from './components/Settings';
import { DeveloperPortal } from './components/DeveloperPortal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { AccessibleLayout } from './components/layout/AccessibleLayout';
import { useRouteFocus } from './hooks/useFocusManagement';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAuthenticated } = useAuth();
  const { breadcrumbs } = useInternalLinking({
    currentPageId: activeTab,
    maxRecommendations: 6,
    includeContextual: true,
    trackClicks: true
  });

  // Handle route focus management
  useRouteFocus(`/${activeTab}`);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'accounts': return <div className="text-white">Accounts Management</div>;
      case 'transactions': return <div className="text-white">Transaction History</div>;
      case 'payments': return <Payments />;
      case 'wallet': return <div className="text-white">Wallet Integration</div>;
      case 'analytics': return <Analytics />;
      case 'security': return <Security />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <AccessibleLayout
      currentRoute={`/${activeTab}`}
      header={
        <Header>
          <SiteNavigation />
        </Header>
      }
      sidebar={<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
      footer={<Footer />}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.1),transparent_50%)] pointer-events-none" />
      {breadcrumbs.length > 1 && (
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
      )}
      <SEOOptimizedContent
        pageId={activeTab}
        title={getPageTitle(activeTab)}
        description={getPageDescription(activeTab)}
        keywords={getPageKeywords(activeTab)}
        showBreadcrumbs={false}
        showRelatedLinks={true}
        showContextualLinks={true}
      >
        {renderContent()}
      </SEOOptimizedContent>
    </AccessibleLayout>
  );

  function getPageTitle(tab: string): string {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard - Account Overview',
      api: 'API Management - Developer Tools',
      analytics: 'Financial Analytics - Insights & Reports',
      payments: 'Payment Processing - Send & Receive Money',
      users: 'User Management - Account Administration',
      security: 'Security Center - Account Protection',
      developer: 'Developer Portal - API Documentation',
      settings: 'Account Settings - Preferences & Configuration'
    };
    return titles[tab] || 'FinTech Bank Platform';
  }

  function getPageDescription(tab: string): string {
    const descriptions: Record<string, string> = {
      dashboard: 'Monitor your financial overview, account balances, and recent activity',
      api: 'Manage API keys, monitor usage, and access developer tools',
      analytics: 'Gain insights into your financial data with advanced analytics and reporting',
      payments: 'Process payments, transfers, and manage your payment methods securely',
      users: 'Administer user accounts, roles, and permissions across your platform',
      security: 'Manage account security, enable two-factor authentication, and monitor threats',
      developer: 'Access API documentation, code examples, and developer resources',
      settings: 'Customize your account preferences, notifications, and platform settings'
    };
    return descriptions[tab] || 'Advanced fintech banking platform with Web3 integration';
  }

  function getPageKeywords(tab: string): string[] {
    const keywords: Record<string, string[]> = {
      dashboard: ['dashboard', 'overview', 'accounts', 'balance', 'financial summary'],
      api: ['api', 'developer', 'integration', 'endpoints', 'documentation'],
      analytics: ['analytics', 'reports', 'insights', 'financial data', 'charts'],
      payments: ['payments', 'transfers', 'send money', 'payment processing'],
      users: ['users', 'management', 'administration', 'accounts', 'permissions'],
      security: ['security', 'protection', 'authentication', '2fa', 'privacy'],
      developer: ['developer', 'api', 'documentation', 'integration', 'code'],
      settings: ['settings', 'preferences', 'configuration', 'customization']
    };
    return keywords[tab] || ['fintech', 'banking', 'platform'];
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;