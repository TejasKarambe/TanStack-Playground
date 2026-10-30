import type { LessonManifest } from '../../types'

export const formBasicFormLesson: LessonManifest = {
  id: 'form-basic-form',
  libraryId: 'form',
  topicId: 'form-basics',
  title: 'Basic Form: Reactive Form State & Field Subscriptions',
  description: 'Bind reactive form state using useForm and form.Field with fine-grained subscription reactivity.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/overview',
  learningObjectives: [
    'Initialize form state using the useForm hook.',
    'Bind fields with form.Field and access field.state.value and field.handleChange.',
    'Understand fine-grained subscription reactivity (only touched fields re-render).',
    'Render live form state debug views.',
  ],
  conceptSections: [
    {
      title: 'Fine-Grained Reactivity',
      content:
        'In traditional React forms, typing a character into one text input re-renders the entire parent form component. TanStack Form decouples field subscriptions so that typing in field A only re-renders field A. Even in massive forms with 100+ inputs, typing stays 100% fluid at 60 FPS.',
    },
    {
      title: 'Headless Form Controls',
      content:
        'form.Field provides a render prop pattern exposing field.name, field.state.value, field.handleChange, and field.handleBlur. You are free to render native inputs, custom select pickers, or third-party UI widgets.',
    },
  ],
  importantApis: [
    {
      name: 'useForm(options)',
      signature: 'useForm({ defaultValues, onSubmit })',
      description: 'Creates a headless form controller instance.',
    },
    {
      name: '<form.Field name="...">',
      signature: '<form.Field name="fieldName">{(field) => <input ... />}</form.Field>',
      description: 'Isolates rendering to the specific field subscription.',
    },
    {
      name: 'field.handleChange(value)',
      signature: 'onChange={(e) => field.handleChange(e.target.value)}',
      description: 'Updates field state reactively.',
    },
  ],
  previewInstructions: 'Type into the "Full Name" and "Email" fields. Look at the live JSON state viewer below to see values updating reactively.',
  expectedResult: 'A clean reactive registration form with real-time JSON state synchronization.',
  commonMistakes: [
    {
      mistake: 'Passing an event object directly to field.handleChange(e).',
      fix: 'field.handleChange expects the raw value, e.g. field.handleChange(e.target.value).',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Form prevent full form re-renders on keystrokes?',
      answer:
        'TanStack Form uses an internal standalone reactive store. form.Field components act as isolated subscribers that only trigger local re-renders when their specific field slice changes.',
    },
  ],
  example: {
    id: 'form-basic-form-example',
    title: 'Reactive Form State with form.Field',
    description: 'Bind inputs with fine-grained subscription reactivity and inspect form state.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-form': '^1.33.5',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React from 'react';
import { useForm } from '@tanstack/react-form';
import { CheckSquare, User, Mail, Send } from 'lucide-react';

export default function App() {
  const form = useForm({
    defaultValues: {
      fullName: 'Tanner Linsley',
      email: 'tanner@tanstack.com',
      newsletter: true,
    },
    onSubmit: async ({ value }) => {
      alert('Form submitted with:\\n' + JSON.stringify(value, null, 2));
    },
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckSquare size={20} color="#f59e0b" />
          Developer Profile
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
          Reactive state managed with <code>@tanstack/react-form</code>
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        style={{ display: 'grid', gap: '14px', maxWidth: '420px', marginBottom: '20px' }}
      >
        {/* Full Name Field */}
        <form.Field name="fullName">
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}
        </form.Field>

        {/* Email Field */}
        <form.Field name="email">
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          )}
        </form.Field>

        {/* Newsletter Checkbox */}
        <form.Field name="newsletter">
          {(field) => (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#334155' }}>
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
              />
              Subscribe to TanStack release bulletins
            </label>
          )}
        </form.Field>

        <button
          type="submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#f59e0b',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <Send size={15} /> Save Profile
        </button>
      </form>

      {/* Live Form State Inspector */}
      <form.Subscribe
        selector={(state) => ({ values: state.values, isDirty: state.isDirty })}
      >
        {({ values, isDirty }) => (
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
              <span>Live Form State</span>
              <span>{isDirty ? '• Modified' : 'Pristine'}</span>
            </div>
            <pre style={{ margin: 0, fontSize: '11px', color: '#0f172a' }}>
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        )}
      </form.Subscribe>
    </div>
  );
}
`,
      },
    },
  },
}

