import type { LessonManifest } from '../../types'

export const formDynamicFieldsLesson: LessonManifest = {
  id: 'form-dynamic-fields',
  libraryId: 'form',
  topicId: 'form-dynamic-fields',
  title: 'Dynamic Fields: Field Arrays & Repeatable Form Controls',
  description: 'Manage dynamic collections of inputs with field.pushValue, field.removeValue, and array-level constraints.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/arrays',
  learningObjectives: [
    'Declare field arrays using form.Field with mode="array".',
    'Add items dynamically using field.pushValue({ name, role }).',
    'Remove items safely with field.removeValue(index).',
    'Enforce array constraints (e.g. minimum 1 item, maximum 5 items).',
  ],
  conceptSections: [
    {
      title: 'Managing Complex Array State',
      content:
        'Forms frequently require repeatable inputs: inviting team members, adding invoice line items, or listing emergency contacts. TanStack Form provides built-in array methods (pushValue, removeValue, insertValue, swapValues) that manage array indices and reactivity seamlessly.',
    },
    {
      title: 'Nested Field Subscriptions',
      content:
        'Each element within a field array is addressed via indexed paths like members[0].email. Changing one row will not re-render unaffected sibling rows.',
    },
  ],
  importantApis: [
    {
      name: 'field.pushValue(item)',
      signature: 'field.pushValue({ email: "", role: "member" })',
      description: 'Appends a new record to the end of the field array.',
    },
    {
      name: 'field.removeValue(index)',
      signature: 'field.removeValue(index)',
      description: 'Removes the item at the specified index and shifts subsequent elements.',
    },
    {
      name: 'form.Field mode="array"',
      signature: '<form.Field name="items" mode="array">',
      description: 'Enables array-specific helper methods on the field instance.',
    },
  ],
  previewInstructions: 'Click "+ Add Member" to append new invitations. Fill in emails, remove members with the trash icon, and submit to see the collected payload.',
  expectedResult: 'A reactive repeatable team invite form with dynamic row insertion, removal, and array validation.',
  commonMistakes: [
    {
      mistake: 'Directly mutating field.state.value using push() instead of pushValue().',
      fix: 'Always use field.pushValue() and field.removeValue() so the form can trigger reactive updates.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Form optimize rendering performance for large repeatable field arrays?',
      answer:
        'By utilizing path-based sub-field subscriptions (e.g. items[4].name), only the specific row being edited re-renders rather than the entire array container.',
    },
  ],
  example: {
    id: 'example-form-dynamic-fields',
    title: 'Dynamic Team Invitations & Array Controls',
    description: 'Dynamic field arrays with pushValue, removeValue, and array-length validation.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Users, Plus, Trash2, CheckCircle2, UserPlus } from 'lucide-react';

interface MemberItem {
  email: string;
  role: 'DEVELOPER' | 'ADMIN' | 'BILLING';
}

export default function App() {
  const [invitedMembers, setInvitedMembers] = useState<MemberItem[] | null>(null);

  const form = useForm({
    defaultValues: {
      teamName: 'Frontend Core',
      members: [
        { email: 'alex@company.com', role: 'ADMIN' },
        { email: 'sarah@company.com', role: 'DEVELOPER' },
      ] as MemberItem[],
    },
    onSubmit: async ({ value }) => {
      setInvitedMembers(value.members);
    },
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '560px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={20} color="#7c3aed" />
          <span>Dynamic Field Arrays Sandbox</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Add, configure, and remove team members dynamically with array-level rules.
        </p>
      </header>

      {invitedMembers && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '6px', color: '#065f46', fontSize: '13px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <CheckCircle2 size={16} /> Invitations Dispatched!
          </div>
          <div>Successfully sent invites to {invitedMembers.length} team members.</div>
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
        {/* Team Name */}
        <form.Field
          name="teamName"
          validators={{ onChange: ({ value }) => (!value ? 'Team name is required' : undefined) }}
        >
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Team Workspace Name
              </label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
          )}
        </form.Field>

        {/* Dynamic Field Array for Members */}
        <form.Field
          name="members"
          mode="array"
          validators={{
            onChange: ({ value }) => {
              if (!value || value.length === 0) return 'At least 1 member must be included';
              if (value.length > 5) return 'Maximum 5 members per invitation batch';
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Team Members ({field.state.value.length} / 5)
                </label>
                <button
                  type="button"
                  onClick={() => field.pushValue({ email: '', role: 'DEVELOPER' })}
                  disabled={field.state.value.length >= 5}
                  style={{
                    background: field.state.value.length >= 5 ? '#e2e8f0' : '#f5f3ff',
                    color: field.state.value.length >= 5 ? '#94a3b8' : '#7c3aed',
                    border: '1px solid #ddd6fe',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: field.state.value.length >= 5 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={14} /> Add Member
                </button>
              </div>

              {field.state.meta.errors[0] && (
                <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>
                  {field.state.meta.errors[0]}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {field.state.value.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#f8fafc',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#94a3b8', width: '20px' }}>#{index + 1}</span>

                    {/* Email Subfield */}
                    <form.Field
                      name={\`members[\${index}].email\`}
                      validators={{
                        onChange: ({ value }) => {
                          if (!value) return 'Email required';
                          if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) return 'Invalid email';
                          return undefined;
                        },
                      }}
                    >
                      {(subField) => (
                        <div style={{ flex: 1 }}>
                          <input
                            value={subField.state.value}
                            onChange={(e) => subField.handleChange(e.target.value)}
                            placeholder="colleague@domain.com"
                            style={{
                              width: '100%',
                              boxSizing: 'border-box',
                              padding: '6px 10px',
                              fontSize: '13px',
                              borderRadius: '4px',
                              border: \`1px solid \${subField.state.meta.errors.length ? '#ef4444' : '#cbd5e1'}\`,
                            }}
                          />
                        </div>
                      )}
                    </form.Field>

                    {/* Role Subfield */}
                    <form.Field name={\`members[\${index}].role\`}>
                      {(subField) => (
                        <select
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value as any)}
                          style={{ padding: '6px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        >
                          <option value="DEVELOPER">Developer</option>
                          <option value="ADMIN">Admin</option>
                          <option value="BILLING">Billing</option>
                        </select>
                      )}
                    </form.Field>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => field.removeValue(index)}
                      disabled={field.state.value.length <= 1}
                      title="Remove member"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: field.state.value.length <= 1 ? '#cbd5e1' : '#ef4444',
                        cursor: field.state.value.length <= 1 ? 'not-allowed' : 'pointer',
                        padding: '4px',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          style={{ background: '#7c3aed', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginTop: '10px' }}
        >
          Send Invitations
        </button>
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

