import type { LessonManifest } from '../../types'

export const devtoolsInspectionLesson: LessonManifest = {
  id: 'devtools-inspection',
  libraryId: 'devtools',
  topicId: 'devtools-inspection',
  title: 'TanStack Devtools: Cache Inspector & Status Visualizer',
  description: 'Inspect live query caches, view query statuses (fresh, fetching, stale, inactive), and trigger manual refetches.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/devtools',
  learningObjectives: [
    'Mount embedded React Query Devtools with <ReactQueryDevtools initialIsOpen={false} />.',
    'Inspect active, stale, fresh, and inactive query states in real time.',
    'Examine query data payloads, query keys, and fetch timestamps.',
    'Trigger manual refetch, cache invalidation, and data reset actions.',
  ],
  conceptSections: [
    {
      title: 'X-Ray Vision into Application State',
      content:
        'TanStack Devtools provides a floating panel giving developers full visibility into what queries exist in memory, how old each cache entry is, whether background refetches are active, and what observers are mounted.',
    },
    {
      title: 'Query Lifecycle States',
      content:
        'Queries transition through: 1) Fresh: Within staleTime window. 2) Stale: Eligible for refetch on trigger. 3) Fetching: In-flight network request. 4) Inactive: No mounted components are currently observing the query.',
    },
  ],
  importantApis: [
    {
      name: '<ReactQueryDevtools />',
      signature: '<ReactQueryDevtools initialIsOpen={false} position="bottom" />',
      description: 'Mounts the official visual inspection panel for TanStack Query.',
    },
  ],
  previewInstructions: 'Toggle between "Fresh Query", "Stale Query", and "Multi-Tab Query". Inspect the simulated Devtools Drawer showing query statuses, cache age timers, and observer counts.',
  expectedResult: 'A visual interactive representation of the TanStack Query Devtools panel inspecting active queries.',
  commonMistakes: [
    {
      mistake: 'Leaving devtools enabled in public production builds without conditional environment checks.',
      fix: 'Guard devtools: process.env.NODE_ENV === "development" && <ReactQueryDevtools />.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What do the colored status badges (green, yellow, blue, gray) represent in TanStack Query Devtools?',
      answer:
        'Green = Fresh (within staleTime), Yellow = Stale (needs refetch on trigger), Blue = Fetching (network in-flight), Gray = Inactive (zero mounted observers, waiting for gcTime garbage collection).',
    },
  ],
  example: {
    id: 'example-devtools-inspection',
    title: 'Query Cache Inspector Panel & Lifecycle Explorer',
    description: 'Demonstrating query inspection, query states (fresh, stale, fetching, inactive), and manual cache triggers.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { Wrench, Terminal, Database, RefreshCw, Trash2, Eye, ShieldCheck, Activity } from 'lucide-react';

interface MockQueryEntry {
  queryKey: string;
  status: 'fresh' | 'stale' | 'fetching' | 'inactive';
  observers: number;
  data: any;
  updatedAt: string;
}

export default function App() {
  const [queries, setQueries] = useState<MockQueryEntry[]>([
    {
      queryKey: "['users', 'list']",
      status: 'fresh',
      observers: 2,
      data: { count: 4, users: ['Alex', 'Sarah', 'Tanner', 'Dominik'] },
      updatedAt: '1 sec ago',
    },
    {
      queryKey: "['settings', 'theme']",
      status: 'stale',
      observers: 1,
      data: { mode: 'dark', fontSize: 14 },
      updatedAt: '45 sec ago',
    },
    {
      queryKey: "['invoices', 'archived']",
      status: 'inactive',
      observers: 0,
      data: { total: '$14,200', count: 12 },
      updatedAt: '3 mins ago (GC in 2m)',
    },
  ]);

  const [selectedKey, setSelectedKey] = useState<string>("['users', 'list']");

  const handleRefetch = (key: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.queryKey === key ? { ...q, status: 'fetching' } : q))
    );
    setTimeout(() => {
      setQueries((prev) =>
        prev.map((q) =>
          q.queryKey === key
            ? { ...q, status: 'fresh', updatedAt: 'Just now' }
            : q
        )
      );
    }, 700);
  };

  const selectedQuery = queries.find((q) => q.queryKey === selectedKey) || queries[0];

  const getStatusColor = (status: MockQueryEntry['status']) => {
    switch (status) {
      case 'fresh': return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'stale': return { bg: '#fefce8', text: '#ca8a04', border: '#fef08a' };
      case 'fetching': return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'inactive': return { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' };
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '640px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wrench size={20} color="#f97316" />
          <span>TanStack Devtools: Cache Inspector</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Live visual debugger simulating the official Query Devtools drawer.
        </p>
      </header>

      {/* Devtools Simulator Shell */}
      <div style={{ border: '1px solid #334155', borderRadius: '8px', background: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
        {/* Top Devtools Bar */}
        <div style={{ background: '#1e293b', padding: '10px 14px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13px', color: '#f97316' }}>
            <Activity size={16} /> TanStack Query Devtools (v5.105.0)
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
            <span style={{ color: '#4ade80' }}>● Fresh (1)</span>
            <span style={{ color: '#facc15' }}>● Stale (1)</span>
            <span style={{ color: '#94a3b8' }}>● Inactive (1)</span>
          </div>
        </div>

        {/* Split Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '260px' }}>
          {/* Query Key List */}
          <div style={{ borderRight: '1px solid #334155', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
              Queries ({queries.length})
            </div>
            {queries.map((q) => {
              const colors = getStatusColor(q.status);
              const isSelected = q.queryKey === selectedKey;
              return (
                <button
                  key={q.queryKey}
                  onClick={() => setSelectedKey(q.queryKey)}
                  style={{
                    background: isSelected ? '#334155' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {q.queryKey}
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: '3px',
                      background: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {q.status}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Query Detail Inspector */}
          <div style={{ padding: '14px', fontSize: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: '#38bdf8' }}>
                  {selectedQuery.queryKey}
                </span>
                <button
                  onClick={() => handleRefetch(selectedQuery.queryKey)}
                  style={{ background: '#f97316', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={12} className={selectedQuery.status === 'fetching' ? 'animate-spin' : ''} />
                  <span>Refetch</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '6px', color: '#cbd5e1', marginBottom: '14px' }}>
                <span style={{ color: '#94a3b8' }}>Status:</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 700, color: getStatusColor(selectedQuery.status).text }}>
                  {selectedQuery.status}
                </span>
                <span style={{ color: '#94a3b8' }}>Observers:</span>
                <span>{selectedQuery.observers} active components</span>
                <span style={{ color: '#94a3b8' }}>Updated:</span>
                <span>{selectedQuery.updatedAt}</span>
              </div>

              <div style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px' }}>Data Payload:</div>
              <pre style={{ margin: 0, background: '#020617', padding: '10px', borderRadius: '6px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '11px', maxHeight: '100px', overflowY: 'auto' }}>
                {JSON.stringify(selectedQuery.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
      },
    },
    dependencies: {
      'lucide-react': '^1.65.0',
    },
  },
}

