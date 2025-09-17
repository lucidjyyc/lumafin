/**
 * Focusable Content Component for Dynamic Updates
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Component for managing focus during dynamic content updates.
 */

import React, { useEffect, useRef } from 'react';
import { useContentFocus } from '../../hooks/useFocusManagement';

interface FocusableContentProps {
  /** Content to display */
  children: React.ReactNode;
  
  /** Whether to preserve focus during updates */
  preserveFocus?: boolean;
  
  /** Whether to announce content changes */
  announceChanges?: boolean;
  
  /** Custom announcement message */
  updateMessage?: string;
  
  /** Loading state */
  loading?: boolean;
  
  /** Error state */
  error?: string | null;
  
  /** Additional CSS classes */
  className?: string;
  
  /** ARIA label for the content area */
  'aria-label'?: string;
  
  /** ARIA described by */
  'aria-describedby'?: string;
}

export const FocusableContent: React.FC<FocusableContentProps> = ({
  children,
  preserveFocus = true,
  announceChanges = true,
  updateMessage = 'Content updated',
  loading = false,
  error = null,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const { containerRef, handleContentUpdate } = useContentFocus();
  const previousChildren = useRef(children);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle content updates
  useEffect(() => {
    if (previousChildren.current !== children) {
      // Clear any pending updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce content updates to avoid excessive announcements
      updateTimeoutRef.current = setTimeout(() => {
        handleContentUpdate({
          preserveFocus,
          announceChange: announceChanges
        });

        if (announceChanges && updateMessage) {
          // Custom announcement for content updates
          setTimeout(() => {
            if (error) {
              focusManager.announce(`Error: ${error}`, 'assertive');
            } else if (!loading) {
              focusManager.announce(updateMessage, 'polite');
            }
          }, 100);
        }

        previousChildren.current = children;
      }, 150);
    }

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [children, preserveFocus, announceChanges, updateMessage, error, loading, handleContentUpdate]);

  // Handle loading state
  useEffect(() => {
    if (containerRef.current) {
      focusManager.handleLoadingState(
        containerRef.current,
        loading,
        loading ? 'Loading content' : 'Content loaded'
      );
    }
  }, [loading]);

  return (
    <div
      ref={containerRef}
      className={`focus-content ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      role="region"
    >
      {error ? (
        <div
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
          role="alert"
          aria-live="assertive"
        >
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div
          className="flex items-center justify-center py-8"
          aria-live="polite"
          aria-label="Loading content"
        >
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mr-3" />
          <span className="text-white">Loading...</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
};