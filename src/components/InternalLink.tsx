/**
 * Internal Link Component with SEO Optimization
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  rel?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  prefetch?: boolean;
  trackClick?: boolean;
  priority?: 'high' | 'medium' | 'low';
  context?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export const InternalLink: React.FC<InternalLinkProps> = ({
  href,
  children,
  className = '',
  title,
  rel,
  target = '_self',
  prefetch = false,
  trackClick = true,
  priority = 'medium',
  context,
  'aria-label': ariaLabel,
  'data-testid': testId,
  ...props
}) => {
  const isExternal = href.startsWith('http') || href.startsWith('//');
  const isDownload = href.includes('/download') || href.endsWith('.pdf') || href.endsWith('.zip');
  
  // Determine appropriate rel attribute
  const getLinkRel = (): string => {
    if (rel) return rel;
    
    const relAttributes: string[] = [];
    
    if (isExternal) {
      relAttributes.push('noopener');
      if (target === '_blank') {
        relAttributes.push('noreferrer');
      }
    }
    
    if (isDownload) {
      relAttributes.push('nofollow');
    }
    
    // Add nofollow for low priority internal links
    if (!isExternal && priority === 'low') {
      relAttributes.push('nofollow');
    }
    
    return relAttributes.join(' ') || undefined;
  };

  // Track link clicks for analytics
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (trackClick) {
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'click', {
          event_category: 'internal_link',
          event_label: href,
          custom_map: {
            custom_parameter_1: context || 'unknown',
            custom_parameter_2: priority
          }
        });
      }
      
      // Custom tracking
      console.log('Link clicked:', {
        href,
        context,
        priority,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Generate structured data for important links
  const getStructuredData = () => {
    if (priority === 'high' && !isExternal) {
      return {
        itemProp: 'url',
        itemScope: true,
        itemType: 'https://schema.org/WebPage'
      };
    }
    return {};
  };

  const linkClasses = `
    inline-flex items-center transition-all duration-200
    hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 
    focus:ring-offset-2 focus:ring-offset-transparent rounded-sm
    ${isExternal ? 'text-blue-400 hover:text-blue-300' : 'text-cyan-400'}
    ${className}
  `.trim();

  return (
    <a
      href={href}
      className={linkClasses}
      title={title}
      rel={getLinkRel()}
      target={target}
      aria-label={ariaLabel}
      data-testid={testId}
      data-prefetch={prefetch}
      data-priority={priority}
      data-context={context}
      onClick={handleClick}
      {...getStructuredData()}
      {...props}
    >
      {children}
      {isExternal && (
        <ExternalLink 
          className="w-3 h-3 ml-1 opacity-70" 
          aria-hidden="true"
        />
      )}
    </a>
  );
};

// Specialized link components for common use cases
export const NavigationLink: React.FC<Omit<InternalLinkProps, 'priority' | 'trackClick'>> = (props) => (
  <InternalLink {...props} priority="high" trackClick={true} context="navigation" />
);

export const ContentLink: React.FC<Omit<InternalLinkProps, 'priority'>> = (props) => (
  <InternalLink {...props} priority="medium" context="content" />
);

export const FooterLink: React.FC<Omit<InternalLinkProps, 'priority' | 'trackClick'>> = (props) => (
  <InternalLink {...props} priority="low" trackClick={false} context="footer" />
);

export const CTALink: React.FC<Omit<InternalLinkProps, 'priority' | 'prefetch'>> = (props) => (
  <InternalLink {...props} priority="high" prefetch={true} context="cta" />
);