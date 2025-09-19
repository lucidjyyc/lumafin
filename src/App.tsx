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
import { AccountAggregation } from './components/AccountAggregation';
import { TransactionCategorization } from './components/TransactionCategorization';
import { BudgetingAlerts } from './components/BudgetingAlerts';
import { BillTracking } from './components/BillTracking';
import { P2PTransfers } from './components/P2PTransfers';
import { BiometricAuth } from './components/BiometricAuth';
import { FraudAlerts } from './components/FraudAlerts';
import { VirtualCards } from './components/VirtualCards';
import { AIFinancialAdvisor } from './components/AIFinancialAdvisor';
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
      case 'accounts': return <AccountAggregation />;
      case 'transactions': return <TransactionCategorization />;
      case 'payments': return <Payments />;
      case 'wallet': return <P2PTransfers />;
      case 'analytics': return <Analytics />;
      case 'security': return <Security />;
      case 'settings': return <Settings />;
      case 'budgets': return <BudgetingAlerts />;
      case 'bills': return <BillTracking />;
      case 'biometric': return <BiometricAuth />;
      case 'fraud': return <FraudAlerts />;
      case 'virtual-cards': return <VirtualCards />;
      case 'ai-advisor': return <AIFinancialAdvisor />;
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
      accounts: 'Account Aggregation - All Accounts in One Place',
      transactions: 'Transaction Categorization - Smart Spending Insights',
      budgets: 'Budget Management - Spending Caps & Alerts',
      bills: 'Bill Tracking - Never Miss a Payment',
      wallet: 'P2P Transfers - Send Money Instantly',
      biometric: 'Biometric Authentication - Passwordless Security',
      fraud: 'Fraud Protection - AI-Powered Security',
      'virtual-cards': 'Virtual Card Numbers - Secure Online Shopping',
      'ai-advisor': 'AI Financial Advisor - Intelligent Financial Guidance',
      analytics: 'Financial Analytics - Insights & Reports',
      payments: 'Payment Processing - Send & Receive Money',
      security: 'Security Center - Account Protection',
      settings: 'Account Settings - Preferences & Configuration'
    };
    return titles[tab] || 'FinTech Bank Platform';
  }

  function getPageDescription(tab: string): string {
    const descriptions: Record<string, string> = {
      dashboard: 'Monitor your financial overview, account balances, and recent activity',
      accounts: 'View all your accounts in one clean interface with real-time balances',
      transactions: 'AI-powered transaction categorization and spending analysis',
      budgets: 'Set spending limits and receive intelligent budget alerts',
      bills: 'Track upcoming bills and pay with one tap for convenience',
      wallet: 'Send money instantly to friends and family with P2P transfers',
      biometric: 'Secure passwordless authentication using Face ID and fingerprint',
      fraud: 'Advanced fraud detection with real-time security alerts',
      'virtual-cards': 'Generate secure virtual card numbers for safe online shopping with spending controls',
      'ai-advisor': 'Get personalized financial advice and intelligent recommendations from your AI advisor',
      analytics: 'Gain insights into your financial data with advanced analytics and reporting',
      payments: 'Process payments, transfers, and manage your payment methods securely',
      security: 'Manage account security, enable two-factor authentication, and monitor threats',
      settings: 'Customize your account preferences, notifications, and platform settings'
    };
    return descriptions[tab] || 'Advanced fintech banking platform with Web3 integration';
  }

  function getPageKeywords(tab: string): string[] {
    const keywords: Record<string, string[]> = {
      dashboard: ['dashboard', 'overview', 'accounts', 'balance', 'financial summary'],
      accounts: ['accounts', 'aggregation', 'balance', 'banking', 'overview'],
      transactions: ['transactions', 'categorization', 'spending', 'analysis', 'AI'],
      budgets: ['budget', 'spending limits', 'alerts', 'financial planning'],
      bills: ['bills', 'payments', 'due dates', 'autopay', 'reminders'],
      wallet: ['P2P', 'transfers', 'send money', 'instant payments', 'friends'],
      biometric: ['biometric', 'face ID', 'fingerprint', 'passwordless', 'security'],
      fraud: ['fraud detection', 'security alerts', 'protection', 'AI monitoring'],
      'virtual-cards': ['virtual cards', 'online security', 'temporary cards', 'spending limits', 'privacy'],
      'ai-advisor': ['AI advisor', 'financial guidance', 'personalized advice', 'smart recommendations'],
      analytics: ['analytics', 'reports', 'insights', 'financial data', 'charts'],
      payments: ['payments', 'transfers', 'send money', 'payment processing'],
      security: ['security', 'protection', 'authentication', '2fa', 'privacy'],
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