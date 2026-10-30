import type { LessonManifest } from '../../types'

export const tableBasicTableLesson: LessonManifest = {
  id: 'table-basic-table',
  libraryId: 'table',
  topicId: 'table-basics',
  title: 'Basic Table: Column Definitions & flexRender Markup',
  description: 'Construct a headless data grid from scratch with createColumnHelper and flexRender.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/columns',
  learningObjectives: [
    'Create strongly typed column definitions using createColumnHelper.',
    'Map over table.getHeaderGroups() to render HTML <thead> and <th> elements.',
    'Map over table.getRowModel().rows and row.getVisibleCells() for <tbody> rows.',
    'Use flexRender to render React components, formatters, and raw values seamlessly.',
  ],
  conceptSections: [
    {
      title: 'Headless Table Concept',
      content:
        'TanStack Table is a headless library. It doesn\'t render any HTML elements or impose styling. Instead, it computes and exposes the exact state, cells, headers, and rows you need to render with your own custom CSS, Tailwind, or component system.',
    },
    {
      title: 'Column Definitions & createColumnHelper',
      content:
        'createColumnHelper<TData>() provides an ergonomic TypeScript builder. Accessor columns bind directly to properties on your data object (e.g. helper.accessor("email", { header: "Email" })), while display columns allow rendering custom buttons or icons.',
    },
  ],
  importantApis: [
    {
      name: 'createColumnHelper<TData>()',
      signature: 'const helper = createColumnHelper<Employee>()',
      description: 'Provides typed methods: accessor(), display(), and group().',
    },
    {
      name: 'flexRender(comp, context)',
      signature: 'flexRender(cell.column.columnDef.cell, cell.getContext())',
      description: 'Safely renders strings, numbers, or custom React components returned from column formatters.',
    },
  ],
  previewInstructions: 'Review the formatted table below. Notice how each column formatter formats dates, badges, and salary values cleanly without cluttering the main component.',
  expectedResult: 'A clean, well-spaced employee directory rendered using native HTML tables with TanStack Table state.',
  commonMistakes: [
    {
      mistake: 'Directly calling cell.column.columnDef.cell() without flexRender.',
      fix: 'Always use flexRender(cell.column.columnDef.cell, cell.getContext()) to handle React component formatters properly.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the role of flexRender in TanStack Table?',
      answer:
        'flexRender allows column headers and cells to be defined as plain strings, JSX elements, or render functions (props => <CustomComponent />), rendering them consistently regardless of format.',
    },
  ],
  example: {
    id: 'table-basic-table-example',
    title: 'Employee Directory with Column Helpers',
    description: 'Render a typed employee table with custom badge cells and salary formatting.',
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
} from '@tanstack/react-table';
import { Table, Building, DollarSign } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  department: string;
  salary: number;
  startDate: string;
  status: 'Full-time' | 'Contractor';
}

const employees: Employee[] = [
  { id: '1', name: 'Sophia Miller', department: 'Engineering', salary: 145000, startDate: '2023-01-15', status: 'Full-time' },
  { id: '2', name: 'James Wilson', department: 'Product Design', salary: 120000, startDate: '2022-06-01', status: 'Full-time' },
  { id: '3', name: 'Amara Okafor', department: 'Data Science', salary: 155000, startDate: '2023-09-10', status: 'Contractor' },
  { id: '4', name: 'Kenji Sato', department: 'Engineering', salary: 135000, startDate: '2021-11-20', status: 'Full-time' },
];

const columnHelper = createColumnHelper<Employee>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Employee Name',
    cell: (info) => <strong>{info.getValue()}</strong>,
  }),
  columnHelper.accessor('department', {
    header: 'Department',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('salary', {
    header: 'Annual Salary',
    cell: (info) => (
      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
        \${info.getValue().toLocaleString()}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Employment Type',
    cell: (info) => (
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '999px',
          background: info.getValue() === 'Full-time' ? '#dcfce7' : '#f1f5f9',
          color: info.getValue() === 'Full-time' ? '#166534' : '#475569',
        }}
      >
        {info.getValue()}
      </span>
    ),
  }),
];

export default function App() {
  const [data] = useState(() => [...employees]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Table size={20} color="#3b82f6" />
          Employee Directory
        </h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Clean headless markup with <code>@tanstack/react-table</code>
        </span>
      </header>

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

