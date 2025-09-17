/**
 * Modal Component Documentation
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.8.0
 * @created 2025-07-20
 * @updated 2025-07-20
 * 
 * Comprehensive documentation for the Modal component used throughout
 * the FinTech Banking Platform for dialogs, confirmations, and overlays.
 */

# Modal Component

## Overview

The Modal component provides a flexible, accessible dialog implementation for displaying content in an overlay. It supports various sizes, animations, and interaction patterns while maintaining focus management and keyboard navigation.

**Import Path:**
```typescript
import { Modal } from '@/components/ui/Modal';
```

**Dependencies:**
- React 18+
- React DOM (for portals)
- Framer Motion (for animations)
- Lucide React (for close icon)
- Focus Trap React (for accessibility)

## Purpose and Use Cases

### Primary Purpose
Display content in a focused overlay that requires user attention or interaction before continuing with the main application flow.

### Common Use Cases
- Confirmation dialogs (delete account, logout)
- Form dialogs (create account, edit profile)
- Information displays (transaction details, help content)
- Image/media viewers (document preview, photo gallery)
- Multi-step workflows (onboarding, KYC process)
- Error messages and alerts

### When to Use
✅ Content requires immediate user attention
✅ Blocking user interaction with main content
✅ Displaying detailed information without navigation
✅ Confirmation of destructive actions
✅ Multi-step forms or wizards

### When NOT to Use
❌ Simple notifications (use Toast instead)
❌ Persistent UI elements (use Sidebar/Panel)
❌ Navigation menus (use Dropdown/Menu)
❌ Inline editing (use inline forms)

## Props and Parameters

### Interface Definition

```typescript
interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Function to call when modal should close */
  onClose: () => void;
  
  /** Modal title */
  title?: string;
  
  /** Modal size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** Whether to show close button */
  showCloseButton?: boolean;
  
  /** Whether clicking overlay closes modal */
  closeOnOverlayClick?: boolean;
  
  /** Whether pressing Escape closes modal */
  closeOnEscape?: boolean;
  
  /** Whether to trap focus within modal */
  trapFocus?: boolean;
  
  /** Initial focus element selector */
  initialFocus?: string;
  
  /** Return focus element after close */
  returnFocus?: HTMLElement | null;
  
  /** Modal content */
  children: React.ReactNode;
  
  /** Additional CSS classes for modal */
  className?: string;
  
  /** Additional CSS classes for overlay */
  overlayClassName?: string;
  
  /** Animation variant */
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';
  
  /** Custom z-index */
  zIndex?: number;
  
  /** ARIA label for accessibility */
  'aria-label'?: string;
  
  /** ARIA described by */
  'aria-describedby'?: string;
  
  /** Test ID for testing */
  'data-testid'?: string;
  
  /** Callback when modal opens */
  onOpen?: () => void;
  
  /** Callback when modal closes */
  onClosed?: () => void;
  
  /** Whether modal is loading */
  loading?: boolean;
  
  /** Custom header content */
  header?: React.ReactNode;
  
  /** Custom footer content */
  footer?: React.ReactNode;
}
```

### Prop Details

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Controls modal visibility |
| `onClose` | `function` | Yes | - | Called when modal should close |
| `title` | `string` | No | `undefined` | Modal title text |
| `size` | `string` | No | `'md'` | Modal size variant |
| `showCloseButton` | `boolean` | No | `true` | Show X close button |
| `closeOnOverlayClick` | `boolean` | No | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | No | `true` | Close on Escape key |
| `trapFocus` | `boolean` | No | `true` | Trap focus within modal |
| `animation` | `string` | No | `'scale'` | Animation type |
| `children` | `ReactNode` | Yes | - | Modal content |

### Size Options

