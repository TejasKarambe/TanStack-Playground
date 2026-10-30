import type { LessonManifest } from '../../types'

export const formDependentFieldsLesson: LessonManifest = {
  id: 'form-dependent-fields',
  libraryId: 'form',
  topicId: 'form-dependent-fields',
  title: 'Dependent Fields: Conditional Visibility & Cross-Field Logic',
  description: 'Synchronize multiple fields, toggle conditional validation requirements, and subscribe to parent field changes.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/dependent-fields',
  learningObjectives: [
    'Subscribe to another field using form.Subscribe with targeted selector.',
    'Toggle visibility and validation requirements based on boolean toggles.',
    'Execute cross-field validation rules (e.g. confirm password, conditional postal codes).',
    'Reset dependent field states when parent options are deselected.',
  ],
  conceptSections: [
    {
      title: 'Targeted Form Subscriptions',
      content:
        'Using <form.Subscribe selector={(state) => state.values.differentShipping}> allows you to conditionally render sections of your form while only triggering re-renders when the selected boolean flag actually toggles.',
    },
    {
      title: 'Conditional Validation Rules',
      content:
        'Validators can read full form values through the validation context or closure, allowing you to validate a field only when its parent prerequisite is satisfied.',
    },
  ],
  importantApis: [
    {
      name: '<form.Subscribe selector={...}>',
      signature: '<form.Subscribe selector={(state) => [state.values.country]}>',
      description: 'Subscribes only to specified values in the form state.',
    },
    {
      name: 'validators.onChange',
      signature: 'onChange: ({ value, fieldApi }) => ...',
      description: 'Evaluates field correctness conditionally against external or sibling field values.',
    },
  ],
  previewInstructions: 'Toggle the "Ship to a different address" checkbox to reveal conditional shipping fields. Change the country between "USA" and "Canada" to observe zip/postal validation changing dynamically.',
  expectedResult: 'A checkout address form with conditional fields and dynamic postal code validation rules.',
  commonMistakes: [
    {
      mistake: 'Subscribing to the entire form state when only one boolean flag is needed.',
      fix: 'Use a specific selector with form.Subscribe: selector={(state) => state.values.differentShipping}.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you perform cross-field validation (such as Password Confirmation) in TanStack Form?',
      answer:
        'Pass the target field into the validator using form values access or subscribe to both fields to re-validate the confirmation field whenever either password changes.',
    },
  ],
  example: {
    id: 'example-form-dependent-fields',
    title: 'Conditional Shipping Address & Cross-Field Validation',
    description: 'Dynamic form sections and conditional validation rules driven by form.Subscribe selectors.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Truck, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  const form = useForm({
    defaultValues: {
      billingCountry: 'USA',
      billingAddress: '',
      billingZip: '',
      differentShipping: false,
      shippingCountry: 'USA',
      shippingAddress: '',
      shippingZip: '',
    },
    onSubmit: async ({ value }) => {
      setSubmittedData(value);
    },
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '540px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={20} color="#059669" />
          <span>Dependent Fields Checkout</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Demonstrating conditional sections and cross-field dynamic validation.
        </p>
      </header>

      {submittedData && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '6px', color: '#065f46', fontSize: '13px', marginBottom: '16px' }}>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <CheckCircle2 size={16} /> Order Address Confirmed!
          </div>
          <div>Billing: {submittedData.billingAddress}, {submittedData.billingZip} ({submittedData.billingCountry})</div>
          {submittedData.differentShipping && (
            <div>Shipping: {submittedData.shippingAddress}, {submittedData.shippingZip} ({submittedData.shippingCountry})</div>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        {/* Billing Address Section */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#334155' }}>Billing Details</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <form.Field name="billingCountry">
              {(field) => (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Country</label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="USA">United States (5 digits)</option>
                    <option value="Canada">Canada (A1A 1A1)</option>
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field
              name="billingZip"
              validators={{
                onChange: ({ value, fieldApi }) => {
                  const country = fieldApi.form.getFieldValue('billingCountry');
                  if (!value) return 'Postal code required';
                  if (country === 'USA' && !/^\\d{5}$/.test(value)) return 'USA ZIP must be 5 digits';
                  if (country === 'Canada' && !/^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$/.test(value)) return 'Invalid Canadian postal code';
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Postal / ZIP</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. 94103"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '6px', border: \`1px solid \${field.state.meta.errors.length ? '#ef4444' : '#cbd5e1'}\`, fontSize: '13px' }}
                  />
                  {field.state.meta.errors[0] && (
                    <span style={{ fontSize: '11px', color: '#ef4444', marginTop: '2px', display: 'block' }}>
                      {field.state.meta.errors[0]}
                    </span>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="billingAddress"
            validators={{ onChange: ({ value }) => (!value ? 'Billing street address is required' : undefined) }}
          >
            {(field) => (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Street Address</label>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="123 Market St, Suite 400"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '6px', border: \`1px solid \${field.state.meta.errors.length ? '#ef4444' : '#cbd5e1'}\`, fontSize: '13px' }}
                />
                {field.state.meta.errors[0] && (
                  <span style={{ fontSize: '11px', color: '#ef4444', marginTop: '2px', display: 'block' }}>
                    {field.state.meta.errors[0]}
                  </span>
                )}
              </div>
            )}
          </form.Field>
        </div>

        {/* Checkbox Toggle for Dependent Shipping Section */}
        <form.Field name="differentShipping">
          {(field) => (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#059669' }}
              />
              <span>Ship to a different physical address</span>
            </label>
          )}
        </form.Field>

        {/* Conditionally Rendered Shipping Section */}
        <form.Subscribe selector={(state) => state.values.differentShipping}>
          {(differentShipping) =>
            differentShipping ? (
              <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} /> Destination Shipping Address
                </h4>

                <form.Field
                  name="shippingAddress"
                  validators={{
                    onChange: ({ value, fieldApi }) => {
                      if (fieldApi.form.getFieldValue('differentShipping') && !value) {
                        return 'Shipping address is required when enabled';
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#065f46' }}>
                        Shipping Street
                      </label>
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="742 Evergreen Terrace"
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', borderRadius: '6px', border: \`1px solid \${field.state.meta.errors.length ? '#ef4444' : '#6ee7b7'}\`, fontSize: '13px' }}
                      />
                      {field.state.meta.errors[0] && (
                        <span style={{ fontSize: '11px', color: '#ef4444', marginTop: '2px', display: 'block' }}>
                          {field.state.meta.errors[0]}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            ) : null
          }
        </form.Subscribe>

        <button
          type="submit"
          style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginTop: '10px' }}
        >
          Complete Order Placement
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

