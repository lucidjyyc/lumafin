/**
 * Focus Management System for Accessibility Compliance
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Comprehensive focus management system ensuring WCAG 2.1 compliance
 * for Success Criterion 2.4.3 (Focus Order) and related criteria.
 */

export interface FocusableElement extends HTMLElement {
  focus(options?: FocusOptions): void;
}

export interface FocusManagerOptions {
  returnFocus?: boolean;
  trapFocus?: boolean;
  initialFocus?: string | HTMLElement;
  skipLinks?: boolean;
  announceChanges?: boolean;
}

export class FocusManager {
  private static instance: FocusManager;
  private focusHistory: HTMLElement[] = [];
  private currentTrap: HTMLElement | null = null;
  private skipLinkContainer: HTMLElement | null = null;
  private announcer: HTMLElement | null = null;

  private constructor() {
    this.initializeSkipLinks();
    this.initializeAnnouncer();
    this.setupGlobalListeners();
  }

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  /**
   * Initialize skip links for keyboard navigation
   */
  private initializeSkipLinks(): void {
    if (typeof window === 'undefined') return;

    this.skipLinkContainer = document.createElement('div');
    this.skipLinkContainer.id = 'skip-links';
    this.skipLinkContainer.className = 'skip-links';
    this.skipLinkContainer.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    `;

    // Insert at the beginning of body
    document.body.insertBefore(this.skipLinkContainer, document.body.firstChild);

    // Add CSS for skip links
    this.addSkipLinkStyles();
  }

  /**
   * Initialize screen reader announcer
   */
  private initializeAnnouncer(): void {
    if (typeof window === 'undefined') return;

    this.announcer = document.createElement('div');
    this.announcer.id = 'focus-announcer';
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;

    document.body.appendChild(this.announcer);
  }

  /**
   * Add CSS styles for skip links
   */
  private addSkipLinkStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
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
      }
      
      .skip-link:focus {
        top: 6px;
        outline: 2px solid #00d9ff;
        outline-offset: 2px;
      }
      
      .skip-link:hover {
        background: #333;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup global event listeners for focus management
   */
  private setupGlobalListeners(): void {
    if (typeof window === 'undefined') return;

    // Track focus changes
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));

    // Handle escape key for focus traps
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Handle focus in events
   */
  private handleFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    
    // Announce focus changes for screen readers
    if (target && target.getAttribute('aria-label')) {
      this.announce(`Focused on ${target.getAttribute('aria-label')}`);
    }
  }

  /**
   * Handle focus out events
   */
  private handleFocusOut(event: FocusEvent): void {
    // Track focus history for return focus functionality
    const target = event.target as HTMLElement;
    if (target && this.isFocusable(target)) {
      this.addToFocusHistory(target);
    }
  }

  /**
   * Handle keyboard events for focus management
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.currentTrap) {
      this.releaseFocusTrap();
    }
  }

  /**
   * Save current focus and return to it later
   */
  saveFocus(): HTMLElement | null {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && this.isFocusable(activeElement)) {
      this.addToFocusHistory(activeElement);
      return activeElement;
    }
    return null;
  }

  /**
   * Return focus to previously saved element
   */
  returnFocus(): boolean {
    const lastFocused = this.focusHistory.pop();
    if (lastFocused && document.contains(lastFocused)) {
      this.setFocus(lastFocused);
      return true;
    }
    return false;
  }

  /**
   * Set focus to specific element with options
   */
  setFocus(
    element: string | HTMLElement | null,
    options: FocusOptions & { announce?: boolean } = {}
  ): boolean {
    let targetElement: HTMLElement | null = null;

    if (typeof element === 'string') {
      targetElement = document.querySelector(element);
    } else {
      targetElement = element;
    }

    if (!targetElement || !this.isFocusable(targetElement)) {
      return false;
    }

    try {
      targetElement.focus(options);
      
      if (options.announce) {
        const label = targetElement.getAttribute('aria-label') || 
                     targetElement.textContent || 
                     'Element';
        this.announce(`Focused on ${label}`);
      }
      
      return true;
    } catch (error) {
      console.warn('Failed to set focus:', error);
      return false;
    }
  }

  /**
   * Create focus trap within container
   */
  createFocusTrap(container: HTMLElement, options: FocusManagerOptions = {}): void {
    this.currentTrap = container;
    
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    // Set initial focus
    if (options.initialFocus) {
      if (typeof options.initialFocus === 'string') {
        const initialElement = container.querySelector(options.initialFocus);
        if (initialElement) {
          this.setFocus(initialElement as HTMLElement, { announce: true });
        }
      } else {
        this.setFocus(options.initialFocus, { announce: true });
      }
    } else {
      this.setFocus(focusableElements[0], { announce: true });
    }

    // Setup trap listeners
    this.setupFocusTrapListeners(container, focusableElements);
  }

  /**
   * Release focus trap
   */
  releaseFocusTrap(): void {
    if (this.currentTrap) {
      this.removeFocusTrapListeners(this.currentTrap);
      this.currentTrap = null;
      this.returnFocus();
    }
  }

  /**
   * Setup focus trap event listeners
   */
  private setupFocusTrapListeners(
    container: HTMLElement,
    focusableElements: HTMLElement[]
  ): void {
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement) {
          event.preventDefault();
          this.setFocus(lastElement);
        }
      } else {
        // Tab
        if (activeElement === lastElement) {
          event.preventDefault();
          this.setFocus(firstElement);
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    container.setAttribute('data-focus-trap', 'true');
  }

  /**
   * Remove focus trap listeners
   */
  private removeFocusTrapListeners(container: HTMLElement): void {
    const listeners = container.querySelectorAll('[data-focus-trap]');
    listeners.forEach(element => {
      element.removeAttribute('data-focus-trap');
    });
  }

  /**
   * Get all focusable elements within container
   */
  getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'audio[controls]',
      'video[controls]',
      'iframe',
      'object',
      'embed',
      'area[href]',
      'summary'
    ].join(', ');

    const elements = Array.from(
      container.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    return elements.filter(element => {
      return this.isFocusable(element) && this.isVisible(element);
    });
  }

  /**
   * Check if element is focusable
   */
  private isFocusable(element: HTMLElement): boolean {
    if (!element || element.disabled) return false;
    
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex === '-1') return false;
    
    const tagName = element.tagName.toLowerCase();
    const type = element.getAttribute('type');
    
    // Check for hidden inputs
    if (tagName === 'input' && type === 'hidden') return false;
    
    return true;
  }

  /**
   * Check if element is visible
   */
  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }

  /**
   * Add element to focus history
   */
  private addToFocusHistory(element: HTMLElement): void {
    // Remove element if it already exists in history
    this.focusHistory = this.focusHistory.filter(el => el !== element);
    
    // Add to end of history
    this.focusHistory.push(element);
    
    // Limit history size
    if (this.focusHistory.length > 10) {
      this.focusHistory.shift();
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcer) return;

    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = '';
      }
    }, 1000);
  }

  /**
   * Handle dynamic content updates
   */
  handleContentUpdate(
    container: HTMLElement,
    options: { preserveFocus?: boolean; announceChange?: boolean } = {}
  ): void {
    const activeElement = document.activeElement as HTMLElement;
    const wasInContainer = container.contains(activeElement);

    if (options.announceChange) {
      this.announce('Content updated');
    }

    if (options.preserveFocus && wasInContainer) {
      // Try to maintain focus on equivalent element
      const focusableElements = this.getFocusableElements(container);
      if (focusableElements.length > 0) {
        // Find element with same role or similar attributes
        const equivalentElement = this.findEquivalentElement(activeElement, focusableElements);
        if (equivalentElement) {
          this.setFocus(equivalentElement, { announce: true });
        } else {
          this.setFocus(focusableElements[0], { announce: true });
        }
      }
    }
  }

  /**
   * Find equivalent element after content update
   */
  private findEquivalentElement(
    originalElement: HTMLElement,
    candidates: HTMLElement[]
  ): HTMLElement | null {
    const originalRole = originalElement.getAttribute('role');
    const originalId = originalElement.id;
    const originalClass = originalElement.className;

    // Try to find by ID first
    if (originalId) {
      const byId = candidates.find(el => el.id === originalId);
      if (byId) return byId;
    }

    // Try to find by role
    if (originalRole) {
      const byRole = candidates.find(el => el.getAttribute('role') === originalRole);
      if (byRole) return byRole;
    }

    // Try to find by class
    if (originalClass) {
      const byClass = candidates.find(el => el.className === originalClass);
      if (byClass) return byClass;
    }

    return null;
  }

  /**
   * Create and manage modal focus
   */
  manageModalFocus(
    modal: HTMLElement,
    options: FocusManagerOptions = {}
  ): () => void {
    // Save current focus
    const previousFocus = this.saveFocus();

    // Create focus trap
    if (options.trapFocus !== false) {
      this.createFocusTrap(modal, options);
    }

    // Return cleanup function
    return () => {
      this.releaseFocusTrap();
      if (options.returnFocus !== false && previousFocus) {
        this.setFocus(previousFocus, { announce: true });
      }
    };
  }

  /**
   * Handle route changes and focus management
   */
  handleRouteChange(newRoute: string): void {
    // Focus on main content area
    const mainContent = document.getElementById('main-content') || 
                       document.querySelector('main') ||
                       document.querySelector('[role="main"]');

    if (mainContent) {
      // Make main content focusable temporarily
      const originalTabIndex = mainContent.getAttribute('tabindex');
      mainContent.setAttribute('tabindex', '-1');
      
      this.setFocus(mainContent, { announce: true });
      
      // Announce route change
      this.announce(`Navigated to ${this.getPageTitle(newRoute)}`);

      // Restore original tabindex after focus
      setTimeout(() => {
        if (originalTabIndex) {
          mainContent.setAttribute('tabindex', originalTabIndex);
        } else {
          mainContent.removeAttribute('tabindex');
        }
      }, 100);
    }
  }

  /**
   * Get page title for announcements
   */
  private getPageTitle(route: string): string {
    const titles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/accounts': 'Account Management',
      '/transactions': 'Transaction History',
      '/payments': 'Payment Processing',
      '/wallet': 'Wallet Integration',
      '/security': 'Security Center',
      '/settings': 'Account Settings'
    };
    return titles[route] || 'Page';
  }

  /**
   * Manage focus for form validation errors
   */
  focusFirstError(form: HTMLElement): boolean {
    const errorElements = form.querySelectorAll('[aria-invalid="true"], .error, [data-error]');
    
    if (errorElements.length > 0) {
      const firstError = errorElements[0] as HTMLElement;
      this.setFocus(firstError, { announce: true });
      
      // Announce error
      const errorMessage = firstError.getAttribute('aria-describedby');
      if (errorMessage) {
        const errorElement = document.getElementById(errorMessage);
        if (errorElement) {
          this.announce(`Error: ${errorElement.textContent}`, 'assertive');
        }
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Create roving tabindex for component groups
   */
  createRovingTabindex(
    container: HTMLElement,
    items: HTMLElement[],
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ): void {
    if (items.length === 0) return;

    // Set initial tabindex values
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });

    // Add keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = items.findIndex(item => item === event.target);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            event.preventDefault();
            nextIndex = (currentIndex + 1) % items.length;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            event.preventDefault();
            nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical') {
            event.preventDefault();
            nextIndex = (currentIndex + 1) % items.length;
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            event.preventDefault();
            nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
          }
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = items.length - 1;
          break;
      }

      if (nextIndex !== currentIndex) {
        // Update tabindex values
        items.forEach((item, index) => {
          item.setAttribute('tabindex', index === nextIndex ? '0' : '-1');
        });
        
        // Focus new element
        this.setFocus(items[nextIndex], { announce: true });
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('data-roving-tabindex', 'true');
  }

  /**
   * Manage focus for live regions
   */
  manageLiveRegion(
    element: HTMLElement,
    content: string,
    priority: 'polite' | 'assertive' = 'polite'
  ): void {
    element.setAttribute('aria-live', priority);
    element.setAttribute('aria-atomic', 'true');
    
    // Clear and set content
    element.textContent = '';
    setTimeout(() => {
      element.textContent = content;
    }, 100);
  }

  /**
   * Handle focus for loading states
   */
  handleLoadingState(
    container: HTMLElement,
    isLoading: boolean,
    loadingMessage: string = 'Loading content'
  ): void {
    if (isLoading) {
      container.setAttribute('aria-busy', 'true');
      this.announce(loadingMessage);
      
      // Disable focusable elements during loading
      const focusableElements = this.getFocusableElements(container);
      focusableElements.forEach(element => {
        element.setAttribute('data-was-focusable', element.getAttribute('tabindex') || '0');
        element.setAttribute('tabindex', '-1');
      });
    } else {
      container.removeAttribute('aria-busy');
      this.announce('Content loaded');
      
      // Restore focusable elements
      const elements = container.querySelectorAll('[data-was-focusable]');
      elements.forEach(element => {
        const originalTabIndex = element.getAttribute('data-was-focusable');
        if (originalTabIndex === '0') {
          element.removeAttribute('tabindex');
        } else {
          element.setAttribute('tabindex', originalTabIndex!);
        }
        element.removeAttribute('data-was-focusable');
      });
    }
  }
}

// Export singleton instance
export const focusManager = FocusManager.getInstance();