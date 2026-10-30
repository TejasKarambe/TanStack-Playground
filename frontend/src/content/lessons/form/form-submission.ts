import type { LessonManifest } from '../../types'

export const formSubmissionLesson: LessonManifest = {
  id: 'form-submission',
  libraryId: 'form',
  topicId: 'form-submission',
  title: 'Form Submission: Async Handling, Spinners & Feedback',
  description: 'Coordinate asynchronous form submission, canSubmit guards, isSubmitting states, and post-submission resets.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/submission',
  learningObjectives: [
    'Define the onSubmit handler with typed values parameter.',
    'Subscribe to state.canSubmit and state.isSubmitting using form.Subscribe.',
    'Reset form state back to defaults with form.reset().',
    'Display post-submission confirmation cards with submission payloads.',
  ],
  conceptSections: [
    {
      title: 'The Submission Lifecycle',
      content:
        'When form.handleSubmit() is called: 1) It executes all onSubmit validators. 2) If validation fails, submission halts and errors display. 3) If validation passes, isSubmitting becomes true. 4) The onSubmit async function runs. 5) Upon completion, isSubmitting resets to false.',
    },
    {
      title: 'form.Subscribe Granularity',
      content:
        'Rather than re-rendering the whole form when submission begins, form.Subscribe lets you subscribe only the submit button and status banner to state.isSubmitting and state.canSubmit.',
    },
  ],
  importantApis: [
    {
      name: 'form.handleSubmit()',
      signature: 'onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}',
      description: 'Triggers the validation and submission pipeline.',
    },
    {
      name: 'form.reset()',
      signature: 'form.reset()',
      description: 'Restores defaultValues and resets all validation and touched flags.',
    },
  ],
  previewInstructions: 'Fill in the issue report title and description, then click "Submit Bug Report". Observe the loading spinner and subsequent success receipt.',
  expectedResult: 'A bug reporting form with disabled button states while submitting, followed by a formatted success receipt.',
  commonMistakes: [
    {
      mistake: 'Forgetting e.preventDefault() and e.stopPropagation() in form onSubmit.',
      fix: 'Always prevent native browser page submission so the client pipeline executes cleanly.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you prevent duplicate submissions if a user rapidly double-clicks the submit button?',
      answer:
        'TanStack Form automatically manages state.isSubmitting and state.canSubmit. Disabling the submit button when isSubmitting is true prevents double clicks.',
    },
  ],
  example: {
    id: 'form-submission-example',
    title: 'Async Submission & State Reset',
    description: 'Submit issue ticket, observe progress spinner, and reset form.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-form': '^1.33.5',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Bug, CheckCircle2, RotateCcw, Send, Loader2 } from 'lucide-react';

interface TicketData {
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export default function App() {
  const [submittedTicket, setSubmittedTicket] = useState<TicketData | null>(null);

  const form = useForm({
    defaultValues: {
      title: '',
      severity: 'medium' as const,
      description: '',
    },
    onSubmit: async ({ value }) => {
      // Simulate remote API call
      await new Promise((r) => setTimeout(r, 800));
      setSubmittedTicket(value);
      form.reset();
    },
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bug size={20} color="#dc2626" />
          Bug Tracking Desk
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
          Asynchronous submission coordination
        </p>
      </header>

      {submittedTicket && (
        <div style={{ padding: '14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065f46', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
            <CheckCircle2 size={16} />
            Ticket Created Successfully!
          </div>
          <div style={{ fontSize: '12px', color: '#047857' }}>
            Title: <strong>{submittedTicket.title}</strong> • Severity: <strong>{submittedTicket.severity.toUpperCase()}</strong>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        style={{ display: 'grid', gap: '14px', maxWidth: '440px' }}
      >
        {/* Ticket Title */}
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) => (!value.trim() ? 'Issue title is required' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                Issue Title
              </label>
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Memory leak in query cache..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          )}
        </form.Field>

        {/* Severity */}
        <form.Field name="severity">
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                Severity
              </label>
              <select
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              >
                <option value="low">Low - Minor cosmetic flaw</option>
                <option value="medium">Medium - Functional glitch</option>
                <option value="high">High - Production blocker</option>
              </select>
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) => (value.length < 10 ? 'Description must be at least 10 characters' : undefined),
          }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                Description & Reproduction Steps
              </label>
              <textarea
                rows={3}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Provide details on how to reproduce the bug..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>
          )}
        </form.Field>

        {/* Action Buttons */}
        <form.Subscribe
          selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
        >
          {({ canSubmit, isSubmitting }) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: canSubmit ? '#dc2626' : '#cbd5e1',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting Ticket...
                  </>
                ) : (
                  <>
                    <Send size={15} /> Submit Bug Report
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => form.reset()}
                disabled={isSubmitting}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#fff',
                  color: '#475569',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
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