| Size | Width | Max Width | Use Case |
|------|-------|-----------|----------|
| `xs` | 320px | 90vw | Small confirmations |
| `sm` | 400px | 90vw | Simple forms |
| `md` | 500px | 90vw | Standard dialogs |
| `lg` | 700px | 90vw | Complex forms |
| `xl` | 900px | 95vw | Data tables, detailed content |
| `full` | 100vw | 100vw | Full-screen modals |

### Animation Types

| Animation | Description | Use Case |
|-----------|-------------|----------|
| `fade` | Simple opacity transition | Subtle, non-intrusive |
| `scale` | Scale from center | Standard modal appearance |
| `slide-up` | Slide from bottom | Mobile-friendly |
| `slide-down` | Slide from top | Notifications, alerts |
| `slide-left` | Slide from right | Navigation, sidebars |
| `slide-right` | Slide from left | Navigation, sidebars |

## Usage Examples

### Basic Modal

```tsx
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

function BasicExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Modal"
      >
        <p>This is a basic modal with default settings.</p>
      </Modal>
    </>
  );
}
```

### Confirmation Dialog

```tsx
function ConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleConfirm = () => {
    // Perform destructive action
    deleteAccount();
    setIsOpen(false);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Delete Account"
      size="sm"
      closeOnOverlayClick={false}
      footer={
        <div className="flex space-x-3 justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete Account
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p>Are you sure you want to delete your account?</p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
      </div>
    </Modal>
  );
}
```

### Form Modal

```tsx
function FormModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await submitForm(formData);
      setIsOpen(false);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create New Account"
      size="lg"
      loading={loading}
      initialFocus="#account-name"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="account-name" className="block text-sm font-medium mb-2">
            Account Name
          </label>
          <input
            id="account-name"
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label htmlFor="account-type" className="block text-sm font-medium mb-2">
            Account Type
          </label>
          <select
            id="account-type"
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select type...</option>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="investment">Investment</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading}
          >
            Create Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

### Multi-Step Modal

```tsx
function MultiStepModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <VerificationStep />;
      case 3:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={`Account Setup - Step ${currentStep} of ${totalSteps}`}
      size="lg"
      closeOnOverlayClick={false}
      header={
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      }
      footer={
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <Button
            onClick={currentStep === totalSteps ? handleComplete : nextStep}
          >
            {currentStep === totalSteps ? 'Complete' : 'Next'}
          </Button>
        </div>
      }
    >
      {renderStep()}
    </Modal>
  );
}
```

### Custom Animation

```tsx
function CustomAnimationModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Slide Up Modal"
      animation="slide-up"
      size="md"
    >
      <p>This modal slides up from the bottom, perfect for mobile interfaces.</p>
    </Modal>
  );
}
```

### Full Screen Modal

```tsx
function FullScreenModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Document Viewer"
      size="full"
      animation="fade"
      className="bg-gray-900"
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 p-6">
          {/* Document content */}
          <iframe
            src="/documents/contract.pdf"
            className="w-full h-full border-0"
            title="Contract Document"
          />
        </div>
      </div>
    </Modal>
  );
}
```

## Styling and Theming

### CSS Classes

```css
/* Modal overlay */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4;
}

/* Modal container */
.modal-container {
  @apply bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col;
}

/* Modal header */
.modal-header {
  @apply px-6 py-4 border-b border-gray-200 flex items-center justify-between;
}

/* Modal body */
.modal-body {
  @apply px-6 py-4 flex-1 overflow-y-auto;
}

/* Modal footer */
.modal-footer {
  @apply px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3;
}

/* Size variants */
.modal-xs { @apply max-w-xs; }
.modal-sm { @apply max-w-sm; }
.modal-md { @apply max-w-md; }
.modal-lg { @apply max-w-lg; }
.modal-xl { @apply max-w-4xl; }
.modal-full { @apply max-w-none w-full h-full; }
```

### Dark Mode Support

```css
.modal-container {
  @apply dark:bg-gray-800 dark:border-gray-700;
}

.modal-header {
  @apply dark:border-gray-700;
}

