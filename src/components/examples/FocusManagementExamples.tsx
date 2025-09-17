/**
 * Focus Management Examples and Demonstrations
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Examples demonstrating proper focus management techniques.
 */

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { AccessibleModal } from '../ui/AccessibleModal';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleForm } from '../forms/AccessibleForm';
import { FocusableContent } from '../ui/FocusableContent';
import { useRovingTabindex, useAutoFocus } from '../../hooks/useFocusManagement';

export const FocusManagementExamples: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dynamicContent, setDynamicContent] = useState('Initial content');
  const [loading, setLoading] = useState(false);

  // Example: Modal with focus management
  const ModalExample = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Modal Focus Management</h3>
      <p className="text-gray-300">
        Demonstrates proper focus trapping and restoration in modal dialogs.
      </p>
      
      <AccessibleButton
        onClick={() => setIsModalOpen(true)}
        variant="primary"
        focusAnnouncement="Open settings modal"
      >
        Open Settings Modal
      </AccessibleButton>

      <AccessibleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Account Settings"
        initialFocus="#settings-name"
        aria-describedby="settings-description"
      >
        <div id="settings-description" className="space-y-4">
          <p className="text-gray-300">
            Update your account preferences and settings.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="settings-name" className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                id="settings-name"
                type="text"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter your display name"
              />
            </div>
            
            <div>
              <label htmlFor="settings-email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Notifications
              </label>
              <select
                id="settings-email"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="all">All notifications</option>
                <option value="important">Important only</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <AccessibleButton
            variant="outline"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </AccessibleButton>
          <AccessibleButton
            variant="primary"
            onClick={() => {
              setIsModalOpen(false);
              // Focus would automatically return to the trigger button
            }}
          >
            Save Settings
          </AccessibleButton>
        </div>
      </AccessibleModal>
    </div>
  );

  // Example: Roving tabindex for toolbar
  const ToolbarExample = () => {
    const toolbarItems = [
      { id: 'add', label: 'Add Item', icon: Plus },
      { id: 'edit', label: 'Edit Item', icon: Edit },
      { id: 'delete', label: 'Delete Item', icon: Trash2 },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const toolbarElements = toolbarItems.map(() => React.createRef<HTMLButtonElement>());
    const containerRef = useRovingTabindex(
      toolbarElements.map(ref => ref.current!).filter(Boolean),
      'horizontal'
    );

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Roving Tabindex Toolbar</h3>
        <p className="text-gray-300">
          Use arrow keys to navigate between toolbar buttons.
        </p>
        
        <div
          ref={containerRef}
          className="flex space-x-2 p-2 bg-white/10 rounded-lg"
          role="toolbar"
          aria-label="Content management toolbar"
        >
          {toolbarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                ref={toolbarElements[index]}
                className="p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Example: Dynamic content updates
  const DynamicContentExample = () => {
    const updateContent = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDynamicContent(`Updated content at ${new Date().toLocaleTimeString()}`);
      setLoading(false);
    };

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Dynamic Content Focus</h3>
        <p className="text-gray-300">
          Demonstrates focus preservation during content updates.
        </p>
        
        <AccessibleButton
          onClick={updateContent}
          variant="outline"
          loading={loading}
          loadingText="Updating content"
        >
          Update Content
        </AccessibleButton>

        <FocusableContent
          preserveFocus={true}
          announceChanges={true}
          updateMessage="Content has been updated"
          loading={loading}
          className="p-4 bg-white/10 rounded-lg border border-white/20"
        >
          <p className="text-white">{dynamicContent}</p>
          <AccessibleButton
            variant="ghost"
            size="sm"
            className="mt-2"
          >
            Focusable Element
          </AccessibleButton>
        </FocusableContent>
      </div>
    );
  };

  // Example: Form with error focus management
  const FormExample = () => {
    const formFields = [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email' as const,
        required: true,
        placeholder: 'Enter your email',
        description: 'We\'ll use this to send you important updates'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password' as const,
        required: true,
        placeholder: 'Enter a secure password',
        validation: (value: string) => {
          if (value.length < 8) return 'Password must be at least 8 characters';
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return 'Password must contain uppercase, lowercase, and number';
          }
          return null;
        }
      }
    ];

    const handleFormSubmit = async (data: Record<string, string>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
    };

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Form Focus Management</h3>
        <p className="text-gray-300">
          Demonstrates focus management for form validation errors.
        </p>
        
        <AccessibleForm
          fields={formFields}
          onSubmit={handleFormSubmit}
          title="Create Account"
          description="Fill out the form below to create your account"
          submitText="Create Account"
          successMessage="Account created successfully! You can now sign in."
          className="max-w-md"
        />
      </div>
    );
  };

  return (
    <div className="space-y-12 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Focus Management Examples</h1>
        <p className="text-gray-300 text-lg">
          Comprehensive examples of accessible focus management techniques for WCAG 2.1 compliance.
        </p>
      </div>

      <ModalExample />
      <ToolbarExample />
      <DynamicContentExample />
      <FormExample />
    </div>
  );
};