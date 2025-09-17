/**
 * Accessible Form Component with Focus and Error Management
 * 
 * @author Adam J Smith <boom.ski@hotmail.com>
 * @copyright 2024 NOIR9 FOUNDATION INC. All rights reserved.
 * @license Commercial License - Proprietary Software
 * @version 1.0.0
 * @created 2025-07-20
 * 
 * Form component with comprehensive accessibility and focus management.
 */

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useFormFocus } from '../../hooks/useFocusManagement';
import { AccessibleButton } from '../ui/AccessibleButton';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  required?: boolean;
  placeholder?: string;
  description?: string;
  validation?: (value: string) => string | null;
}

interface AccessibleFormProps {
  /** Form fields configuration */
  fields: FormField[];
  
  /** Form submission handler */
  onSubmit: (data: Record<string, string>) => Promise<void>;
  
  /** Form title */
  title: string;
  
  /** Form description */
  description?: string;
  
  /** Submit button text */
  submitText?: string;
  
  /** Loading state */
  loading?: boolean;
  
  /** Success message */
  successMessage?: string;
  
  /** Additional CSS classes */
  className?: string;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  fields,
  onSubmit,
  title,
  description,
  submitText = 'Submit',
  loading = false,
  successMessage,
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { formRef, focusFirstError, handleSubmitError } = useFormFocus();

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      return field.validation(value);
    }

    // Basic validation based on type
    switch (field.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'tel':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid phone number';
        }
        break;
      case 'url':
        try {
          if (value) new URL(value);
        } catch {
          return 'Please enter a valid URL';
        }
        break;
    }

    return null;
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleInputBlur = (field: FormField, value: string) => {
    const error = validateField(field, value);
    if (error) {
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const value = formData[field.name] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      handleSubmitError(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      setErrors({});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setErrors({ submit: errorMessage });
      handleSubmitError({ submit: errorMessage });
    }
  };

  if (isSubmitted && successMessage) {
    return (
      <div
        className={`bg-green-500/20 border border-green-500/30 rounded-xl p-6 ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
          <div>
            <h3 className="text-green-300 font-semibold">Success!</h3>
            <p className="text-green-200">{successMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleFormSubmit}
      className={`space-y-6 ${className}`}
      noValidate
      aria-labelledby="form-title"
      aria-describedby={description ? "form-description" : undefined}
    >
      <div className="space-y-2">
        <h2 id="form-title" className="text-2xl font-bold text-white">
          {title}
        </h2>
        {description && (
          <p id="form-description" className="text-gray-300">
            {description}
          </p>
        )}
      </div>

      {/* Global form error */}
      {errors.submit && (
        <div
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field) => {
          const fieldId = `field-${field.name}`;
          const errorId = `error-${field.name}`;
          const descriptionId = `desc-${field.name}`;
          const hasError = !!errors[field.name];

          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={fieldId}
                className="block text-sm font-medium text-gray-300"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-400 ml-1" aria-label="required">*</span>
                )}
              </label>
              
              {field.description && (
                <p id={descriptionId} className="text-xs text-gray-400">
                  {field.description}
                </p>
              )}
              
              <input
                id={fieldId}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                onBlur={(e) => handleInputBlur(field, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                aria-invalid={hasError}
                aria-describedby={`
                  ${field.description ? descriptionId : ''}
                  ${hasError ? errorId : ''}
                `.trim()}
                className={`
                  w-full px-4 py-3 rounded-lg border transition-all duration-200
                  bg-white/10 text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                  ${hasError 
                    ? 'border-red-500/50 focus:ring-red-400 focus:border-red-400' 
                    : 'border-white/20 focus:ring-cyan-400 focus:border-cyan-400'
                  }
                `}
              />
              
              {hasError && (
                <div
                  id={errorId}
                  className="flex items-center space-x-2 text-red-300 text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors[field.name]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AccessibleButton
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Submitting form"
        announceStateChanges={true}
        focusAnnouncement={`Submit ${title.toLowerCase()} form`}
      >
        {submitText}
      </AccessibleButton>
    </form>
  );
};