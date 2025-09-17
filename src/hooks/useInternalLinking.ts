/**
 * Internal Linking Hook for Dynamic Link Management
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

import { useState, useEffect, useMemo } from 'react';
import { linkingStrategy, LinkRecommendation } from '../lib/navigation/linkingStrategy';
import { linkOptimizer } from '../lib/seo/linkOptimization';

export interface UseInternalLinkingOptions {
  currentPageId: string;
  maxRecommendations?: number;
  includeContextual?: boolean;
  trackClicks?: boolean;
}

export interface InternalLinkingData {
  recommendations: LinkRecommendation[];
  breadcrumbs: any[];
  relatedPages: any[];
  quickNavigation: any[];
  seoOpportunities: any[];
}

export const useInternalLinking = ({
  currentPageId,
  maxRecommendations = 6,
  includeContextual = true,
  trackClicks = true
}: UseInternalLinkingOptions): InternalLinkingData => {
  const [linkData, setLinkData] = useState<InternalLinkingData>({
    recommendations: [],
    breadcrumbs: [],
    relatedPages: [],
    quickNavigation: [],
    seoOpportunities: []
  });

  // Get current page information
  const currentPage = useMemo(() => {
    return linkingStrategy.getPage(currentPageId);
  }, [currentPageId]);

  // Generate link recommendations
  const recommendations = useMemo(() => {
    return linkingStrategy.generateLinkRecommendations(currentPageId)
      .slice(0, maxRecommendations);
  }, [currentPageId, maxRecommendations]);

  // Get breadcrumbs for current page
  const breadcrumbs = useMemo(() => {
    return currentPage?.breadcrumbs || [];
  }, [currentPage]);

  // Get related pages
  const relatedPages = useMemo(() => {
    if (!currentPage) return [];
    
    return currentPage.relatedPages
      .map(pageId => linkingStrategy.getPage(pageId))
      .filter(page => page !== undefined);
  }, [currentPage]);

  // Generate quick navigation based on user's likely next actions
  const quickNavigation = useMemo(() => {
    const quickNavMap: Record<string, string[]> = {
      'home': ['dashboard', 'auth-register', 'auth-login'],
      'dashboard': ['accounts', 'transactions', 'payments', 'wallet'],
      'accounts': ['transactions', 'payments', 'settings', 'security'],
      'transactions': ['accounts', 'payments', 'analytics'],
      'payments': ['accounts', 'transactions', 'wallet'],
      'wallet': ['payments', 'accounts', 'security'],
      'analytics': ['dashboard', 'accounts', 'transactions'],
      'security': ['settings', 'accounts', 'auth-login'],
      'settings': ['security', 'accounts', 'dashboard']
    };

    const navPageIds = quickNavMap[currentPageId] || [];
    return navPageIds
      .map(pageId => linkingStrategy.getPage(pageId))
      .filter(page => page !== undefined);
  }, [currentPageId]);

  // Analyze current page content for SEO opportunities
  useEffect(() => {
    const analyzeContent = () => {
      // In a real implementation, this would analyze the actual page content
      const mockContent = `
        Welcome to your ${currentPageId} page. Here you can manage your accounts,
        view transaction history, process payments, and access your crypto wallet.
        For security settings and account preferences, visit your dashboard.
      `;

      const opportunities = linkOptimizer.analyzePageForLinkOpportunities(
        mockContent,
        currentPageId
      );

      setLinkData(prev => ({
        ...prev,
        recommendations,
        breadcrumbs,
        relatedPages,
        quickNavigation,
        seoOpportunities: opportunities
      }));
    };

    analyzeContent();
  }, [currentPageId, recommendations, breadcrumbs, relatedPages, quickNavigation]);

  // Track link clicks for analytics
  const trackLinkClick = (href: string, context: string) => {
    if (!trackClicks) return;

    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'internal_link_click', {
        event_category: 'navigation',
        event_label: href,
        custom_map: {
          source_page: currentPageId,
          link_context: context,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Custom tracking for internal analytics
    console.log('Internal link clicked:', {
      from: currentPageId,
      to: href,
      context,
      timestamp: new Date().toISOString()
    });
  };

  return {
    ...linkData,
    trackLinkClick
  };
};

// Hook for generating contextual links based on page content
export const useContextualLinks = (
  content: string,
  currentPageId: string,
  maxLinks: number = 3
) => {
  return useMemo(() => {
    const opportunities = linkOptimizer.analyzePageForLinkOpportunities(
      content,
      currentPageId
    );
    
    return opportunities.slice(0, maxLinks);
  }, [content, currentPageId, maxLinks]);
};

// Hook for breadcrumb generation
export const useBreadcrumbGeneration = (currentPath: string) => {
  return useMemo(() => {
    const pathSegments = currentPath.split('/').filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/', isActive: false }];

    let currentRoute = '';
    pathSegments.forEach((segment, index) => {
      currentRoute += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert route segments to readable labels
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        path: currentRoute,
        isActive: isLast
      });
    });

    return breadcrumbs;
  }, [currentPath]);
};