import type { LessonManifest } from '../../types'

export const tableGroupingLesson: LessonManifest = {
  id: 'table-grouping',
  libraryId: 'table',
  topicId: 'table-grouping',
  title: 'Grouping & Aggregation: Collapsible Groups, Sums & Counts',
  description: 'Group rows hierarchically by field values and compute aggregated sums, averages, and counts.',
  difficulty: 'ADVANCED',
  estimatedMinutes: 25,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/grouping',
  learningObjectives: [
    'Enable row grouping using getGroupedRowModel() and getExpandedRowModel().',
    'Configure column aggregation functions: sum, count, and custom reducers.',
    'Render expandable group rows with row.getToggleExpandedHandler().',
    'Display aggregated summaries inside parent group headers.',
  ],
  conceptSections: [
    {
      title: 'Headless Hierarchical Grouping',
      content:
        'Grouping collapses rows sharing a common column value into hierarchical parent nodes. Providing getGroupedRowModel and getExpandedRowModel transforms flat records into an expandable tree structure.',
    },
    {
      title: 'Built-in Aggregation Functions',
      content:
        'TanStack Table includes built-in aggregations: "count", "sum", "min", "max", "extent", "mean", and "median". When a column is grouped, you can render cell.getIsGrouped() vs cell.getIsAggregated() vs cell.getIsPlaceholder() to display group summaries cleanly.',
    },
  ],
  importantApis: [
    {
      name: 'getGroupedRowModel()',
      signature: 'getGroupedRowModel: getGroupedRowModel()',
      description: 'Calculates grouped row clusters based on state.grouping.',
    },
    {
      name: 'getExpandedRowModel()',
      signature: 'getExpandedRowModel: getExpandedRowModel()',
      description: 'Provides expanded sub-rows for active group headers.',
    },
    {
      name: 'row.getToggleExpandedHandler()',
      signature: 'onClick: row.getToggleExpandedHandler()',
      description: 'Toggles a group row expanded or collapsed.',
    },
  ],
  previewInstructions: 'Click on any department header to expand or collapse its sub-rows. Notice the total budget and employee count aggregated automatically.',
  expectedResult: 'A hierarchical department expense table with collapsible rows and automatic budget summation.',
  commonMistakes: [
    {
      mistake: 'Supplying getGroupedRowModel without also supplying getExpandedRowModel.',
      fix: 'Always provide getExpandedRowModel() alongside getGroupedRowModel() to allow sub-rows to expand.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you customize how an aggregated cell renders compared to a normal row cell?',
      answer:
        'In the columnDef, provide an aggregatedCell: (info) => ... property, or check info.cell.getIsAggregated() inside the cell formatter.',
    },
  ],
  example: {
    id: 'table-grouping-example',
    title: 'Department Expense Grouping & Sum Aggregation',
    description: 'Group team members by department with budget summation and collapsible groups.',
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
  getGroupedRowModel,
  getExpandedRowModel,
  useReactTable,
  GroupingState,
  ExpandedState,
} from '@tanstack/react-table';
import { ChevronRight, ChevronDown, Folder, DollarSign, Users } from 'lucide-react';

interface ExpenseRecord {
  id: string;
  department: string;
  employee: string;
  role: string;
  budget: number;
}

const records: ExpenseRecord[] = [
  { id: '1', department: 'Cloud Infrastructure', employee: 'Devon Vance', role: 'DevOps Lead', budget: 14500 },
  { id: '2', department: 'Cloud Infrastructure', employee: 'Nadia Petrova', role: 'SRE Specialist', budget: 18200 },
  { id: '3', department: 'Core Engineering', employee: 'Marcus Bell', role: 'Fullstack Dev', budget: 9800 },
  { id: '4', department: 'Core Engineering', employee: 'Siddharth Rao', role: 'Backend Lead', budget: 12400 },
  { id: '5', department: 'AI & Research', employee: 'Aria Takahashi', role: 'ML Scientist', budget: 28000 },
  { id: '6', department: 'AI & Research', employee: 'Lukas Fischer', role: 'Data Engineer', budget: 19500 },
];

const columnHelper = createColumnHelper<ExpenseRecord>();

const columns = [
  columnHelper.accessor('department', {
    header: 'Department',
    cell: (info) => info.getValue(),
    enableGrouping: true,
  }),
  columnHelper.accessor('employee', {
    header: 'Team Member',
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor('role', {
    header: 'Job Title',
  }),
  columnHelper.accessor('budget', {
    header: 'Project Budget',
    aggregationFn: 'sum',
    aggregatedCell: (info) => (
      <span style={{ fontWeight: 700, color: '#16a34a' }}>
        Total: \${info.getValue().toLocaleString()}
      </span>
    ),
    cell: (info) => (
      <span style={{ fontFamily: 'monospace' }}>
        \${info.getValue().toLocaleString()}
      </span>
    ),
  }),
];

export default function App() {
  const [data] = useState(() => [...records]);
  const [grouping, setGrouping] = useState<GroupingState>(['department']);
  const [expanded, setExpanded] = useState<ExpandedState>(true); // All expanded by default

  const table = useReactTable({
    data,
    columns,
    state: { grouping, expanded },
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Folder size={20} color="#6366f1" />
            Department Budget Allocations
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Grouped by <strong>Department</strong> with automatic budget summation
          </span>
        </div>

        <button
          onClick={() => setExpanded((prev) => (typeof prev === 'boolean' ? !prev : true))}
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
          {expanded === true ? 'Collapse All' : 'Expand All'}
        </button>
      </header>

      {/* Table */}
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
                  background: row.getIsGrouped() ? '#f8fafc' : '#ffffff',
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  if (cell.getIsGrouped()) {
                    return (
                      <td
                        key={cell.id}
                        colSpan={cell.column.id === 'department' ? 1 : undefined}
                        style={{
                          padding: '10px 14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          color: '#4338ca',
                        }}
                        onClick={row.getToggleExpandedHandler()}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                            ({row.subRows.length} team members)
                          </span>
                        </div>
                      </td>
                    );
                  }

                  if (cell.getIsAggregated()) {
                    return (
                      <td key={cell.id} style={{ padding: '10px 14px' }}>
                        {flexRender(
                          cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  }

                  if (cell.getIsPlaceholder()) {
                    return <td key={cell.id} style={{ padding: '10px 14px' }} />;
                  }

                  return (
                    <td key={cell.id} style={{ padding: '10px 14px', paddingLeft: cell.column.id === 'employee' ? '28px' : '14px' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
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

