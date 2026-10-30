import type { LessonManifest } from '../../types'

export const tableColumnOrderingLesson: LessonManifest = {
  id: 'table-column-ordering',
  libraryId: 'table',
  topicId: 'table-column-ordering',
  title: 'Column Ordering: Dynamic Reordering of Column Sequences',
  description: 'Reorder table column positions dynamically with columnOrder state and swap handlers.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/column-ordering',
  learningObjectives: [
    'Manage column sequence via state.columnOrder (array of column IDs).',
    'Reorder columns dynamically using table.setColumnOrder().',
    'Build move-left and move-right column header actions.',
    'Restore default column sequence with a reset action.',
  ],
  conceptSections: [
    {
      title: 'Column Order State Representation',
      content:
        'By default, columns are rendered in the order declared in the columns definition array. By providing state.columnOrder (e.g. ["status", "name", "salary", "department"]), you can rearrange any column without altering the underlying data or column definitions.',
    },
    {
      title: 'Ergonomic Column Swapping',
      content:
        'To swap column A and B, compute a new array slice with swapped indices and call table.setColumnOrder(newOrder). All header groups and visible cells reflect the new layout immediately.',
    },
  ],
  importantApis: [
    {
      name: 'table.setColumnOrder(order)',
      signature: 'table.setColumnOrder(string[])',
      description: 'Sets the array order of column IDs.',
    },
    {
      name: 'table.resetColumnOrder()',
      signature: 'table.resetColumnOrder(defaultOrder)',
      description: 'Reverts the column order back to its initial sequence.',
    },
  ],
  previewInstructions: 'Use the left (<) and right (>) arrows on any column header to move that column. Notice the entire table layout updates smoothly.',
  expectedResult: 'A flexible data table with reorderable columns and a reset button.',
  commonMistakes: [
    {
      mistake: 'Passing column IDs that do not exist in the column definition.',
      fix: 'Every ID in columnOrder must correspond to a valid column accessor or id property.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does column ordering interact with pinned columns in TanStack Table?',
      answer:
        'Pinned columns (left or right) are partitioned into their own groups. columnOrder reorders columns within their respective pinned or unpinned partition.',
    },
  ],
  example: {
    id: 'table-column-ordering-example',
    title: 'Dynamic Column Reordering',
    description: 'Swap and shift column positions with real-time state updates.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-table': '^8.21.2',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnOrderState,
} from '@tanstack/react-table';
import { ArrowLeft, ArrowRight, RotateCcw, MoveHorizontal } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  department: string;
}

const employees: Employee[] = [
  { id: '1', name: 'Jordan Hayes', role: 'Staff SRE', salary: 160000, department: 'Cloud Infrastructure' },
  { id: '2', name: 'Maya Lin', role: 'Frontend Architect', salary: 155000, department: 'Web Platforms' },
  { id: '3', name: 'David Kim', role: 'Security Engineer', salary: 148000, department: 'Cybersecurity' },
];

const defaultColumnOrder = ['name', 'role', 'department', 'salary'];

const columnHelper = createColumnHelper<Employee>();

const columns = [
  columnHelper.accessor('name', { header: 'Name', cell: (info) => <strong>{info.getValue()}</strong> }),
  columnHelper.accessor('role', { header: 'Job Title' }),
  columnHelper.accessor('department', { header: 'Department' }),
  columnHelper.accessor('salary', {
    header: 'Compensation',
    cell: (info) => <span>\${info.getValue().toLocaleString()}</span>,
  }),
];

export default function App() {
  const [data] = useState(() => [...employees]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(defaultColumnOrder);

  const table = useReactTable({
    data,
    columns,
    state: { columnOrder },
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
  });

  const moveColumn = (columnId: string, direction: 'left' | 'right') => {
    const currentOrder = [...(columnOrder.length ? columnOrder : defaultColumnOrder)];
    const index = currentOrder.indexOf(columnId);
    if (index === -1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    // Swap columns
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    setColumnOrder(currentOrder);
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MoveHorizontal size={20} color="#3b82f6" />
            Column Reordering
          </h2>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
            Order: {JSON.stringify(columnOrder)}
          </span>
        </div>

        <button
          onClick={() => setColumnOrder(defaultColumnOrder)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#fff',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} /> Reset Order
        </button>
      </header>

      {/* Table */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const idx = columnOrder.indexOf(header.id);
                  return (
                    <th key={header.id} style={{ padding: '10px 14px', fontWeight: 600, color: '#334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button
                            onClick={() => moveColumn(header.id, 'left')}
                            disabled={idx <= 0}
                            style={{ padding: '2px 4px', border: 'none', background: 'none', cursor: idx <= 0 ? 'not-allowed' : 'pointer', opacity: idx <= 0 ? 0.3 : 1 }}
                            title="Shift column left"
                          >
                            <ArrowLeft size={13} />
                          </button>
                          <button
                            onClick={() => moveColumn(header.id, 'right')}
                            disabled={idx >= columnOrder.length - 1}
                            style={{ padding: '2px 4px', border: 'none', background: 'none', cursor: idx >= columnOrder.length - 1 ? 'not-allowed' : 'pointer', opacity: idx >= columnOrder.length - 1 ? 0.3 : 1 }}
                            title="Shift column right"
                          >
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: '10px 14px' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
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

