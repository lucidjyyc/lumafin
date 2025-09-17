/**
 * Related Links Component for Cross-Page Navigation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

import React from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { InternalLink } from './InternalLink';
import { linkingStrategy, NavigationItem } from '../lib/navigation/linkingStrategy';

interface RelatedLinksProps {
  currentPageId: string;
  title?: string;
  maxLinks?: number;
  showDescriptions?: boolean;
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
}

export const RelatedLinks: React.FC<RelatedLinksProps> = ({
  currentPageId,
  title = 'Related Pages',
  maxLinks = 4,
  showDescriptions = true,
  layout = 'grid',
  className = ''
}) => {
  const recommendations = linkingStrategy.generateLinkRecommendations(currentPageId);
  const topRecommendations = recommendations.slice(0, maxLinks);

  if (topRecommendations.length === 0) return null;

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-4';
      case 'vertical':
        return 'space-y-4';
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    }
  };

  return (
    <section 
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 ${className}`}
      aria-labelledby="related-links-title"
    >
      <h3 
        id="related-links-title"
        className="text-xl font-semibold text-white mb-6 flex items-center"
      >
        <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
        {title}
      </h3>
      
      <div className={getLayoutClasses()}>
        {topRecommendations.map((recommendation) => {
          const page = linkingStrategy.getPage(recommendation.toPage);
          if (!page) return null;

          return (
            <div
              key={recommendation.toPage}
              className="group bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200"
            >
              <InternalLink
                href={page.path}
                className="block text-white font-medium group-hover:text-cyan-300 transition-colors"
                priority="high"
                context="related-links"
                aria-describedby={showDescriptions ? `desc-${page.id}` : undefined}
              >
                <div className="flex items-center justify-between">
                  <span>{page.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </InternalLink>
              
              {showDescriptions && (
                <p 
                  id={`desc-${page.id}`}
                  className="text-gray-400 text-sm mt-2 leading-relaxed"
                >
                  {page.description}
                </p>
              )}
              
              {page.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {page.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Contextual links component for inline content
export const ContextualLinks: React.FC<{
  currentPageId: string;
  keywords: string[];
  maxLinks?: number;
}> = ({ currentPageId, keywords, maxLinks = 3 }) => {
  const allPages = linkingStrategy.getAllPages();
  
  // Find pages that match the provided keywords
  const matchingPages = allPages
    .filter(page => 
      page.id !== currentPageId &&
      keywords.some(keyword => 
        page.keywords.includes(keyword) || 
        page.title.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    .slice(0, maxLinks);

  if (matchingPages.length === 0) return null;

  return (
    <div className="inline-flex flex-wrap gap-2 mt-2">
      <span className="text-gray-400 text-sm">Related:</span>
      {matchingPages.map((page, index) => (
        <React.Fragment key={page.id}>
          <InternalLink
            href={page.path}
            className="text-cyan-400 hover:text-cyan-300 text-sm underline"
            priority="medium"
            context="contextual"
          >
            {page.title}
          </InternalLink>
          {index < matchingPages.length - 1 && (
            <span className="text-gray-500 text-sm">•</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Quick navigation component for dashboard
export const QuickNavigation: React.FC<{
  currentPageId: string;
}> = ({ currentPageId }) => {
  const quickNavPages = [
    'dashboard',
    'accounts',
    'transactions',
    'payments',
    'wallet',
    'analytics'
  ];

  const pages = quickNavPages
    .map(id => linkingStrategy.getPage(id))
    .filter((page): page is NavigationItem => page !== undefined && page.id !== currentPageId);

  return (
    <nav 
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
      aria-label="Quick navigation"
    >
      <h4 className="text-white font-medium mb-3">Quick Access</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {pages.map((page) => (
          <InternalLink
            key={page.id}
            href={page.path}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            priority="high"
            context="quick-nav"
          >
            <span className="text-sm">{page.title.split(' ')[0]}</span>
          </InternalLink>
        ))}
      </div>
    </nav>
  );
};