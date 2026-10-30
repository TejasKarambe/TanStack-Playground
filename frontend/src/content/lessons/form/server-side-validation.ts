import type { LessonManifest } from '../../types'

export const formServerSideValidationLesson: LessonManifest = {
  id: 'form-server-side-validation',
  libraryId: 'form',
  topicId: 'form-server-validation',
  title: 'Server-Side Validation: HTTP 422 Field Error Mapping',
  description: 'Map backend validation errors (such as Bean Validation or JSON schemas) directly back to reactive form fields.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/form/latest/docs/guide/submission#handling-server-side-errors',
  learningObjectives: [
    'Capture HTTP 422 Unprocessable Entity responses during form submission.',
    'Map backend field error arrays to TanStack Form error maps.',
    'Display server errors beside client-side validation errors.',
    'Clear server error states as soon as the user edits the rejected field.',
  ],
  conceptSections: [
    {
      title: 'Connecting Backend Validation with Client Forms',
      content:
        'Even with rich client-side checks, critical validations (duplicate database keys, credit card declines, expired promo codes) can only happen on the server. When the server rejects a payload with field-level details, TanStack Form allows you to inject those errors directly into the target field states.',
    },
    {
      title: 'Reconciling Server and Client Errors',
      content:
        'Setting field error maps via onSubmit error handling ensures that form submission errors behave identically to client-side validation errors: fields turn red, display actionable explanations, and automatically clear when re-edited.',
    },
  ],
  importantApis: [
    {
      name: 'field.setErrorMap()',
      signature: 'field.setErrorMap({ onSubmit: "Invalid Promo Code" })',
      description: 'Assigns an error message to a specific validation trigger phase.',
    },
    {
      name: 'form.setErrorMap()',
      signature: 'form.setErrorMap({ onSubmit: "Form-wide submission failure" })',
      description: 'Sets a top-level error on the overall form.',
    },
  ],
  previewInstructions: 'Try submitting with promo code "SUMMER2026" (simulates an expired coupon) or VAT "INVALID" to see the simulated Spring Boot backend return HTTP 422 and map errors directly to fields.',
  expectedResult: 'A checkout form that displays realistic server rejection feedback mapped to individual inputs.',
  commonMistakes: [
    {
      mistake: 'Clearing the entire form state when the backend returns a 422 error.',
      fix: 'Retain all user inputs and attach the returned error messages to their respective fields.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Form differentiate between onSubmit errors and onChange validation errors?',
      answer:
        'TanStack Form uses error maps categorized by lifecycle triggers: { onChange: [...], onBlur: [...], onSubmit: [...] }. This prevents backend onSubmit errors from being prematurely overwritten until the user types again.',
    },
  ],
  example: {
    id: 'example-form-server-validation',
    title: 'Backend 422 Unprocessable Entity Field Mapping',
    description: 'Simulating Spring Boot REST API error responses and binding them to reactive field error states.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Server, AlertTriangle, CheckCircle2, Loader2, Tag, FileText } from 'lucide-react';

export default function App() {
  const [serverLog, setServerLog] = useState<{ status: number; message: string; timestamp: string } | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      companyName: 'Acme Technologies',
      taxId: 'US-991203',
      promoCode: 'SUMMER2026',
    },
    onSubmit: async ({ value }) => {
      setServerLog({
        status: 102,
        message: 'POST /api/v1/billing/checkout -> Validating payload with Spring Boot...',
        timestamp: new Date().toLocaleTimeString(),
      });

      // Simulate remote backend execution
      await new Promise((r) => setTimeout(r, 700));

      const serverErrors: Record<string, string> = {};

      if (value.promoCode.toUpperCase() === 'SUMMER2026') {
        serverErrors.promoCode = 'Promo code SUMMER2026 expired on September 30, 2026.';
      }
      if (value.taxId.toUpperCase().includes('INVALID')) {
        serverErrors.taxId = 'Tax ID failed VIES verification with tax authority.';
      }

      if (Object.keys(serverErrors).length > 0) {
        setServerLog({
          status: 422,
          message: \`HTTP 422 Unprocessable Entity: \${Object.values(serverErrors).join(', ')}\`,
          timestamp: new Date().toLocaleTimeString(),
        });
        setSuccess(false);

        // Map server errors directly to individual fields
        if (serverErrors.promoCode) {
          form.setFieldMeta('promoCode', (prev) => ({
            ...prev,
            errorMap: { ...prev.errorMap, onSubmit: serverErrors.promoCode },
          }));
        }
        if (serverErrors.taxId) {
          form.setFieldMeta('taxId', (prev) => ({
            ...prev,
            errorMap: { ...prev.errorMap, onSubmit: serverErrors.taxId },
          }));
        }
        return;
      }

      setServerLog({
        status: 200,
        message: 'HTTP 200 OK: Invoice generated and order processed.',
        timestamp: new Date().toLocaleTimeString(),
      });
      setSuccess(true);
    },
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '540px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={20} color="#dc2626" />
          <span>Server Error Mapping Sandbox</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Trigger server rejection by submitting <code>SUMMER2026</code> or Tax ID containing <code>INVALID</code>.
        </p>
      </header>

      {/* Simulated Server Console */}
      {serverLog && (
        <div style={{ background: serverLog.status === 200 ? '#f0fdf4' : serverLog.status === 422 ? '#fef2f2' : '#f8fafc', border: \`1px solid \${serverLog.status === 200 ? '#bbf7d0' : serverLog.status === 422 ? '#fecaca' : '#e2e8f0'}\`, padding: '12px', borderRadius: '6px', fontSize: '12px', fontFamily: 'monospace', marginBottom: '16px' }}>
          <div style={{ fontWeight: 700, color: serverLog.status === 200 ? '#166534' : serverLog.status === 422 ? '#991b1b' : '#334155' }}>
            [{serverLog.timestamp}] Status: {serverLog.status}
          </div>
          <div style={{ color: '#475569', marginTop: '2px' }}>{serverLog.message}</div>
        </div>
      )}

      {success && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px', borderRadius: '6px', color: '#065f46', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> Order confirmed with valid credentials!
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
        {/* Company Name */}
        <form.Field name="companyName">
          {(field) => (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Legal Business Name
              </label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
          )}
        </form.Field>

        {/* Tax ID */}
        <form.Field name="taxId">
          {(field) => {
            const error = field.state.meta.errors[0];
            return (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Tax Identification Number (VAT/EIN)
                </label>
                <input
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    // Clear onSubmit error as soon as user edits
                    if (field.state.meta.errorMap.onSubmit) {
                      field.setErrorMap({ onSubmit: undefined });
                    }
                  }}
                  placeholder="e.g. US-123456 (or type INVALID)"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: \`1px solid \${error ? '#ef4444' : '#cbd5e1'}\` }}
                />
                {error && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {error}
                  </span>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Promo Code */}
        <form.Field name="promoCode">
          {(field) => {
            const error = field.state.meta.errors[0];
            return (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Coupon / Promo Code
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      if (field.state.meta.errorMap.onSubmit) {
                        field.setErrorMap({ onSubmit: undefined });
                      }
                    }}
                    placeholder="e.g. SUMMER2026 or SAVE10"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', fontSize: '14px', borderRadius: '6px', border: \`1px solid \${error ? '#ef4444' : '#cbd5e1'}\` }}
                  />
                </div>
                {error && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>
                    {error}
                  </span>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? '#94a3b8' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
              }}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              <span>{isSubmitting ? 'Verifying with Backend...' : 'Submit Checkout'}</span>
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

