import type { LessonManifest } from '../../types'

export const dbCollectionsLesson: LessonManifest = {
  id: 'db-collections',
  libraryId: 'db',
  topicId: 'db-collections',
  title: 'TanStack DB: Reactive Collections & Live Queries',
  description: 'Manage local-first schema collections, optimistic client mutations, and reactive query synchronization.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com',
  learningObjectives: [
    'Define schema-validated client collections with primary keys and index definitions.',
    'Execute live reactive queries that update instantly when collection data mutates.',
    'Perform optimistic inserts, updates, and deletes with pending sync flags.',
    'Understand local-first database synchronization and conflict resolution strategies.',
  ],
  conceptSections: [
    {
      title: 'Local-First Architecture',
      content:
        'TanStack DB is a reactive client-side database designed for offline-first, high-performance web applications. Instead of querying remote servers on every render, applications read and mutate local collections synchronously. Background sync adapters handle delta-replication to PostgreSQL servers.',
    },
    {
      title: 'Package Maturity & Specifications',
      content:
        'Package: @tanstack/db (Release Candidate / Experimental). TanStack DB represents the next evolution of local-first reactive storage, integrating directly with TanStack Store and TanStack Query.',
    },
  ],
  importantApis: [
    {
      name: 'createCollection()',
      signature: 'createCollection({ name: string, primaryKey: string, schema: z.ZodSchema })',
      description: 'Initializes a reactive client collection with schema enforcement.',
    },
    {
      name: 'collection.liveQuery()',
      signature: 'collection.liveQuery((records) => records.filter(...))',
      description: 'Subscribes to live collection updates with zero re-query latency.',
    },
  ],
  previewInstructions: 'Add new records to the local collection, edit status inline, or delete items. Observe the live query updates and synchronized sync state status badges.',
  expectedResult: 'A reactive local-first database view with instant UI updates and background synchronization simulation.',
  commonMistakes: [
    {
      mistake: 'Assuming client-side local queries need async await promises.',
      fix: 'Local collections in memory are synchronous and reactive, delivering zero-latency updates.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the primary advantage of a local-first database like TanStack DB over standard REST caching?',
      answer:
        'Local-first databases support offline access, instantaneous reads/writes without network spinners, and treat remote servers as replication targets rather than blocking dependencies.',
    },
  ],
  example: {
    id: 'example-db-collections',
    title: 'Reactive Client Collection with Optimistic Synchronization',
    description: 'Demonstrating local-first reactive collections, live queries, and pending sync badges.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { HardDrive, Plus, Trash2, RefreshCw, CheckCircle2, Clock, CloudOff } from 'lucide-react';

interface TaskRecord {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  syncStatus: 'SYNCED' | 'PENDING_UPLOAD';
}

export default function App() {
  const [tasks, setTasks] = useState<TaskRecord[]>([
    { id: 'rec_1', title: 'Implement local index caching', priority: 'HIGH', syncStatus: 'SYNCED' },
    { id: 'rec_2', title: 'Schema migration for v2 schema', priority: 'MEDIUM', syncStatus: 'SYNCED' },
    { id: 'rec_3', title: 'Delta conflict resolution tests', priority: 'HIGH', syncStatus: 'SYNCED' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Add item with optimistic pending sync status
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newRecord: TaskRecord = {
      id: \`rec_\${Date.now()}\`,
      title: newTaskTitle.trim(),
      priority: 'MEDIUM',
      syncStatus: 'PENDING_UPLOAD',
    };
    setTasks((prev) => [newRecord, ...prev]);
    setNewTaskTitle('');

    // Trigger simulated background replication
    triggerBackgroundReplication();
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerBackgroundReplication = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.syncStatus === 'PENDING_UPLOAD' ? { ...t, syncStatus: 'SYNCED' } : t))
      );
      setIsSyncing(false);
    }, 1200);
  };

  const pendingCount = tasks.filter((t) => t.syncStatus === 'PENDING_UPLOAD').length;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={20} color="#ec4899" />
            <span>TanStack DB: Reactive Collections</span>
          </h2>
          <span style={{ fontSize: '11px', background: isSyncing ? '#fef3c7' : '#ecfdf5', color: isSyncing ? '#b45309' : '#059669', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Replicating deltas...' : 'Local DB Synced'}
          </span>
        </div>
        <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b' }}>
          Local-first reactive database collection with zero-latency optimistic writes.
        </p>
      </header>

      {/* Input Form */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New record title..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button
          onClick={handleAddTask}
          style={{ background: '#db2777', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Plus size={15} /> Add Record
        </button>
      </div>

      {/* Telemetry Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
        <span>Total Records in Collection: <strong>{tasks.length}</strong></span>
        <span>Pending Server Upload: <strong>{pendingCount}</strong></span>
      </div>

      {/* Collection List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{task.title}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>ID: {task.id}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  background: task.syncStatus === 'SYNCED' ? '#ecfdf5' : '#fffbeb',
                  color: task.syncStatus === 'SYNCED' ? '#059669' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {task.syncStatus === 'SYNCED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                {task.syncStatus}
              </span>

              <button
                onClick={() => handleDelete(task.id)}
                title="Delete record"
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
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

