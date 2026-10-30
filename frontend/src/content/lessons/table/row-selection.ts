import type { LessonManifest } from '../../types'

export const tableRowSelectionLesson: LessonManifest = {
  id: 'table-row-selection',
  libraryId: 'table',
  topicId: 'table-row-selection',
  title: 'Row Selection: Checkbox Selection & Batch Actions',
  description: 'Manage selected row state sets with select-all, indeterminate checkbox status, and batch actions.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/row-selection',
  learningObjectives: [
    'Enable row selection using enableRowSelection option.',
    'Build a dedicated checkbox selection column with select-all header.',
    'Support indeterminate checkbox states using HTML input indeterminate property.',
    'Execute batch operations against table.getSelectedRowModel().rows.',
  ],
  conceptSections: [
    {
      title: 'Row Selection State Model',
      content:
        'Selection state in TanStack Table is represented as an object where keys are row IDs and values are booleans: Record<string, boolean>. For example, { "0": true, "3": true }. This O(1) key-lookup ensures exceptional performance even on thousands of selected items.',
    },
    {
      title: 'Indeterminate Checkbox State',
      content:
        'When some (but not all) rows on screen are selected, the header "select-all" checkbox should show an indeterminate dash (-) state. You handle this by setting the DOM input.indeterminate property based on table.getIsSomeRowsSelected().',
    },
  ],
  importantApis: [
    {
      name: 'row.getIsSelected()',
      signature: 'row.getIsSelected(): boolean',
      description: 'Checks whether the specific row is selected.',
    },
    {
      name: 'table.getToggleAllRowsSelectedHandler()',
      signature: 'onChange: table.getToggleAllRowsSelectedHandler()',
      description: 'Toggles all rows across the table selected or unselected.',
    },
  ],
  previewInstructions: 'Click individual checkboxes or the header checkbox to select all rows. Observe the batch actions bar updating with the count of selected items.',
  expectedResult: 'A modern data table supporting checkbox multi-selection with bulk deletion/export toolbar.',
  commonMistakes: [
    {
      mistake: 'Passing plain boolean to indeterminate attribute in JSX.',
      fix: 'React JSX does not support an indeterminate attribute directly; use a ref or an HTML input ref callback: ref.indeterminate = !table.getIsAllRowsSelected() && table.getIsSomeRowsSelected().',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you access the selected data objects rather than just row IDs?',
      answer:
        'Call table.getSelectedRowModel().rows. Each row object provides row.original, which contains the raw underlying data object.',
    },
  ],
  example: {
    id: 'table-row-selection-example',
    title: 'Row Selection with Bulk Action Toolbar',
    description: 'Select individual rows or all rows and perform batch actions.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-table': '^8.21.2',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState, useEffect, useRef } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from '@tanstack/react-table';
import { CheckSquare, Trash2, Mail, Download } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
}

const initialContacts: Contact[] = [
  { id: '1', name: 'Sarah Connor', email: 'sarah@cyberdyne.org', company: 'Resistance Tech' },
  { id: '2', name: 'John Matrix', email: 'matrix@deltaforce.mil', company: 'Commando Ops' },
  { id: '3', name: 'Ellen Ripley', email: 'ripley@weyland-yutani.com', company: 'Nostromo Logistics' },
  { id: '4', name: 'Martin Riggs', email: 'riggs@lapd.gov', company: 'LAPD Narcotics' },
];

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return <input type="checkbox" ref={ref} style={{ cursor: 'pointer' }} {...rest} />;
}

const columnHelper = createColumnHelper<Contact>();

export default function App() {
  const [data, setData] = useState<Contact[]>(() => [...initialContacts]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor('name', { header: 'Contact Name' }),
    columnHelper.accessor('email', { header: 'Email Address' }),
    columnHelper.accessor('company', { header: 'Organization' }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedCount = Object.keys(rowSelection).length;

  const handleDeleteSelected = () => {
    const selectedIds = new Set(
      table.getSelectedRowModel().rows.map((r) => r.original.id)
    );
    setData((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setRowSelection({});
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckSquare size={20} color="#2563eb" />
          Lead Contacts Selection
        </h2>
      </header>

      {/* Batch Action Toolbar */}
      {selectedCount > 0 && (
        <div
          style={{
            padding: '10px 16px',
            marginBottom: '1rem',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af' }}>
            {selectedCount} contact{selectedCount > 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDeleteSelected}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: '#dc2626',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ padding: '10px 14px', fontWeight: 600, color: '#334155' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  background: row.getIsSelected() ? '#f0fdf4' : '#fff',
                }}
              >
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