.modal-footer {
  @apply dark:border-gray-700;
}
```

### Custom Theming

```css
:root {
  --modal-overlay-bg: rgba(0, 0, 0, 0.5);
  --modal-bg: white;
  --modal-border: #e5e7eb;
  --modal-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --modal-border-radius: 0.75rem;
}

.modal-container {
  background: var(--modal-bg);
  border-radius: var(--modal-border-radius);
  box-shadow: var(--modal-shadow);
}
```

## Accessibility

### ARIA Attributes

```tsx
// Automatic ARIA attributes
<Modal
  isOpen={true}
  title="Account Settings"
  aria-describedby="modal-description"
>
  <p id="modal-description">
    Update your account preferences and settings.
  </p>
</Modal>

// Renders with:
// role="dialog"
// aria-modal="true"
// aria-labelledby="modal-title"
// aria-describedby="modal-description"
```

### Focus Management

```tsx
function FocusManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  return (
    <>
      <Button 
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
      >
        Open Modal
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Focus Management"
        initialFocus="#first-input"
        returnFocus={triggerRef.current}
        trapFocus={true}
      >
        <input id="first-input" placeholder="This gets focus" />
        <input placeholder="Tab to this input" />
        <Button>Tab to this button</Button>
      </Modal>
    </>
  );
}
```

### Keyboard Navigation

- **Escape**: Closes modal (if `closeOnEscape` is true)
- **Tab**: Cycles through focusable elements within modal
- **Shift+Tab**: Reverse tab order
- **Enter/Space**: Activates focused element

### Screen Reader Support

```tsx
function ScreenReaderSupport() {
  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="Delete Transaction"
      aria-describedby="delete-description"
    >
      <div>
        <p id="delete-description">
          Are you sure you want to delete this transaction? 
          This action cannot be undone.
        </p>
        
        <div className="mt-4" role="group" aria-label="Confirmation actions">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>
    </Modal>
  );
}
```

## Edge Cases and Error Handling

### Loading States

```tsx
function LoadingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Processing Payment"
      loading={loading}
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <span className="ml-3">Processing your payment...</span>
        </div>
      ) : (
        <PaymentForm onSubmit={handlePayment} />
      )}
    </Modal>
  );
}
```

### Error Boundaries

```tsx
function ErrorBoundaryModal() {
  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="Error"
      size="sm"
    >
      <ErrorBoundary
        fallback={
          <div className="text-center py-8">
            <p className="text-red-500">Something went wrong</p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        }
      >
        <ComplexModalContent />
      </ErrorBoundary>
    </Modal>
  );
}
```

### Nested Modals

```tsx
function NestedModals() {
  const [firstModal, setFirstModal] = useState(false);
  const [secondModal, setSecondModal] = useState(false);
  
  return (
    <>
      <Modal
        isOpen={firstModal}
        onClose={() => setFirstModal(false)}
        title="First Modal"
        zIndex={1000}
      >
        <p>This is the first modal.</p>
        <Button onClick={() => setSecondModal(true)}>
          Open Second Modal
        </Button>
      </Modal>
      
      <Modal
        isOpen={secondModal}
        onClose={() => setSecondModal(false)}
        title="Second Modal"
        zIndex={1100}
        size="sm"
      >
        <p>This modal appears on top of the first one.</p>
      </Modal>
    </>
  );
}
```

## Testing

### Unit Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal Component', () => {
  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });
  
  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  
  it('calls onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    await userEvent.click(screen.getByLabelText('Close modal'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('calls onClose when Escape is pressed', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('traps focus within modal', async () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        <input data-testid="first-input" />
        <input data-testid="second-input" />
        <button data-testid="button">Button</button>
      </Modal>
    );
    
    const firstInput = screen.getByTestId('first-input');
    const secondInput = screen.getByTestId('second-input');
    const button = screen.getByTestId('button');
    
    // Tab through elements
    await userEvent.tab();
    expect(firstInput).toHaveFocus();
    
    await userEvent.tab();
    expect(secondInput).toHaveFocus();
    
    await userEvent.tab();
    expect(button).toHaveFocus();
    
    // Should cycle back to first input
    await userEvent.tab();
    expect(firstInput).toHaveFocus();
  });
});
```

