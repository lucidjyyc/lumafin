/**
 * SEO-Optimized Content Component with Smart Internal Linking
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { RelatedLinks, ContextualLinks } from './RelatedLinks';
import { useInternalLinking } from '../hooks/useInternalLinking';

interface SEOOptimizedContentProps {
  pageId: string;
  title: string;
  description: string;
  keywords: string[];
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  showRelatedLinks?: boolean;
  showContextualLinks?: boolean;
  className?: string;
}

export const SEOOptimizedContent: React.FC<SEOOptimizedContentProps> = ({
  pageId,
  title,
  description,
  keywords,
  children,
  showBreadcrumbs = true,
  showRelatedLinks = true,
  showContextualLinks = true,
  className = ''
}) => {
  const {
    breadcrumbs,
    relatedPages,
    quickNavigation,
    trackLinkClick
  } = useInternalLinking({
    currentPageId: pageId,
    maxRecommendations: 6,
    includeContextual: true,
    trackClicks: true
  });

  // Generate structured data for the page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': `https://fintechbank.com${window.location.pathname}`,
    'keywords': keywords.join(', '),
    'author': {
      '@type': 'Person',
      'name': 'Adam J Smith',
      'email': 'boom.ski@hotmail.com'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'NOIR9 FOUNDATION INC',
      'url': 'https://noir9.foundation'
    },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.label,
        'item': `https://fintechbank.com${crumb.path}`
      }))
    }
  };

  return (
    <article className={`space-y-6 ${className}`}>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2)
        }}
      />

      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbs.length > 1 && (
        <Breadcrumbs 
          items={breadcrumbs}
          className="mb-6"
        />
      )}

      {/* Page header with SEO optimization */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
        
        {/* Keywords for SEO (hidden from users) */}
        <meta name="keywords" content={keywords.join(', ')} />
        <meta name="description" content={description} />
      </header>

      {/* Main content */}
      <div className="prose prose-invert max-w-none">
        {children}
      </div>

      {/* Contextual links within content */}
      {showContextualLinks && (
        <ContextualLinks
          currentPageId={pageId}
          keywords={keywords}
          maxLinks={3}
        />
      )}

      {/* Related links section */}
      {showRelatedLinks && (
        <RelatedLinks
          currentPageId={pageId}
          title="Explore Related Features"
          maxLinks={4}
          showDescriptions={true}
          layout="grid"
          className="mt-12"
        />
      )}

      {/* Quick navigation for app pages */}
      {pageId !== 'home' && quickNavigation.length > 0 && (
        <aside className="mt-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
          <h3 className="text-white font-semibold mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickNavigation.slice(0, 4).map((page: any) => (
              <a
                key={page.id}
                href={page.path}
                className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                onClick={() => trackLinkClick(page.path, 'quick-navigation')}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg mb-2 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-colors">
                  <span className="text-cyan-400 text-sm font-bold">
                    {page.title.charAt(0)}
                  </span>
                </div>
                <span className="text-gray-300 group-hover:text-white text-sm text-center transition-colors">
                  {page.title.split(' ')[0]}
                </span>
              </a>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
};

// Component for embedding contextual links in content
export const InlineLinks: React.FC<{
  content: string;
  currentPageId: string;
}> = ({ content, currentPageId }) => {
  const opportunities = linkOptimizer.analyzePageForLinkOpportunities(content, currentPageId);
  
  // Replace keywords with links in content
  let processedContent = content;
  
  opportunities.slice(0, 3).forEach(opportunity => {
    const linkHtml = `<a href="${opportunity.url}" class="text-cyan-400 hover:text-cyan-300 underline transition-colors" data-context="${opportunity.context}">${opportunity.anchorText}</a>`;
    processedContent = processedContent.replace(
      new RegExp(`\\b${opportunity.anchorText}\\b`, 'i'),
      linkHtml
    );
  });

  return (
    <div 
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};