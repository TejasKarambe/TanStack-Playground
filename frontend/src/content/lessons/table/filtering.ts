import type { LessonManifest } from '../../types'

export const tableFilteringLesson: LessonManifest = {
  id: 'table-filtering',
  libraryId: 'table',
  topicId: 'table-filtering',
  title: 'Filtering: Global Search & Column Filters',
  description: 'Construct real-time global search and column-level filters with getFilteredRowModel.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/filters',
  learningObjectives: [
    'Enable client-side filtering via getFilteredRowModel().',
    'Bind an input to table global filter state.',
    'Filter specific columns by status, category, or role.',
    'Display dynamic matching row counters.',
  ],
  conceptSections: [
    {
      title: 'Global vs Column Filters',
      content:
        'Global filtering scans across all columns simultaneously for matching text, ideal for top-level search bars. Column filters evaluate constraints on a single field (such as a dropdown for status or price range slider).',
    },
    {
      title: 'Filter Row Models',
      content:
        'Supplying getFilteredRowModel to useReactTable hooks up filtering algorithms. Filtering runs before sorting and pagination in the table pipeline, ensuring pagination reflects the filtered count.',
    },
  ],
  importantApis: [
    {
      name: 'getFilteredRowModel()',
      signature: 'getFilteredRowModel: getFilteredRowModel()',
      description: 'Pipeline row model function that removes non-matching rows.',
    },
    {
      name: 'setGlobalFilter(value)',
      signature: 'table.setGlobalFilter(string)',
      description: 'Updates the global search string across all columns.',
    },
  ],
  previewInstructions: 'Type "Frontend" or "Berlin" into the search box to filter instantly across all columns.',
  expectedResult: 'Instant real-time search filtering with highlight counter showing matching records.',
  commonMistakes: [
    {
      mistake: 'Filtering after pagination.',
      fix: 'Always provide getFilteredRowModel before getPaginationRowModel so pagination computes from filtered results.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the correct order of row models in TanStack Table pipeline?',
      answer:
        '1. getCoreRowModel (base) -> 2. getFilteredRowModel (filters rows) -> 3. getSortedRowModel (sorts filtered rows) -> 4. getPaginationRowModel (slices sorted, filtered rows into pages).',
    },
  ],
  example: {
    id: 'table-filtering-example',
    title: 'Global Search & Role Filter',
    description: 'Filter developer directory by search term or category.',
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
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Search, Filter, Users } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  location: string;
  status: 'Active' | 'On Leave';
}

const data: Employee[] = [
  { id: '1', name: 'Danielle Miller', role: 'Frontend Architect', location: 'Berlin, DE', status: 'Active' },
  { id: '2', name: 'Carlos Morales', role: 'Backend Lead', location: 'Madrid, ES', status: 'Active' },
  { id: '3', name: 'Aoi Takahashi', role: 'UI/UX Designer', location: 'Tokyo, JP', status: 'On Leave' },
  { id: '4', name: 'Fatima Al-Sayed', role: 'DevOps Engineer', location: 'Dubai, UAE', status: 'Active' },
  { id: '5', name: 'Lucas Dubois', role: 'Frontend Architect', location: 'Paris, FR', status: 'Active' },
];

const columnHelper = createColumnHelper<Employee>();

const columns = [
  columnHelper.accessor('name', { header: 'Name', cell: (info) => <strong>{info.getValue()}</strong> }),
  columnHelper.accessor('role', { header: 'Role' }),
  columnHelper.accessor('location', { header: 'Location' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span style={{
        padding: '2px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 600,
        background: info.getValue() === 'Active' ? '#dcfce7' : '#fee2e2',
        color: info.getValue() === 'Active' ? '#166534' : '#991b1b',
      }}>
        {info.getValue()}
      </span>
    ),
  }),
];

export default function App() {
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="#3b82f6" />
          Directory Filtering
        </h2>
      </header>

      {/* Search Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search across all columns (name, role, city)..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <span style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
          Showing {table.getRowModel().rows.length} of {data.length} results
        </span>
      </div>

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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  No matching team members found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ padding: '10px 14px' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
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