### Integration Tests

```typescript
describe('Modal Integration', () => {
  it('handles form submission correctly', async () => {
    const mockSubmit = jest.fn();
    
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Form Modal">
        <form onSubmit={mockSubmit}>
          <input name="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      </Modal>
    );
    
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await userEvent.click(screen.getByText('Submit'));
    
    expect(mockSubmit).toHaveBeenCalled();
  });
  
  it('manages multiple modals correctly', async () => {
    const { rerender } = render(
      <div>
        <Modal isOpen={true} onClose={jest.fn()} title="First Modal">
          <p>First modal content</p>
        </Modal>
        <Modal isOpen={false} onClose={jest.fn()} title="Second Modal">
          <p>Second modal content</p>
        </Modal>
      </div>
    );
    
    expect(screen.getByText('First modal content')).toBeInTheDocument();
    expect(screen.queryByText('Second modal content')).not.toBeInTheDocument();
    
    rerender(
      <div>
        <Modal isOpen={false} onClose={jest.fn()} title="First Modal">
          <p>First modal content</p>
        </Modal>
        <Modal isOpen={true} onClose={jest.fn()} title="Second Modal">
          <p>Second modal content</p>
        </Modal>
      </div>
    );
    
    expect(screen.queryByText('First modal content')).not.toBeInTheDocument();
    expect(screen.getByText('Second modal content')).toBeInTheDocument();
  });
});
```

### Accessibility Tests

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Modal Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={jest.fn()} title="Accessible Modal">
        <p>This modal is accessible</p>
        <button>Action Button</button>
      </Modal>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('has correct ARIA attributes', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={jest.fn()} 
        title="Test Modal"
        aria-describedby="modal-desc"
      >
        <p id="modal-desc">Modal description</p>
      </Modal>
    );
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby');
    expect(modal).toHaveAttribute('aria-describedby', 'modal-desc');
  });
});
```

## Performance Considerations

### Bundle Size Impact
- Base component: ~8KB gzipped
- With animations: ~12KB gzipped
- Focus trap adds ~3KB gzipped

### Rendering Performance
- Uses React Portal for optimal rendering
- Lazy loading for modal content
- Efficient animation with Framer Motion

### Memory Management
```tsx
// Proper cleanup example
function OptimizedModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Clean up event listeners
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  
  // Only render when needed
  if (!isOpen) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ExpensiveModalContent />
    </Modal>
  );
}
```

## Migration and Changelog

### Version 1.8.0 (Current)
- ✅ Added `loading` prop for loading states
- ✅ Improved animation performance
- ✅ Enhanced focus management
- ✅ Added custom header/footer support

### Version 1.7.0
- ✅ Added multi-step modal support
- ✅ Improved accessibility compliance
- ✅ Added animation variants
- 🔧 Fixed focus trap edge cases

### Version 1.6.0
- 🔄 **BREAKING**: Renamed `visible` prop to `isOpen`
- ✅ Added size variants
- ✅ Improved mobile responsiveness
- ✅ Added portal rendering

### Migration from v1.5.x

```tsx
// Before (v1.5.x)
<Modal visible={true} onCancel={handleClose}>
  Content
</Modal>

// After (v1.6.x+)
<Modal isOpen={true} onClose={handleClose}>
  Content
</Modal>
```

## Related Components

- **Dialog**: For simple confirmation dialogs
- **Drawer**: For side panel overlays
- **Popover**: For contextual content
- **Toast**: For non-blocking notifications

## Support and Feedback

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join #ui-components on Slack
- **Feature Requests**: Submit via GitHub Discussions
- **Documentation**: Contribute via pull requests