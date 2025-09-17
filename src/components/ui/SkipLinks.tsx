/**
 * Skip Links Component for Keyboard Navigation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Skip links component for WCAG 2.1 compliance and keyboard navigation.
 */

import React from 'react';
import { focusManager } from '../../lib/accessibility/focusManager';

interface SkipLink {
  href: string;
  label: string;
  description?: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultSkipLinks: SkipLink[] = [
  {
    href: '#main-content',
    label: 'Skip to main content',
    description: 'Jump directly to the main content area'
  },
  {
    href: '#navigation',
    label: 'Skip to navigation',
    description: 'Jump to the main navigation menu'
  },
  {
    href: '#search',
    label: 'Skip to search',
    description: 'Jump to the search functionality'
  },
  {
    href: '#footer',
    label: 'Skip to footer',
    description: 'Jump to the footer links and information'
  }
];

export const SkipLinks: React.FC<SkipLinksProps> = ({
  links = defaultSkipLinks,
  className = ''
}) => {
  const handleSkipLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href) return;

    event.preventDefault();
    
    const targetId = href.substring(1); // Remove #
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Make target focusable if it isn't already
      const originalTabIndex = targetElement.getAttribute('tabindex');
      if (!originalTabIndex) {
        targetElement.setAttribute('tabindex', '-1');
      }
      
      // Focus the target element
      focusManager.setFocus(targetElement, { 
        announce: true,
        preventScroll: false 
      });
      
      // Restore original tabindex after focus
      setTimeout(() => {
        if (!originalTabIndex) {
          targetElement.removeAttribute('tabindex');
        }
      }, 100);
      
      // Announce the skip action
      focusManager.announce(`Skipped to ${targetElement.getAttribute('aria-label') || targetId}`, 'polite');
    }
  };

  return (
    <div className={`skip-links ${className}`}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
          onClick={handleSkipLinkClick}
          title={link.description}
        >
          {link.label}
        </a>
      ))}
      
      <style jsx>{`
        .skip-links {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 9999;
        }
        
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          transition: top 0.3s ease;
          z-index: 10000;
          border: 2px solid transparent;
        }
        
        .skip-link:focus {
          top: 6px;
          outline: none;
          border-color: #00d9ff;
          box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.3);
        }
        
        .skip-link:hover {
          background: #333;
        }
        
        .skip-link:active {
          background: #00d9ff;
          color: #000;
        }
      `}</style>
    </div>
  );
};