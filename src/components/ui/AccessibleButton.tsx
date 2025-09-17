/**
 * Accessible Button Component with Focus Management
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Button component with comprehensive accessibility and focus management.
 */

import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { Loader2 } from 'lucide-react';
import { focusManager } from '../../lib/accessibility/focusManager';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Loading state */
  loading?: boolean;
  
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Loading text override */
  loadingText?: string;
  
  /** Auto-focus on mount */
  autoFocus?: boolean;
  
  /** Announce state changes to screen readers */
  announceStateChanges?: boolean;
  
  /** Custom focus announcement */
  focusAnnouncement?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      loadingText = 'Loading',
      autoFocus = false,
      announceStateChanges = true,
      focusAnnouncement,
      children,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Expose focus method to parent components
    useImperativeHandle(ref, () => ({
      ...buttonRef.current!,
      focus: (options?: FocusOptions) => {
        if (buttonRef.current) {
          focusManager.setFocus(buttonRef.current, {
            ...options,
            announce: announceStateChanges
          });
        }
      }
    }));

    // Auto-focus on mount
    React.useEffect(() => {
      if (autoFocus && buttonRef.current) {
        focusManager.setFocus(buttonRef.current, {
          announce: announceStateChanges,
          preventScroll: false
        });
      }
    }, [autoFocus, announceStateChanges]);

    // Announce loading state changes
    React.useEffect(() => {
      if (announceStateChanges) {
        if (loading) {
          focusManager.announce(`Button is ${loadingText.toLowerCase()}`, 'polite');
        }
      }
    }, [loading, loadingText, announceStateChanges]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        event.preventDefault();
        return;
      }

      if (announceStateChanges && focusAnnouncement) {
        focusManager.announce(focusAnnouncement, 'polite');
      }

      onClick?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
      if (announceStateChanges && focusAnnouncement) {
        focusManager.announce(focusAnnouncement, 'polite');
      }
      props.onFocus?.(event);
    };

    const baseClasses = `
      inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      relative overflow-hidden
    `;

    const variantClasses = {
      primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 focus:ring-cyan-400',
      secondary: 'bg-white/10 text-white hover:bg-white/20 focus:ring-white/50 backdrop-blur-sm',
      outline: 'border border-white/20 text-white hover:bg-white/10 focus:ring-white/50 backdrop-blur-sm',
      ghost: 'text-white hover:bg-white/10 focus:ring-white/50',
      destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
      success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400',
    };

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs h-6',
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-4 py-2 text-base h-10',
      lg: 'px-6 py-3 text-lg h-12',
      xl: 'px-8 py-4 text-xl h-14',
    };

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    const buttonClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${loading ? 'cursor-not-allowed' : ''}
      ${className}
    `.trim();

    return (
      <button
        ref={buttonRef}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        onFocus={handleFocus}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className={`animate-spin ${iconSizes[size]}`} />
            <span className="sr-only">{loadingText}</span>
          </div>
        )}
        
        <div className={`flex items-center space-x-2 ${loading ? 'opacity-0' : ''}`}>
          {leftIcon && (
            <span className={`flex-shrink-0 ${iconSizes[size]}`} aria-hidden="true">
              {leftIcon}
            </span>
          )}
          
          {children && <span>{children}</span>}
          
          {rightIcon && (
            <span className={`flex-shrink-0 ${iconSizes[size]}`} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';