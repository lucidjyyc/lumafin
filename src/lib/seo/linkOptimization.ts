/**
 * SEO Link Optimization and Internal Linking Best Practices
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

export interface LinkAttributes {
  href: string;
  rel?: string;
  target?: string;
  title?: string;
  'aria-label'?: string;
  'data-priority'?: string;
  'data-context'?: string;
}

export interface SEOLinkConfig {
  url: string;
  anchorText: string;
  context: string;
  priority: number;
  attributes: LinkAttributes;
}

export class LinkOptimizer {
  private readonly INTERNAL_DOMAINS = [
    'fintechbank.com',
    'api.fintechbank.com',
    'docs.fintechbank.com',
    'localhost'
  ];

  // Generate optimal link attributes based on URL and context
  generateLinkAttributes(
    href: string, 
    context: string = 'content',
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): LinkAttributes {
    const attributes: LinkAttributes = { href };
    
    const isExternal = this.isExternalLink(href);
    const isDownload = this.isDownloadLink(href);
    const isSecure = href.startsWith('https://');

    // Set rel attributes
    const relAttributes: string[] = [];
    
    if (isExternal) {
      relAttributes.push('noopener');
      if (href.includes('affiliate') || href.includes('partner')) {
        relAttributes.push('sponsored');
      }
      if (!isSecure || this.isUntrustedDomain(href)) {
        relAttributes.push('noreferrer');
      }
    }
    
    if (isDownload) {
      relAttributes.push('nofollow');
    }
    
    // Add nofollow for low priority internal links
    if (!isExternal && priority === 'low' && context === 'footer') {
      relAttributes.push('nofollow');
    }

    if (relAttributes.length > 0) {
      attributes.rel = relAttributes.join(' ');
    }

    // Set target for external links
    if (isExternal) {
      attributes.target = '_blank';
    }

    // Add data attributes for tracking
    attributes['data-priority'] = priority;
    attributes['data-context'] = context;

    return attributes;
  }

  // Check if URL is external
  private isExternalLink(href: string): boolean {
    if (href.startsWith('/') || href.startsWith('#')) return false;
    
    try {
      const url = new URL(href);
      return !this.INTERNAL_DOMAINS.some(domain => 
        url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }

  // Check if URL is a download link
  private isDownloadLink(href: string): boolean {
    const downloadExtensions = ['.pdf', '.zip', '.doc', '.docx', '.xls', '.xlsx', '.csv'];
    return downloadExtensions.some(ext => href.toLowerCase().includes(ext)) ||
           href.includes('/download/') ||
           href.includes('download=true');
  }

  // Check if domain is untrusted
  private isUntrustedDomain(href: string): boolean {
    const untrustedPatterns = [
      'bit.ly',
      'tinyurl.com',
      'short.link',
      'suspicious-domain.com'
    ];
    
    return untrustedPatterns.some(pattern => href.includes(pattern));
  }

  // Generate anchor text variations for natural linking
  generateAnchorTextVariations(targetPage: string, baseText: string): string[] {
    const variations: string[] = [baseText];
    
    const pageVariations: Record<string, string[]> = {
      'dashboard': [
        'your dashboard',
        'account dashboard',
        'financial overview',
        'account summary',
        'main dashboard'
      ],
      'accounts': [
        'account management',
        'your accounts',
        'banking accounts',
        'manage accounts',
        'account settings'
      ],
      'transactions': [
        'transaction history',
        'your transactions',
        'payment history',
        'transaction records',
        'financial activity'
      ],
      'payments': [
        'payment processing',
        'send payments',
        'payment center',
        'money transfers',
        'payment services'
      ],
      'wallet': [
        'crypto wallet',
        'Web3 wallet',
        'digital wallet',
        'wallet integration',
        'cryptocurrency storage'
      ],
      'security': [
        'security settings',
        'account security',
        'security center',
        'privacy controls',
        'security features'
      ]
    };

    if (pageVariations[targetPage]) {
      variations.push(...pageVariations[targetPage]);
    }

    return variations;
  }

  // Analyze page for link opportunities
  analyzePageForLinkOpportunities(content: string, currentPage: string): SEOLinkConfig[] {
    const opportunities: SEOLinkConfig[] = [];
    
    // Keywords that should link to specific pages
    const keywordMappings: Record<string, { page: string; priority: number }> = {
      'dashboard': { page: '/dashboard', priority: 9 },
      'account management': { page: '/accounts', priority: 8 },
      'transaction history': { page: '/transactions', priority: 8 },
      'payment processing': { page: '/payments', priority: 8 },
      'crypto wallet': { page: '/wallet', priority: 7 },
      'security settings': { page: '/security', priority: 7 },
      'financial analytics': { page: '/analytics', priority: 6 },
      'API documentation': { page: '/docs', priority: 5 },
      'help center': { page: '/help', priority: 4 },
      'contact support': { page: '/support', priority: 4 }
    };

    // Scan content for keyword opportunities
    Object.entries(keywordMappings).forEach(([keyword, config]) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = content.match(regex);
      
      if (matches && !content.includes(`href="${config.page}"`)) {
        opportunities.push({
          url: config.page,
          anchorText: keyword,
          context: 'content-keyword',
          priority: config.priority,
          attributes: this.generateLinkAttributes(config.page, 'content', 'high')
        });
      }
    });

    return opportunities.sort((a, b) => b.priority - a.priority);
  }

  // Generate structured data for navigation
  generateNavigationStructuredData(navigationItems: any[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      'name': 'Main Navigation',
      'url': navigationItems.map(item => ({
        '@type': 'WebPage',
        'name': item.label,
        'url': `https://fintechbank.com${item.href}`,
        'description': item.description
      }))
    };
  }
}

export const linkOptimizer = new LinkOptimizer();

// URL structure best practices
export const URL_BEST_PRACTICES = {
  // Use descriptive, keyword-rich URLs
  GOOD_URLS: [
    '/accounts/checking',
    '/payments/send-money',
    '/wallet/connect-metamask',
    '/analytics/spending-insights',
    '/security/two-factor-authentication'
  ],
  
  // Avoid these URL patterns
  BAD_URLS: [
    '/page1',
    '/accounts?id=123',
    '/payments/send?type=transfer&amount=100',
    '/wallet/0x742d35Cc6634C0532925a3b8D34B60142C7f5e60',
    '/analytics/report.php?user=123&date=2024'
  ],
  
  // URL structure guidelines
  GUIDELINES: {
    maxLength: 75,
    useHyphens: true,
    avoidUnderscores: true,
    useLowercase: true,
    includeKeywords: true,
    avoidDynamicParameters: true,
    useLogicalHierarchy: true
  }
};

// Link attribute best practices
export const LINK_BEST_PRACTICES = {
  // Internal links
  INTERNAL: {
    rel: undefined, // No rel needed for internal links
    target: '_self',
    title: 'Descriptive title for accessibility',
    'aria-label': 'Use when link text is not descriptive enough'
  },
  
  // External links
  EXTERNAL: {
    rel: 'noopener noreferrer',
    target: '_blank',
    title: 'Opens in new tab',
    'aria-label': 'Link to external site (opens in new tab)'
  },
  
  // Download links
  DOWNLOAD: {
    rel: 'nofollow',
    target: '_blank',
    download: true,
    title: 'Download file',
    'aria-label': 'Download file (PDF, ZIP, etc.)'
  },
  
  // Sponsored/affiliate links
  SPONSORED: {
    rel: 'sponsored noopener',
    target: '_blank',
    title: 'Sponsored link',
    'aria-label': 'Sponsored link (opens in new tab)'
  }
};