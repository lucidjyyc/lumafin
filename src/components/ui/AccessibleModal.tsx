/**
 * Accessible Modal Component with Focus Management
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Modal component with comprehensive focus management and WCAG 2.1 compliance.
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useModalFocus } from '../../hooks/useFocusManagement';
import { focusManager } from '../../lib/accessibility/focusManager';

interface AccessibleModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Function to call when modal should close */
  onClose: () => void;
  
  /** Modal title for accessibility */
  title: string;
  
  /** Modal content */
  children: React.ReactNode;
  
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** Whether to show close button */
  showCloseButton?: boolean;
  
  /** Whether clicking overlay closes modal */
  closeOnOverlayClick?: boolean;
  
  /** Whether pressing Escape closes modal */
  closeOnEscape?: boolean;
  
  /** Initial focus element selector */
  initialFocus?: string;
  
  /** Custom header content */
  header?: React.ReactNode;
  
  /** Custom footer content */
  footer?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Loading state */
  loading?: boolean;
  
  /** ARIA described by */
  'aria-describedby'?: string;
  
  /** Test ID */
  'data-testid'?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  initialFocus,
  header,
  footer,
  className = '',
  loading = false,
  'aria-describedby': ariaDescribedBy,
  'data-testid': testId,
}) => {
  const modalRef = useModalFocus(isOpen, {
    initialFocus,
    returnFocus: true,
    trapFocus: true,
    announceChanges: true
  });

  const titleId = useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`);
  const descriptionId = useRef(`modal-desc-${Math.random().toString(36).substr(2, 9)}`);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle loading state focus
  useEffect(() => {
    if (modalRef.current) {
      focusManager.handleLoadingState(
        modalRef.current,
        loading,
        loading ? 'Modal content is loading' : 'Modal content loaded'
      );
    }
  }, [loading]);

  // Announce modal open/close
  useEffect(() => {
    if (isOpen) {
      focusManager.announce(`${title} dialog opened`);
    } else {
      focusManager.announce(`${title} dialog closed`);
    }
  }, [isOpen, title]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-none w-full h-full'
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`
          bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl
          max-h-[90vh] overflow-hidden flex flex-col
          ${sizeClasses[size]} ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId.current}
        aria-describedby={ariaDescribedBy || descriptionId.current}
        data-testid={testId}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          {header || (
            <>
              <h2
                id={titleId.current}
                className="text-xl font-semibold text-white"
              >
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close dialog"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <div
          id={descriptionId.current}
          className="flex-1 p-6 overflow-y-auto"
          role="document"
        >
          {loading ? (
            <div 
              className="flex items-center justify-center py-8"
              aria-live="polite"
              aria-label="Loading content"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
              <span className="ml-3 text-white">Loading...</span>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-white/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};