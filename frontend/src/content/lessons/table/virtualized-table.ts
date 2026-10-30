import type { LessonManifest } from '../../types'

export const tableVirtualizedTableLesson: LessonManifest = {
  id: 'table-virtualized-table',
  libraryId: 'table',
  topicId: 'table-virtualized',
  title: 'Virtualized Table: 5,000+ Rows at 60 FPS with TanStack Virtual',
  description: 'Integrate TanStack Table with TanStack Virtual to render massive datasets with zero scroll jank.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 25,
  officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/introduction',
  learningObjectives: [
    'Bridge @tanstack/react-table and @tanstack/react-virtual.',
    'Mount only the rows visible in the viewport using rowVirtualizer.getVirtualItems().',
    'Position <tr> elements with CSS transform: translateY.',
    'Maintain sorting, column widths, and filtering alongside virtual DOM recycling.',
  ],
  conceptSections: [
    {
      title: 'The Table DOM Bottleneck',
      content:
        'HTML <table> layouts are notoriously expensive for browser layout engines. Rendering 5,000 full <tr> and <td> nodes can freeze the main thread for seconds. By pairing TanStack Table (which manages column structures and cell values) with TanStack Virtual (which mounts only the ~12 rows in the viewport), you achieve buttery smooth 60 FPS scrolling.',
    },
    {
      title: 'Integrating useVirtualizer with Table Rows',
      content:
        'Pass count: table.getRowModel().rows.length to useVirtualizer. In the <tbody>, map over rowVirtualizer.getVirtualItems(), retrieve const row = table.getRowModel().rows[virtualRow.index], and position the <tr> with transform: translateY(${virtualRow.start}px).',
    },
  ],
  importantApis: [
    {
      name: 'useVirtualizer({ count: table.getRowModel().rows.length })',
      signature: 'useVirtualizer({ count: rows.length, getScrollElement, estimateSize: () => 42 })',
      description: 'Coordinates virtual row positioning from table row models.',
    },
    {
      name: 'rowVirtualizer.getTotalSize()',
      signature: 'height: `${rowVirtualizer.getTotalSize()}px`',
      description: 'Sets the inner spacer container height for accurate scrollbar physics.',
    },
  ],
  previewInstructions: 'Scroll quickly through the 5,000 transaction rows. Notice how DOM nodes stay constant (~12 mounted rows) while scroll frame rates remain silky smooth!',
  expectedResult: 'A 5,000-row virtualized ledger table maintaining 60 FPS performance without lagging.',
  commonMistakes: [
    {
      mistake: 'Passing fixed indices instead of virtualRow.index.',
      fix: 'Always retrieve rows via const row = rows[virtualRow.index] to render the correct record for that frame.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you preserve column headers fixed while scrolling through virtualized table rows?',
      answer:
        'Keep the <thead> outside the scrollable body container, or set position: sticky; top: 0; z-index: 1 on the <th> elements inside the scroll container.',
    },
  ],
  example: {
    id: 'table-virtualized-table-example',
    title: '5,000 Row Virtualized Table Integration',
    description: 'Combine TanStack Table with TanStack Virtual for instant rendering.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-table': '^8.21.2',
      '@tanstack/react-virtual': '^3.14.24',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useRef, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Layers, ArrowUpDown, ArrowUp, ArrowDown, Zap } from 'lucide-react';

interface TransactionItem {
  id: number;
  hash: string;
  sender: string;
  amount: number;
  fee: number;
  status: 'SETTLED' | 'PENDING';
}

// Generate 5,000 synthetic records
const totalRecords = 5000;
const rawTransactions: TransactionItem[] = Array.from({ length: totalRecords }, (_, i) => ({
  id: i + 1,
  hash: '0x' + Math.random().toString(16).substr(2, 8),
  sender: ['Stripe', 'Coinbase', 'Plaid', 'Square', 'Revolut', 'Wise'][i % 6],
  amount: Math.floor(Math.random() * 4500) + 10,
  fee: Number((Math.random() * 5 + 0.1).toFixed(2)),
  status: i % 7 === 0 ? 'PENDING' : 'SETTLED',
}));

const columnHelper = createColumnHelper<TransactionItem>();

const columns = [
  columnHelper.accessor('id', {
    header: 'Seq #',
    size: 70,
    cell: (info) => <code style={{ fontSize: '11px', color: '#64748b' }}>#{info.getValue()}</code>,
  }),
  columnHelper.accessor('hash', {
    header: 'Tx Hash',
    size: 110,
    cell: (info) => <span style={{ fontFamily: 'monospace' }}>{info.getValue()}</span>,
  }),
  columnHelper.accessor('sender', {
    header: 'Gateway',
    size: 110,
    cell: (info) => <strong>{info.getValue()}</strong>,
  }),
  columnHelper.accessor('amount', {
    header: 'Gross Amount',
    size: 120,
    cell: (info) => <span>\${info.getValue().toLocaleString()}</span>,
  }),
  columnHelper.accessor('fee', {
    header: 'Fee ($)',
    size: 80,
    cell: (info) => <span style={{ color: '#64748b' }}>\${info.getValue().toFixed(2)}</span>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 90,
    cell: (info) => (
      <span
        style={{
          fontSize: '10px',
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: '4px',
          background: info.getValue() === 'SETTLED' ? '#dcfce7' : '#fef3c7',
          color: info.getValue() === 'SETTLED' ? '#166534' : '#b45309',
        }}
      >
        {info.getValue()}
      </span>
    ),
  }),
];

export default function App() {
  const [data] = useState(() => rawTransactions);
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  // Connect TanStack Virtual
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 40, // 40px fixed row height
    overscan: 6,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="#8b5cf6" />
            5,000 Rows Virtualized Table
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Mounted DOM rows: <strong>{virtualRows.length}</strong> of {totalRecords.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => rowVirtualizer.scrollToIndex(2500, { align: 'center' })}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Jump to Row #2,500
        </button>
      </header>

      {/* Virtual Scroll Container */}
      <div
        ref={tableContainerRef}
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          background: '#fff',
          position: 'relative',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', tableLayout: 'fixed' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        padding: '10px 14px',
                        width: header.getSize(),
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                        userSelect: 'none',
                        background: '#f8fafc',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortDir === 'asc' && <ArrowUp size={13} color="#8b5cf6" />}
                        {sortDir === 'desc' && <ArrowDown size={13} color="#8b5cf6" />}
                        {!sortDir && <ArrowUpDown size={13} color="#94a3b8" />}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              height: \`\${totalSize}px\`,
              position: 'relative',
              display: 'block',
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: \`\${virtualRow.size}px\`,
                    transform: \`translateY(\${virtualRow.start}px)\`,
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #f1f5f9',
                    boxSizing: 'border-box',
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        padding: '0 14px',
                        width: cell.column.getSize(),
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,
      },
    },
  },
}

