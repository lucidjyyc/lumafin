/**
 * Focus Management React Hooks
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * React hooks for managing focus in accessible applications.
 */

import { useEffect, useRef, useCallback } from 'react';
import { focusManager, FocusManagerOptions } from '../lib/accessibility/focusManager';

/**
 * Hook for managing modal focus with automatic cleanup
 */
export const useModalFocus = (
  isOpen: boolean,
  options: FocusManagerOptions = {}
) => {
  const modalRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Setup modal focus management
      cleanupRef.current = focusManager.manageModalFocus(modalRef.current, {
        returnFocus: true,
        trapFocus: true,
        announceChanges: true,
        ...options
      });
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isOpen, options]);

  return modalRef;
};

/**
 * Hook for managing focus on route changes
 */
export const useRouteFocus = (currentRoute: string) => {
  const previousRoute = useRef<string>(currentRoute);

  useEffect(() => {
    if (previousRoute.current !== currentRoute) {
      focusManager.handleRouteChange(currentRoute);
      previousRoute.current = currentRoute;
    }
  }, [currentRoute]);
};

/**
 * Hook for managing focus during dynamic content updates
 */
export const useContentFocus = () => {
  const containerRef = useRef<HTMLElement>(null);

  const handleContentUpdate = useCallback((options: {
    preserveFocus?: boolean;
    announceChange?: boolean;
  } = {}) => {
    if (containerRef.current) {
      focusManager.handleContentUpdate(containerRef.current, {
        preserveFocus: true,
        announceChange: true,
        ...options
      });
    }
  }, []);

  return { containerRef, handleContentUpdate };
};

/**
 * Hook for managing form focus and validation errors
 */
export const useFormFocus = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const focusFirstError = useCallback(() => {
    if (formRef.current) {
      return focusManager.focusFirstError(formRef.current);
    }
    return false;
  }, []);

  const handleSubmitError = useCallback((errors: Record<string, string>) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0 && formRef.current) {
      const firstErrorField = formRef.current.querySelector(`[name="${errorFields[0]}"]`) as HTMLElement;
      if (firstErrorField) {
        focusManager.setFocus(firstErrorField, { announce: true });
        focusManager.announce(`Form validation failed. ${errors[errorFields[0]]}`, 'assertive');
      }
    }
  }, []);

  return { formRef, focusFirstError, handleSubmitError };
};

/**
 * Hook for creating roving tabindex navigation
 */
export const useRovingTabindex = (
  items: HTMLElement[],
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current && items.length > 0) {
      focusManager.createRovingTabindex(containerRef.current, items, orientation);
    }
  }, [items, orientation]);

  return containerRef;
};

/**
 * Hook for managing loading states with focus
 */
export const useLoadingFocus = () => {
  const containerRef = useRef<HTMLElement>(null);

  const setLoadingState = useCallback((
    isLoading: boolean,
    message: string = 'Loading content'
  ) => {
    if (containerRef.current) {
      focusManager.handleLoadingState(containerRef.current, isLoading, message);
    }
  }, []);

  return { containerRef, setLoadingState };
};

/**
 * Hook for auto-focus on mount
 */
export const useAutoFocus = (
  shouldFocus: boolean = true,
  delay: number = 0
) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      const timeoutId = setTimeout(() => {
        if (elementRef.current) {
          focusManager.setFocus(elementRef.current, { announce: true });
        }
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldFocus, delay]);

  return elementRef;
};

/**
 * Hook for focus restoration after async operations
 */
export const useFocusRestore = () => {
  const savedFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    savedFocusRef.current = focusManager.saveFocus();
  }, []);

  const restoreFocus = useCallback(() => {
    if (savedFocusRef.current) {
      focusManager.setFocus(savedFocusRef.current, { announce: true });
      savedFocusRef.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
};