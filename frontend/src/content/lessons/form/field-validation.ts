import type { LessonManifest } from '../../types'

export const formFieldValidationLesson: LessonManifest = {
  id: 'form-field-validation',
  libraryId: 'form',
  topicId: 'form-validation',
  title: 'Field Validation: Synchronous & Asynchronous Error Rules',
  description: 'Enforce synchronous and asynchronous validation constraints with field-level error messages.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/validation',
  learningObjectives: [
    'Configure field validators: onChange, onBlur, and onSubmit.',
    'Render field.state.meta.errors when touched.',
    'Implement asynchronous username availability validation.',
    'Disable form submission when validation errors exist.',
  ],
  conceptSections: [
    {
      title: 'Validation Timing',
      content:
        'TanStack Form supports validating at three distinct user events: onChange (e.g. typing characters), onBlur (e.g. user leaves the field), and onSubmit (when the user attempts to submit). This provides maximum flexibility for user experience.',
    },
    {
      title: 'Field Metadata (field.state.meta)',
      content:
        'field.state.meta tracks critical interaction flags: isTouched, isDirty, isValidating, and errors. Showing errors only when field.state.meta.isTouched is true prevents jarring error flashes before the user has even finished interacting with the field.',
    },
  ],
  importantApis: [
    {
      name: 'validators: { onChange, onBlur }',
      signature: 'validators: { onChange: ({ value }) => string | undefined }',
      description: 'Declarative validator functions that return an error string or undefined on valid input.',
    },
    {
      name: 'field.state.meta.errors',
      signature: 'field.state.meta.errors: ValidationError[]',
      description: 'Array of active error messages associated with the field.',
    },
  ],
  previewInstructions: 'Try submitting the form with an empty username or password shorter than 8 characters. Observe the red validation messages appearing.',
  expectedResult: 'A validated sign-up form with real-time error messages and disabled submit state when invalid.',
  commonMistakes: [
    {
      mistake: 'Displaying errors before the user has touched the field.',
      fix: 'Always check field.state.meta.isTouched before rendering field.state.meta.errors.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you perform async validation (e.g. checking if an email is taken)?',
      answer:
        'Supply an async function to validators.onChangeAsync or validators.onBlurAsync. The field will set isValidating: true while the async check resolves, allowing you to show a loading spinner beside the field.',
    },
  ],
  example: {
    id: 'form-field-validation-example',
    title: 'Synchronous & Async Validation Rules',
    description: 'Username availability check and password length validation.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-form': '^1.33.5',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React from 'react';
import { useForm } from '@tanstack/react-form';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      alert('Account verified and created for: ' + value.username);
    },
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#10b981" />
          Secure Account Creation
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
          Real-time field validation with TanStack Form
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        style={{ display: 'grid', gap: '16px', maxWidth: '420px' }}
      >
        {/* Username with Async Validation */}
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Username is required';
              if (value.length < 3) return 'Must be at least 3 characters';
              return undefined;
            },
            onChangeAsync: async ({ value }) => {
              await new Promise((r) => setTimeout(r, 400));
              if (value?.toLowerCase() === 'admin' || value?.toLowerCase() === 'root') {
                return 'Username "' + value + '" is reserved and cannot be claimed.';
              }
              return undefined;
            },
          }}
        >
          {(field) => {
            const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                  Choose Username
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. tanner_dev"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: hasError ? '#ef4444' : '#cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                  {field.state.meta.isValidating && (
                    <Loader2 size={15} color="#94a3b8" style={{ position: 'absolute', right: '10px', top: '10px', animation: 'spin 1s linear infinite' }} />
                  )}
                </div>

                {hasError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                    <AlertCircle size={13} />
                    <span>{field.state.meta.errors.join(', ')}</span>
                  </div>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Password with Length Check */}
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Password is required';
              if (value.length < 8) return 'Password must be at least 8 characters';
              if (!/[0-9]/.test(value)) return 'Must contain at least one number';
              return undefined;
            },
          }}
        >
          {(field) => {
            const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Min 8 chars, 1 number..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: hasError ? '#ef4444' : '#cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />

                {hasError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                    <AlertCircle size={13} />
                    <span>{field.state.meta.errors.join(', ')}</span>
                  </div>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
        >
          {({ canSubmit, isSubmitting }) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                border: 'none',
                background: canSubmit ? '#10b981' : '#cbd5e1',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
              }}
            >
              {isSubmitting ? 'Validating...' : 'Create Account'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
`,
      },
    },
  },
}

