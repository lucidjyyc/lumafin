/**
 * Focus Management Implementation Guide
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Comprehensive guide for implementing accessible focus management.
 */

# Focus Management Implementation Guide

## Overview

This guide covers the implementation of comprehensive focus management for WCAG 2.1 compliance, specifically addressing Success Criterion 2.4.3 (Focus Order) and related accessibility requirements.

## WCAG 2.1 Compliance

### Success Criteria Addressed

| Criterion | Level | Description | Implementation |
|-----------|-------|-------------|----------------|
| 2.4.3 | A | Focus Order | Logical tab order maintained |
| 2.4.7 | AA | Focus Visible | Clear focus indicators |
| 2.1.1 | A | Keyboard | All functionality keyboard accessible |
| 2.1.2 | A | No Keyboard Trap | Focus can always escape |
| 3.2.1 | A | On Focus | No context changes on focus |

## Implementation Components

### 1. Focus Manager Service

```typescript
import { focusManager } from '@/lib/accessibility/focusManager';

// Save and restore focus
const savedFocus = focusManager.saveFocus();
// ... perform operations
focusManager.returnFocus();

// Create focus trap for modals
const cleanup = focusManager.manageModalFocus(modalElement, {
  initialFocus: '#first-input',
  returnFocus: true,
  trapFocus: true
});
```

### 2. React Hooks

```typescript
// Modal focus management
const modalRef = useModalFocus(isOpen, {
  initialFocus: '#primary-action',
  returnFocus: true
});

// Route change focus
useRouteFocus(currentRoute);

// Dynamic content focus
const { containerRef, handleContentUpdate } = useContentFocus();

// Form error focus
const { formRef, focusFirstError } = useFormFocus();
```

### 3. Skip Links

```tsx
<SkipLinks links={[
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#search', label: 'Skip to search' }
]} />
```

## Focus Management Patterns

### Modal Dialogs

```tsx
function PaymentModal({ isOpen, onClose }) {
  const modalRef = useModalFocus(isOpen, {
    initialFocus: '#amount-input',
    returnFocus: true,
    announceChanges: true
  });

  return (
    <AccessibleModal
      ref={modalRef}
      isOpen={isOpen}
      onClose={onClose}
      title="Send Payment"
      initialFocus="#amount-input"
    >
      <form>
        <input
          id="amount-input"
          type="number"
          placeholder="Enter amount"
          aria-label="Payment amount"
        />
        <button type="submit">Send Payment</button>
      </form>
    </AccessibleModal>
  );
}
```

### Dynamic Content Updates

```tsx
function TransactionList() {
  const { containerRef, handleContentUpdate } = useContentFocus();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshTransactions = async () => {
    setLoading(true);
    const newTransactions = await fetchTransactions();
    setTransactions(newTransactions);
    setLoading(false);
    
    // Announce content update
    handleContentUpdate({
      preserveFocus: true,
      announceChange: true
    });
  };

  return (
    <FocusableContent
      ref={containerRef}
      loading={loading}
      preserveFocus={true}
      announceChanges={true}
      updateMessage="Transaction list updated"
    >
      {transactions.map(transaction => (
        <TransactionItem key={transaction.id} {...transaction} />
      ))}
    </FocusableContent>
  );
}
```

### Form Validation

```tsx
function LoginForm() {
  const { formRef, focusFirstError, handleSubmitError } = useFormFocus();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (data) => {
    try {
      await submitLogin(data);
    } catch (error) {
      const validationErrors = parseValidationErrors(error);
      setErrors(validationErrors);
      handleSubmitError(validationErrors);
    }
  };

  return (
    <AccessibleForm
      ref={formRef}
      fields={loginFields}
      onSubmit={handleSubmit}
      title="Sign In"
      errors={errors}
    />
  );
}
```

### Roving Tabindex Navigation

```tsx
function TabNavigation({ tabs }) {
  const tabElements = tabs.map(() => React.createRef());
  const containerRef = useRovingTabindex(
    tabElements.map(ref => ref.current).filter(Boolean),
    'horizontal'
  );

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Account sections"
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={tabElements[index]}
          role="tab"
          aria-selected={tab.active}
          aria-controls={`panel-${tab.id}`}
          tabIndex={index === 0 ? 0 : -1}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Focus Order
- **Logical sequence**: Tab order follows visual layout
- **Predictable navigation**: Users can predict next focus target
- **Skip unnecessary elements**: Use `tabindex="-1"` for decorative elements

### 2. Focus Indicators
- **High contrast**: 3:1 minimum contrast ratio for focus indicators
- **Clear boundaries**: Focus indicators clearly define focused element
- **Consistent styling**: Same focus style across all interactive elements

### 3. Focus Trapping
- **Modal dialogs**: Trap focus within modal boundaries
- **Escape mechanism**: Always provide way to exit focus trap
- **Return focus**: Restore focus to trigger element after closing

### 4. Dynamic Content
- **Preserve context**: Maintain user's place during updates
- **Announce changes**: Use live regions for content updates
- **Loading states**: Manage focus during async operations

## Testing Checklist

### Keyboard Navigation
- [ ] All interactive elements reachable via keyboard
- [ ] Tab order is logical and predictable
- [ ] Focus indicators are visible and high contrast
- [ ] No keyboard traps (except intentional ones with escape)
- [ ] Skip links work correctly

### Screen Reader Testing
- [ ] Focus changes are announced appropriately
- [ ] Loading states are communicated
- [ ] Error messages are announced
- [ ] Modal open/close is announced
- [ ] Dynamic content updates are announced

### Focus Management
- [ ] Focus returns correctly after modal close
- [ ] Focus is preserved during content updates
- [ ] Form errors focus first invalid field
- [ ] Route changes focus main content
- [ ] Loading states disable interaction appropriately

## Common Issues and Solutions

### Issue: Focus Lost During Updates
**Solution**: Use `FocusableContent` component with `preserveFocus={true}`

### Issue: Modal Focus Not Trapped
**Solution**: Use `useModalFocus` hook with proper container reference

### Issue: Form Errors Not Focused
**Solution**: Use `useFormFocus` hook and call `focusFirstError()` on validation failure

### Issue: Skip Links Not Working
**Solution**: Ensure target elements have proper IDs and are focusable

This comprehensive focus management system ensures your FinTech Banking Platform meets WCAG 2.1 AA standards while providing an excellent user experience for all users, including those using assistive technologies.