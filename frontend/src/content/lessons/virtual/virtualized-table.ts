import type { LessonManifest } from '../../types'

export const virtualTableLesson: LessonManifest = {
  id: 'virtual-table',
  libraryId: 'virtual',
  topicId: 'virtual-table',
  title: 'Virtualized Table: High-Speed Grid with Sticky Headers',
  description: 'Construct a virtualized HTML table using useVirtualizer with sticky column headers and zero cell misalignments.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/introduction',
  learningObjectives: [
    'Virtualize an HTML <table> or CSS table layout using useVirtualizer.',
    'Implement sticky <thead> column headers that stay anchored while rows scroll.',
    'Align table column widths consistently across virtualized rows.',
    'Combine table sorting with dynamic row virtualization.',
  ],
  conceptSections: [
    {
      title: 'HTML Table vs Div Layouts',
      content:
        'Standard HTML <tr> tags do not support absolute positioning or transform translateY directly without breaking table layout algorithms. Setting display: block or flex on the table body or using div-based table grids allows useVirtualizer transforms to position rows reliably.',
    },
    {
      title: 'Sticky Headers in Virtual Tables',
      content:
        'By keeping the header row outside the virtual scroll container (or styled with position: sticky, top: 0, z-index: 10), column headers remain permanently visible as thousands of rows scroll underneath.',
    },
  ],
  importantApis: [
    {
      name: 'virtualizer.getVirtualItems()',
      signature: 'const virtualRows = virtualizer.getVirtualItems()',
      description: 'Supplies the current window of table rows to be rendered.',
    },
  ],
  previewInstructions: 'Scroll smoothly through 5,000 transaction records. Notice that the table header row stays fixed at the top while rows stream by.',
  expectedResult: 'A virtualized data grid with sticky table headers and precise cell alignment.',
  commonMistakes: [
    {
      mistake: 'Applying CSS transform to standard table-row elements with display: table-row.',
      fix: 'Use display: flex or absolute positioning on virtual rows to ensure transforms apply cleanly.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you keep table column headers aligned with virtualized table body cells?',
      answer:
        'Use fixed percentage or pixel width definitions across both header cells and virtual row cells (or CSS grid templates).',
    },
  ],
  example: {
    id: 'example-virtual-table',
    title: '5,000 Rows Data Table with Sticky Headers',
    description: 'Virtualized table rows with sticky column headers and transaction status badges.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Table, ArrowUpDown, DollarSign, Clock, ShieldCheck } from 'lucide-react';

const totalTransactions = 5000;
const rowHeight = 44;

export default function App() {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: totalTransactions,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '640px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Table size={20} color="#059669" />
          <span>Virtualized Financial Ledger</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          5,000 ledger entries with sticky table headers. Active DOM rows: <strong>{virtualRows.length}</strong>.
        </p>
      </header>

      {/* Table Container */}
      <div
        ref={parentRef}
        style={{
          height: '420px',
          overflowY: 'auto',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          background: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Sticky Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: '#f8fafc',
            borderBottom: '2px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: '#334155',
            padding: '0 16px',
            height: '40px',
          }}
        >
          <div style={{ width: '80px' }}>TX ID</div>
          <div style={{ flex: 1 }}>Recipient / Merchant</div>
          <div style={{ width: '120px' }}>Date</div>
          <div style={{ width: '100px', textAlign: 'right' }}>Amount</div>
          <div style={{ width: '90px', textAlign: 'right' }}>Status</div>
        </div>

        {/* Virtualized Body */}
        <div
          style={{
            height: \`\${virtualizer.getTotalSize()}px\`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualRows.map((virtualRow) => {
            const id = virtualRow.index + 1;
            const amount = ((id * 37) % 900 + 15).toFixed(2);
            const status = id % 7 === 0 ? 'Pending' : 'Settled';

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: \`\${virtualRow.size}px\`,
                  transform: \`translateY(\${virtualRow.start}px)\`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  boxSizing: 'border-box',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '13px',
                  background: virtualRow.index % 2 === 0 ? '#ffffff' : '#fafafa',
                }}
              >
                <div style={{ width: '80px', fontFamily: 'monospace', color: '#64748b' }}>
                  #{id.toString().padStart(5, '0')}
                </div>
                <div style={{ flex: 1, fontWeight: 500, color: '#0f172a' }}>
                  {['Stripe Connect', 'AWS Cloud', 'GitHub Enterprise', 'Neon Database'][id % 4]}
                </div>
                <div style={{ width: '120px', color: '#64748b', fontSize: '12px' }}>
                  Oct {((id % 28) + 1)}, 2026
                </div>
                <div style={{ width: '100px', textAlign: 'right', fontWeight: 600, fontFamily: 'monospace', color: '#0f172a' }}>
                  \${amount}
                </div>
                <div style={{ width: '90px', textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      background: status === 'Settled' ? '#ecfdf5' : '#fffbeb',
                      color: status === 'Settled' ? '#059669' : '#d97706',
                    }}
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
`,
      },
    },
    dependencies: {
      '@tanstack/react-virtual': '^3.13.1',
      'lucide-react': '^1.65.0',
    },
  },
}

