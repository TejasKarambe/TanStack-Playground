import type { LessonManifest } from '../../types'

export const tablePaginationLesson: LessonManifest = {
  id: 'table-pagination',
  libraryId: 'table',
  topicId: 'table-pagination',
  title: 'Pagination: Slicing Datasets into Controlled Pages',
  description: 'Control table page state, navigate pages, and configure custom page sizes with getPaginationRowModel.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/pagination',
  learningObjectives: [
    'Slice datasets into digestible pages using getPaginationRowModel().',
    'Manage pagination state: pageIndex and pageSize.',
    'Build previous/next buttons and page jump selectors.',
    'Enable dynamic page size configuration (e.g. 5, 10, 20 items per page).',
  ],
  conceptSections: [
    {
      title: 'Client-Side vs Server-Side Pagination',
      content:
        'Client-side pagination receives the complete dataset in memory and uses getPaginationRowModel() to compute active row slices. Server-side pagination delegates slicing to an API (like SQL LIMIT/OFFSET) by supplying manualPagination: true.',
    },
    {
      title: 'Pagination State Helpers',
      content:
        'useReactTable provides helper methods on the table instance: table.getCanPreviousPage(), table.getCanNextPage(), table.previousPage(), table.nextPage(), table.getPageCount(), and table.setPageSize().',
    },
  ],
  importantApis: [
    {
      name: 'getPaginationRowModel()',
      signature: 'getPaginationRowModel: getPaginationRowModel()',
      description: 'Slices rows according to state.pagination.',
    },
    {
      name: 'table.setPageIndex(index)',
      signature: 'table.setPageIndex(number)',
      description: 'Navigates directly to a specific 0-indexed page.',
    },
    {
      name: 'table.setPageSize(size)',
      signature: 'table.setPageSize(number)',
      description: 'Modifies the number of rows displayed per page.',
    },
  ],
  previewInstructions: 'Use the "Next Page" and "Previous Page" buttons to step through items. Try changing the rows-per-page dropdown from 3 to 6.',
  expectedResult: 'A responsive paginated table with disabled boundary buttons and dynamic page counters.',
  commonMistakes: [
    {
      mistake: 'Assuming pageIndex is 1-based.',
      fix: 'pageIndex in TanStack Table is 0-indexed. When rendering for humans, display pageIndex + 1.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you configure TanStack Table for server-driven pagination?',
      answer:
        'Set manualPagination: true and pass pageCount: totalPages to useReactTable. TanStack Table will skip client-side slicing and rely on you to fetch each page based on state.pagination.pageIndex.',
    },
  ],
  example: {
    id: 'table-pagination-example',
    title: 'Controlled Pagination Controls',
    description: 'Navigate pages, select page sizes, and jump to specific page numbers.',
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
  getPaginationRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Layers } from 'lucide-react';

interface ServerLog {
  id: string;
  timestamp: string;
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

const logs: ServerLog[] = [
  { id: '1', timestamp: '12:00:01', service: 'auth-service', level: 'INFO', message: 'User logged in via HttpOnly cookie' },
  { id: '2', timestamp: '12:00:04', service: 'router', level: 'INFO', message: 'Route /dashboard hydrated in 12ms' },
  { id: '3', timestamp: '12:00:15', service: 'query-cache', level: 'WARN', message: 'Stale query invalidated: ["users"]' },
  { id: '4', timestamp: '12:00:22', service: 'database', level: 'INFO', message: 'Connection pool acquired connection 4' },
  { id: '5', timestamp: '12:00:39', service: 'sandpack', level: 'INFO', message: 'Browser worker transpiled App.tsx' },
  { id: '6', timestamp: '12:00:51', service: 'api-gateway', level: 'ERROR', message: 'Upstream timeout on /billing' },
  { id: '7', timestamp: '12:01:05', service: 'auth-service', level: 'INFO', message: 'Token refresh issued' },
  { id: '8', timestamp: '12:01:14', service: 'query-cache', level: 'INFO', message: 'Prefetched topic 12' },
  { id: '9', timestamp: '12:01:30', service: 'router', level: 'INFO', message: 'Navigation to /table/pagination' },
];

const columnHelper = createColumnHelper<ServerLog>();

const columns = [
  columnHelper.accessor('timestamp', { header: 'Time', cell: (info) => <code style={{ fontSize: '11px' }}>{info.getValue()}</code> }),
  columnHelper.accessor('service', { header: 'Microservice' }),
  columnHelper.accessor('level', {
    header: 'Level',
    cell: (info) => {
      const val = info.getValue();
      const colors = {
        INFO: { bg: '#e0f2fe', text: '#0369a1' },
        WARN: { bg: '#fef3c7', text: '#b45309' },
        ERROR: { bg: '#fee2e2', text: '#b91c1c' },
      }[val];
      return (
        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: colors.bg, color: colors.text }}>
          {val}
        </span>
      );
    },
  }),
  columnHelper.accessor('message', { header: 'Log Payload' }),
];

export default function App() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 3,
  });

  const table = useReactTable({
    data: logs,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#8b5cf6" />
            System Audit Stream
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Total logs: {logs.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
          <span>Page Size:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
          >
            {[3, 5, 10].map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
        </div>
      </header>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
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

      {/* Pagination Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
        <span style={{ color: '#64748b' }}>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
          <strong>{table.getPageCount()}</strong>
        </span>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
`,
      },
    },
  },
}

