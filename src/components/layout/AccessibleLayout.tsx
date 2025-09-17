/**
 * Accessible Layout Component with Focus Management
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Main layout component with comprehensive accessibility features.
 */

import React, { useEffect } from 'react';
import { SkipLinks } from '../ui/SkipLinks';
import { useRouteFocus } from '../../hooks/useFocusManagement';

interface AccessibleLayoutProps {
  /** Current route for focus management */
  currentRoute: string;
  
  /** Header content */
  header: React.ReactNode;
  
  /** Sidebar content */
  sidebar?: React.ReactNode;
  
  /** Main content */
  children: React.ReactNode;
  
  /** Footer content */
  footer?: React.ReactNode;
  
  /** Whether to show skip links */
  showSkipLinks?: boolean;
  
  /** Custom skip links */
  skipLinks?: Array<{ href: string; label: string; description?: string }>;
}

export const AccessibleLayout: React.FC<AccessibleLayoutProps> = ({
  currentRoute,
  header,
  sidebar,
  children,
  footer,
  showSkipLinks = true,
  skipLinks
}) => {
  // Handle route focus changes
  useRouteFocus(currentRoute);

  // Set up landmark regions
  useEffect(() => {
    // Ensure main content has proper landmark
    const mainContent = document.getElementById('main-content');
    if (mainContent && !mainContent.getAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }

    // Ensure navigation has proper landmark
    const navigation = document.getElementById('navigation');
    if (navigation && !navigation.getAttribute('role')) {
      navigation.setAttribute('role', 'navigation');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Skip Links */}
      {showSkipLinks && <SkipLinks links={skipLinks} />}
      
      {/* Header */}
      <header
        id="header"
        role="banner"
        className="relative z-20"
      >
        {header}
      </header>

      <div className="flex relative">
        {/* Sidebar Navigation */}
        {sidebar && (
          <aside
            id="navigation"
            role="navigation"
            aria-label="Main navigation"
            className="relative z-10"
          >
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main
          id="main-content"
          role="main"
          className="flex-1 relative z-10"
          tabIndex={-1}
        >
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer
          id="footer"
          role="contentinfo"
          className="relative z-10"
        >
          {footer}
        </footer>
      )}

      {/* Live region for announcements */}
      <div
        id="announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
};