import type { LessonManifest } from '../../types'

export const virtualGridLesson: LessonManifest = {
  id: 'virtual-grid',
  libraryId: 'virtual',
  topicId: 'virtual-grid',
  title: '2D Grid Virtualization: 10,000 Cells Spreadsheet Matrix',
  description: 'Simultaneously virtualize both horizontal columns and vertical rows using dual virtualizer hooks.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 25,
  officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/grid',
  learningObjectives: [
    'Instantiate two useVirtualizer hooks: one vertical (rows) and one horizontal (columns).',
    'Calculate 2D cell positions using transform: translate(${col.start}px, ${row.start}px).',
    'Manage 10,000 cells (100 rows x 100 columns) with only ~30 active cells mounted in the DOM.',
    'Implement sticky column headers and row indicators.',
  ],
  conceptSections: [
    {
      title: 'Dual-Axis Virtualization',
      content:
        'When building spreadsheets, financial matrices, or kanban boards with dozens of columns and thousands of rows, virtualizing only one axis is insufficient. TanStack Virtual allows you to pair a vertical row virtualizer with a horizontal column virtualizer to create a performant 2D grid.',
    },
    {
      title: '2D Transform Positioning',
      content:
        'Instead of rendering 10,000 table cells, you iterate through rowVirtualizer.getVirtualItems() and colVirtualizer.getVirtualItems(), positioning each visible cell using CSS translate(X, Y).',
    },
  ],
  importantApis: [
    {
      name: 'rowVirtualizer & columnVirtualizer',
      signature: 'useVirtualizer({ count: numRows }) & useVirtualizer({ horizontal: true, count: numCols })',
      description: 'Pairs two virtualizers for simultaneous X and Y axis computation.',
    },
  ],
  previewInstructions: 'Scroll both vertically and horizontally through the 100x100 matrix (10,000 cells total). Notice how cells render effortlessly at 60 FPS.',
  expectedResult: 'A 2D spreadsheet matrix where scrolling in any direction maintains smooth rendering.',
  commonMistakes: [
    {
      mistake: 'Using nested loops over the full dataset rather than the virtual items.',
      fix: 'Iterate only over rowVirtualizer.getVirtualItems() and columnVirtualizer.getVirtualItems().',
    },
  ],
  interviewQuestions: [
    {
      question: 'How many DOM elements are rendered in a 100x100 grid when using 2D virtualization?',
      answer:
        'Only approximately ~30 to 40 cells (e.g. 8 visible rows x 4 visible columns + overscan), rather than all 10,000 elements.',
    },
  ],
  example: {
    id: 'example-virtual-grid',
    title: '100x100 2D Virtual Spreadsheet Matrix',
    description: 'Dual-axis virtualization of 10,000 cells with 2D transform positioning.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Grid, Table, Sparkles } from 'lucide-react';

const rowCount = 100;
const colCount = 100;
const rowHeight = 36;
const colWidth = 110;

export default function App() {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 2,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: colCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => colWidth,
    overscan: 2,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const virtualCols = columnVirtualizer.getVirtualItems();
  const activeCellsCount = virtualRows.length * virtualCols.length;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '640px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Grid size={20} color="#0891b2" />
          <span>2D Virtual Spreadsheet Grid</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          100 rows × 100 columns = 10,000 cells. Active in DOM: <strong>{activeCellsCount} cells</strong>.
        </p>
      </header>

      {/* 2D Scroll Window */}
      <div
        ref={parentRef}
        style={{
          height: '420px',
          width: '100%',
          overflow: 'auto',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          background: '#f8fafc',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: \`\${rowVirtualizer.getTotalSize()}px\`,
            width: \`\${columnVirtualizer.getTotalSize()}px\`,
            position: 'relative',
          }}
        >
          {virtualRows.map((virtualRow) => (
            <React.Fragment key={virtualRow.key}>
              {virtualCols.map((virtualCol) => {
                const isHeaderRow = virtualRow.index === 0;
                const isIndexCol = virtualCol.index === 0;

                return (
                  <div
                    key={virtualCol.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: \`\${virtualCol.size}px\`,
                      height: \`\${virtualRow.size}px\`,
                      transform: \`translate(\${virtualCol.start}px, \${virtualRow.start}px)\`,
                      background: isHeaderRow || isIndexCol ? '#f1f5f9' : '#ffffff',
                      borderRight: '1px solid #e2e8f0',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      boxSizing: 'border-box',
                      fontSize: '12px',
                      color: isHeaderRow || isIndexCol ? '#334155' : '#0f172a',
                      fontWeight: isHeaderRow || isIndexCol ? 600 : 400,
                      fontFamily: isHeaderRow || isIndexCol ? 'sans-serif' : 'monospace',
                    }}
                  >
                    {isHeaderRow && isIndexCol ? (
                      'R \\ C'
                    ) : isHeaderRow ? (
                      \`Col \${virtualCol.index}\`
                    ) : isIndexCol ? (
                      \`Row \${virtualRow.index}\`
                    ) : (
                      \`$\${(virtualRow.index * virtualCol.index * 1.5).toFixed(0)}\`
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
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

