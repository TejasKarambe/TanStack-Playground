import type { LessonManifest } from '../../types'

export const formAsyncValidationLesson: LessonManifest = {
  id: 'form-async-validation',
  libraryId: 'form',
  topicId: 'form-async-validation',
  title: 'Async Validation: Debounced Remote Uniqueness Checks',
  description: 'Validate field values against backend services with built-in debouncing, async validators, and loading indicators.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/validation#async-validation',
  learningObjectives: [
    'Define asynchronous validators with onChangeAsync and onBlurAsync.',
    'Configure asyncDebounceMs to prevent flooding backend APIs on every keystroke.',
    'Render loading spinners using field.state.meta.isValidating.',
    'Display async validation error messages alongside synchronous validation.',
  ],
  conceptSections: [
    {
      title: 'Debounced Asynchronous Verification',
      content:
        'When checking if a username or company subdomain is already taken, sending HTTP requests on every keystroke leads to rate limits and out-of-order race conditions. TanStack Form provides built-in asyncDebounceMs (e.g. 500ms), automatically cancelling in-flight validation when the user types again.',
    },
    {
      title: 'The isValidating State',
      content:
        'field.state.meta.isValidating is a boolean that indicates an async validator is currently awaiting a promise resolution. This lets you show subtle spinning indicators directly inside the input wrapper.',
    },
  ],
  importantApis: [
    {
      name: 'validators.onChangeAsync',
      signature: 'onChangeAsync: async ({ value }) => string | undefined',
      description: 'Asynchronous validation function executed after debounce delay.',
    },
    {
      name: 'asyncDebounceMs',
      signature: 'asyncDebounceMs: 500',
      description: 'Milliseconds to wait after typing stops before executing async validators.',
    },
    {
      name: 'field.state.meta.isValidating',
      signature: 'boolean',
      description: 'True while an async validator is actively in progress.',
    },
  ],
  previewInstructions: 'Type "admin", "tanstack", or "google" into the username field to see the async validator reject reserved names after a 500ms delay. Type "alex" to see it accept the input.',
  expectedResult: 'A field that shows a spinner while checking availability, then shows either an error or a green checkmark.',
  commonMistakes: [
    {
      mistake: 'Forgetting to set asyncDebounceMs when using onChangeAsync.',
      fix: 'Always provide an asyncDebounceMs (e.g. 400-600ms) to avoid executing network requests on every keystroke.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Form prevent stale validation responses when async checks resolve out-of-order?',
      answer:
        'TanStack Form tags each async validation request with a monotonically increasing execution ID and discards results from earlier executions if the field value has since changed.',
    },
  ],
  example: {
    id: 'example-form-async-validation',
    title: 'Username & Subdomain Availability Checker',
    description: 'Demonstrating onChangeAsync, 500ms debouncing, and isValidating state indicators.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Loader2, CheckCircle2, AlertCircle, Globe, Shield } from 'lucide-react';

// Simulated database of taken identifiers
const takenHandles = ['admin', 'tanstack', 'google', 'root', 'support', 'billing'];

export default function App() {
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: '',
      organization: '',
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 600));
      setSubmissionSuccess(\`Organization workspace "\${value.organization}.tanstack.app" reserved for @\${value.username}!\`);
    },
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '520px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={20} color="#2563eb" />
          <span>Async Validation Sandbox</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Reserved handles: <code>admin</code>, <code>tanstack</code>, <code>google</code>, <code>root</code>
        </p>
      </header>

      {submissionSuccess && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '6px', color: '#065f46', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          <span>{submissionSuccess}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {/* Username Field with Async Availability Check */}
        <form.Field
          name="username"
          asyncDebounceMs={500}
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Username is required';
              if (value.length < 3) return 'Username must be at least 3 characters';
              if (!/^[a-z0-9_-]+$/i.test(value)) return 'Only alphanumeric, underscores, and dashes allowed';
              return undefined;
            },
            onChangeAsync: async ({ value }) => {
              // Simulated server check with 600ms latency
              await new Promise((resolve) => setTimeout(resolve, 600));
              if (takenHandles.includes(value?.toLowerCase())) {
                return \`The handle "@\${value}" is already registered by another account.\`;
              }
              return undefined;
            },
          }}
        >
          {(field) => {
            const hasError = field.state.meta.errors.length > 0;
            const isValidating = field.state.meta.isValidating;
            const isSuccess = !hasError && !isValidating && field.state.value.length >= 3;

            return (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Account Username
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. tejas"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 36px 10px 12px',
                      fontSize: '14px',
                      borderRadius: '6px',
                      border: \`1px solid \${hasError ? '#ef4444' : isSuccess ? '#10b981' : '#cbd5e1'}\`,
                      outline: 'none',
                    }}
                  />
                  <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                    {isValidating && <Loader2 size={16} className="animate-spin" color="#64748b" />}
                    {isSuccess && <CheckCircle2 size={16} color="#10b981" />}
                    {hasError && !isValidating && <AlertCircle size={16} color="#ef4444" />}
                  </div>
                </div>

                {isValidating && (
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Checking server registry availability...
                  </span>
                )}

                {hasError && !isValidating && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
                {isSuccess && (
                  <span style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', display: 'block' }}>
                    ✓ Handle @{field.state.value} is available!
                  </span>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Organization Subdomain */}
        <form.Field
          name="organization"
          validators={{
            onChange: ({ value }) => (!value ? 'Organization name is required' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Organization Name
              </label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="e.g. Acme Corp"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 12px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                }}
              />
              {field.state.meta.errors.length > 0 && (
                <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Submit Button */}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              style={{
                background: canSubmit && !isSubmitting ? '#2563eb' : '#94a3b8',
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: canSubmit && !isSubmitting ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
              }}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              <span>{isSubmitting ? 'Reserving...' : 'Create Workspace'}</span>
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
    dependencies: {
      '@tanstack/react-form': '^1.33.5',
      'lucide-react': '^1.65.0',
    },
  },
}

