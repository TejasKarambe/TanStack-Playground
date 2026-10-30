import React from 'react'
import { LessonWorkspace } from '@/components/playground/lesson-workspace'
import type { LessonExample } from '@/content/types'
import { Sparkles, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const freeformPlaygroundExample: LessonExample = {
  id: 'freeform-playground',
  title: 'TanStack Freeform Sandbox',
  description: 'Experiment freely with TanStack Query, Table, Form, Virtual, and React 19 in an isolated browser sandbox.',
  entryFile: '/App.tsx',
  dependencies: {
    '@tanstack/react-query': '^5.66.0',
    '@tanstack/react-table': '^8.21.2',
    '@tanstack/react-form': '^1.33.5',
    '@tanstack/react-virtual': '^3.14.24',
    'lucide-react': '^1.65.0',
  },
  files: {
    '/App.tsx': {
      code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Sparkles, RefreshCw, Database } from 'lucide-react';
import { initialUsers } from './data';
import type { User } from './types';

const queryClient = new QueryClient();

const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor('name', { header: 'Developer', cell: (info) => <strong>{info.getValue()}</strong> }),
  columnHelper.accessor('library', { header: 'Focus Area' }),
  columnHelper.accessor('role', { header: 'Role' }),
];

function PlaygroundDashboard() {
  const { data: users, isFetching, refetch } = useQuery<User[]>({
    queryKey: ['playground-users'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return initialUsers;
    },
    staleTime: 5000,
  });

  const table = useReactTable({
    data: users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#f59e0b" />
            TanStack Multi-Library Sandbox
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Combines Query + Table in React 19
          </span>
        </div>

        <button
          onClick={() => refetch()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: isFetching ? '#f1f5f9' : '#fff',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          <RefreshCw size={14} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          Refetch
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlaygroundDashboard />
    </QueryClientProvider>
  );
}
`,
    },
    '/data.ts': {
      code: `import type { User } from './types';

export const initialUsers: User[] = [
  { id: '1', name: 'Tanner Linsley', library: 'TanStack Query / Start', role: 'Creator & Lead' },
  { id: '2', name: 'Dominik Dorfmeister', library: 'TanStack Query', role: 'TkDodo Maintainer' },
  { id: '3', name: 'Kevin Van Cott', library: 'TanStack Table', role: 'Table Lead' },
  { id: '4', name: 'Sean Cassiere', library: 'TanStack Form', role: 'Form Maintainer' },
];
`,
    },
    '/types.ts': {
      code: `export interface User {
  id: string;
  name: string;
  library: string;
  role: string;
}
`,
    },
  },
}

export function PlaygroundView() {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Playground link copied to clipboard!')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden animate-in fade-in-50 duration-300">
      {/* Action Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/60 backdrop-blur-xs text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Interactive Code Playground</span>
          <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-xs">
            Freeform Sandbox
          </span>
        </div>

        <Button size="sm" onClick={handleShare} className="h-7 text-xs gap-1.5">
          <Share2 className="h-3 w-3" />
          Share Playground
        </Button>
      </div>

      {/* Main Workspace Engine */}
      <div className="flex-1 overflow-hidden">
        <LessonWorkspace example={freeformPlaygroundExample} />
      </div>
    </div>
  )
}
