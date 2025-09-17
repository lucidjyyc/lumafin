/**
 * Internal Linking Strategy and Navigation Management
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  description: string;
  keywords: string[];
  priority: 'high' | 'medium' | 'low';
  category: string;
  relatedPages: string[];
  breadcrumbs: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

export interface LinkRecommendation {
  fromPage: string;
  toPage: string;
  anchorText: string;
  context: string;
  priority: number;
}

export class InternalLinkingStrategy {
  private pages: Map<string, NavigationItem> = new Map();
  
  constructor() {
    this.initializePageStructure();
  }

  private initializePageStructure() {
    // Define all pages in the application
    const pageDefinitions: NavigationItem[] = [
      {
        id: 'home',
        title: 'FinTech Bank - Advanced Banking Platform',
        path: '/',
        description: 'Modern banking with Web3 integration',
        keywords: ['banking', 'fintech', 'web3', 'cryptocurrency', 'digital banking'],
        priority: 'high',
        category: 'landing',
        relatedPages: ['dashboard', 'auth-register', 'features'],
        breadcrumbs: [{ label: 'Home', path: '/' }]
      },
      {
        id: 'dashboard',
        title: 'Dashboard - Account Overview',
        path: '/dashboard',
        description: 'Your financial dashboard and account overview',
        keywords: ['dashboard', 'accounts', 'balance', 'overview', 'transactions'],
        priority: 'high',
        category: 'app',
        relatedPages: ['accounts', 'transactions', 'analytics', 'payments'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard', isActive: true }
        ]
      },
      {
        id: 'accounts',
        title: 'Account Management',
        path: '/accounts',
        description: 'Manage your bank accounts and wallets',
        keywords: ['accounts', 'banking', 'wallets', 'crypto', 'management'],
        priority: 'high',
        category: 'app',
        relatedPages: ['dashboard', 'transactions', 'cards', 'settings'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Accounts', path: '/accounts', isActive: true }
        ]
      },
      {
        id: 'transactions',
        title: 'Transaction History',
        path: '/transactions',
        description: 'View and manage your transaction history',
        keywords: ['transactions', 'history', 'payments', 'transfers', 'blockchain'],
        priority: 'high',
        category: 'app',
        relatedPages: ['accounts', 'payments', 'analytics', 'dashboard'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Transactions', path: '/transactions', isActive: true }
        ]
      },
      {
        id: 'payments',
        title: 'Payment Processing',
        path: '/payments',
        description: 'Send and receive payments securely',
        keywords: ['payments', 'send money', 'receive', 'transfer', 'crypto payments'],
        priority: 'high',
        category: 'app',
        relatedPages: ['accounts', 'transactions', 'cards', 'security'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Payments', path: '/payments', isActive: true }
        ]
      },
      {
        id: 'wallet',
        title: 'Web3 Wallet Integration',
        path: '/wallet',
        description: 'Connect and manage your cryptocurrency wallets',
        keywords: ['wallet', 'web3', 'cryptocurrency', 'metamask', 'defi'],
        priority: 'high',
        category: 'app',
        relatedPages: ['accounts', 'transactions', 'defi', 'security'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Wallet', path: '/wallet', isActive: true }
        ]
      },
      {
        id: 'analytics',
        title: 'Financial Analytics',
        path: '/analytics',
        description: 'Advanced financial insights and reporting',
        keywords: ['analytics', 'reports', 'insights', 'financial data', 'charts'],
        priority: 'medium',
        category: 'app',
        relatedPages: ['dashboard', 'transactions', 'accounts', 'settings'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics', isActive: true }
        ]
      },
      {
        id: 'security',
        title: 'Security Center',
        path: '/security',
        description: 'Manage your account security and privacy settings',
        keywords: ['security', 'privacy', '2fa', 'authentication', 'protection'],
        priority: 'high',
        category: 'app',
        relatedPages: ['settings', 'accounts', 'auth-login', 'profile'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Security', path: '/security', isActive: true }
        ]
      },
      {
        id: 'settings',
        title: 'Account Settings',
        path: '/settings',
        description: 'Customize your account preferences and settings',
        keywords: ['settings', 'preferences', 'profile', 'notifications', 'customization'],
        priority: 'medium',
        category: 'app',
        relatedPages: ['profile', 'security', 'notifications', 'billing'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Settings', path: '/settings', isActive: true }
        ]
      },
      {
        id: 'auth-login',
        title: 'Sign In to Your Account',
        path: '/auth/login',
        description: 'Secure login to your FinTech Bank account',
        keywords: ['login', 'sign in', 'authentication', 'access account'],
        priority: 'high',
        category: 'auth',
        relatedPages: ['auth-register', 'auth-forgot-password', 'dashboard'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Sign In', path: '/auth/login', isActive: true }
        ]
      },
      {
        id: 'auth-register',
        title: 'Create Your Account',
        path: '/auth/register',
        description: 'Join FinTech Bank and start your digital banking journey',
        keywords: ['register', 'sign up', 'create account', 'join', 'new user'],
        priority: 'high',
        category: 'auth',
        relatedPages: ['auth-login', 'features', 'pricing', 'dashboard'],
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: 'Create Account', path: '/auth/register', isActive: true }
        ]
      }
    ];

    pageDefinitions.forEach(page => {
      this.pages.set(page.id, page);
    });
  }

  // Generate link recommendations based on page relationships
  generateLinkRecommendations(currentPageId: string): LinkRecommendation[] {
    const currentPage = this.pages.get(currentPageId);
    if (!currentPage) return [];

    const recommendations: LinkRecommendation[] = [];

    // Related pages (high priority)
    currentPage.relatedPages.forEach(relatedPageId => {
      const relatedPage = this.pages.get(relatedPageId);
      if (relatedPage) {
        recommendations.push({
          fromPage: currentPageId,
          toPage: relatedPageId,
          anchorText: this.generateAnchorText(relatedPage, 'primary'),
          context: 'related-content',
          priority: 9
        });
      }
    });

    // Category-based recommendations (medium priority)
    this.pages.forEach((page, pageId) => {
      if (pageId !== currentPageId && 
          page.category === currentPage.category && 
          !currentPage.relatedPages.includes(pageId)) {
        recommendations.push({
          fromPage: currentPageId,
          toPage: pageId,
          anchorText: this.generateAnchorText(page, 'secondary'),
          context: 'category-navigation',
          priority: 6
        });
      }
    });

    // Keyword-based recommendations (lower priority)
    this.pages.forEach((page, pageId) => {
      if (pageId !== currentPageId) {
        const commonKeywords = currentPage.keywords.filter(keyword =>
          page.keywords.includes(keyword)
        );
        
        if (commonKeywords.length > 0) {
          recommendations.push({
            fromPage: currentPageId,
            toPage: pageId,
            anchorText: this.generateAnchorText(page, 'contextual'),
            context: `keyword-match: ${commonKeywords.join(', ')}`,
            priority: 3
          });
        }
      }
    });

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // Generate varied anchor text for natural linking
  generateAnchorText(page: NavigationItem, type: 'primary' | 'secondary' | 'contextual'): string {
    const variations = {
      primary: [page.title, page.title.split(' - ')[0]],
      secondary: [
        page.description,
        `${page.title.split(' ')[0]} section`,
        `your ${page.title.toLowerCase()}`
      ],
      contextual: [
        ...page.keywords.slice(0, 2),
        `${page.category} features`,
        page.title.split(' ').slice(-2).join(' ')
      ]
    };

    const options = variations[type].filter(text => text && text.length > 0);
    return options[Math.floor(Math.random() * options.length)] || page.title;
  }

  // Get page information
  getPage(pageId: string): NavigationItem | undefined {
    return this.pages.get(pageId);
  }

  // Get all pages
  getAllPages(): NavigationItem[] {
    return Array.from(this.pages.values());
  }

  // Get pages by category
  getPagesByCategory(category: string): NavigationItem[] {
    return Array.from(this.pages.values()).filter(page => page.category === category);
  }
}

export const linkingStrategy = new InternalLinkingStrategy();