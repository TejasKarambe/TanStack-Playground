import type { LessonManifest } from '../../types'

export const tableSortingLesson: LessonManifest = {
  id: 'table-sorting',
  libraryId: 'table',
  topicId: 'table-sorting',
  title: 'Multi-Column Sorting: Interactive Data Ordering',
  description: 'Implement multi-column and single-column sorting using getSortedRowModel and column helpers.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/sorting',
  learningObjectives: [
    'Define strongly-typed columns using createColumnHelper.',
    'Enable interactive sorting with getSortedRowModel().',
    'Wire table headers to column.getToggleSortingHandler().',
    'Display dynamic sorting direction icons (asc, desc, none).',
  ],
  conceptSections: [
    {
      title: 'Headless Table Architecture',
      content:
        'TanStack Table is a headless library. It gives you 100% control over the DOM, styling, and markup while handling all complex table state logic: sorting, filtering, grouping, expanding, and virtualization.',
    },
    {
      title: 'Sorting Pipeline',
      content:
        'To sort data, supply the getSortedRowModel row model function to useReactTable. You manage sorting state via useState<SortingState>([]). The table calculates sorted orders efficiently and exposes helper functions on each column header.',
    },
  ],
  importantApis: [
    {
      name: 'getSortedRowModel()',
      signature: 'getSortedRowModel: getSortedRowModel()',
      description: 'Built-in row model for client-side sorting calculation.',
    },
    {
      name: 'header.column.getToggleSortingHandler()',
      signature: 'onClick: header.column.getToggleSortingHandler()',
      description: 'Event listener to cycle through asc -> desc -> clear sort states.',
    },
  ],
  previewInstructions: 'Click on any column header (Name, Role, Score) to toggle sorting ascending/descending. Shift-click to sort across multiple columns!',
  expectedResult: 'A clean developer ranking table that sorts smoothly on click with clear direction indicators.',
  commonMistakes: [
    {
      mistake: 'Passing plain arrays directly without memoizing or managing sorting state.',
      fix: 'Use const [sorting, setSorting] = useState<SortingState>([]) and pass onSortingChange: setSorting.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What does "Headless UI" mean in the context of TanStack Table?',
      answer:
        'Headless means TanStack Table provides zero markup, HTML tags, or CSS. It only manages logic, state, and coordinates table models, allowing you to use Tailwind CSS, shadcn/ui, or custom components freely.',
    },
  ],
  example: {
    id: 'table-sorting-example',
    title: 'Interactive Multi-Column Sorting',
    description: 'Sort developers by name, department, or score with multi-sort support.',
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
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Table2 } from 'lucide-react';

interface Developer {
  id: string;
  name: string;
  department: string;
  score: number;
}

const defaultData: Developer[] = [
  { id: '1', name: 'Alex Rivera', department: 'Infrastructure', score: 98 },
  { id: '2', name: 'Elena Rostova', department: 'Frontend Architecture', score: 94 },
  { id: '3', name: 'Marcus Brody', department: 'DevOps & Cloud', score: 87 },
  { id: '4', name: 'Zoe Thorne', department: 'Frontend Architecture', score: 99 },
  { id: '5', name: 'Liam Chen', department: 'Infrastructure', score: 91 },
];

const columnHelper = createColumnHelper<Developer>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Engineer Name',
    cell: (info) => <strong>{info.getValue()}</strong>,
  }),
  columnHelper.accessor('department', {
    header: 'Department',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('score', {
    header: 'Benchmark Score',
    cell: (info) => (
      <span style={{ fontWeight: 600, color: info.getValue() > 90 ? '#16a34a' : '#2563eb' }}>
        {info.getValue()} / 100
      </span>
    ),
  }),
];

export default function App() {
  const [data] = useState(() => [...defaultData]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'score', desc: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Table2 size={20} color="#3b82f6" />
          Engineering Benchmarks
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
          Click headers to sort. Shift-click for multi-column sorting.
        </p>
      </header>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
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
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortDir === 'asc' && <ArrowUp size={14} color="#3b82f6" />}
                        {sortDir === 'desc' && <ArrowDown size={14} color="#3b82f6" />}
                        {!sortDir && <ArrowUpDown size={14} color="#94a3b8" />}
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

