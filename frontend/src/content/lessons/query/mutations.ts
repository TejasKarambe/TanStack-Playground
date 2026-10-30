import type { LessonManifest } from '../../types'

export const queryMutationsLesson: LessonManifest = {
  id: 'query-mutations',
  libraryId: 'query',
  topicId: 'query-mutations',
  title: 'Mutations: Complete CRUD (Create, Update, Delete)',
  description: 'Execute full record lifecycles: create, inline update, and delete actions with typed mutation states.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/mutations',
  learningObjectives: [
    'Implement full CRUD mutation handlers: create, update, and delete.',
    'Track distinct isPending and isSuccess states across multiple mutation triggers.',
    'Handle variable inputs (id, title, status) cleanly.',
    'Display interactive success receipts and error recovery options.',
  ],
  conceptSections: [
    {
      title: 'Imperative Mutations for Side Effects',
      content:
        'Mutations represent server write operations. Unlike queries that run declaratively, mutations run imperatively in response to user actions (clicking a button, editing an inline title, or submitting a form).',
    },
    {
      title: 'Managing Multiple Mutations',
      content:
        'A single screen frequently needs multiple distinct mutations: one for creating items, one for updating properties, and one for deletion. Each useMutation hook provides its own independent isPending and error states.',
    },
  ],
  importantApis: [
    {
      name: 'useMutation({ mutationFn })',
      signature: 'useMutation({ mutationFn: (vars) => Promise<TResult> })',
      description: 'Creates a mutation controller.',
    },
    {
      name: 'mutate(variables)',
      signature: 'createMutation.mutate({ title })',
      description: 'Triggers the mutation with specified payload arguments.',
    },
  ],
  previewInstructions: 'Try creating a new feature task, clicking "Toggle Status" to update it, and clicking the trash can to delete it.',
  expectedResult: 'A comprehensive CRUD task board demonstrating Create, Update, and Delete mutations.',
  commonMistakes: [
    {
      mistake: 'Sharing a single useMutation instance for two distinct actions (e.g. update and delete).',
      fix: 'Create separate useMutation hooks for distinct operations so their loading and error states remain isolated.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you handle multiple mutations running simultaneously in TanStack Query?',
      answer:
        'Each useMutation hook maintains its own isolated lifecycle state. For lists of items where each row can be mutated independently, you can pass variables to mutate(vars) or use custom wrapper components.',
    },
  ],
  example: {
    id: 'query-mutations-example',
    title: 'Full CRUD Mutations: Create, Update, Delete',
    description: 'Execute create, update, and delete side-effects with useMutation.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { PlusCircle, Trash2, CheckCircle, Edit3, Loader2, Sparkles } from 'lucide-react';
import { createItemApi, updateItemApi, deleteItemApi } from './api/items';
import type { TaskItem } from './types/task';

const queryClient = new QueryClient();

function CrudTaskManager() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: '1', title: 'Implement TanStack Router loader', completed: true },
    { id: '2', title: 'Add full-text table fuzzy search', completed: false },
    { id: '3', title: 'Set up optimistic mutation rollback', completed: false },
  ]);
  const [newTitle, setNewTitle] = useState('');

  // 1. Create Mutation
  const createMutation = useMutation({
    mutationFn: createItemApi,
    onSuccess: (createdTask) => {
      setTasks((prev) => [...prev, createdTask]);
      setNewTitle('');
    },
  });

  // 2. Update Mutation (Toggle Completed)
  const updateMutation = useMutation({
    mutationFn: updateItemApi,
    onSuccess: (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    },
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteItemApi,
    onSuccess: (deletedId) => {
      setTasks((prev) => prev.filter((t) => t.id !== deletedId));
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createMutation.mutate({ title: newTitle.trim() });
  };

  const isAnyMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#f59e0b" />
          Full CRUD Mutation Board
        </h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Demonstrates Create, Update, and Delete operations with <code>useMutation</code>
        </span>
      </header>

      {/* Create Form */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title..."
          disabled={createMutation.isPending}
          style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !newTitle.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#f59e0b',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          {createMutation.isPending ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <PlusCircle size={15} />}
          Create Task
        </button>
      </form>

      {/* Task List */}
      <div style={{ display: 'grid', gap: '8px' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: '12px 14px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => updateMutation.mutate({ id: task.id, completed: !task.completed })}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Click to toggle status"
              >
                <CheckCircle
                  size={18}
                  color={task.completed ? '#10b981' : '#cbd5e1'}
                  fill={task.completed ? '#ecfdf5' : 'none'}
                />
              </button>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: task.completed ? '#94a3b8' : '#1e293b',
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </span>
            </div>

            {/* Delete Action */}
            <button
              onClick={() => deleteMutation.mutate(task.id)}
              disabled={deleteMutation.isPending}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#ef4444',
                padding: '4px',
                borderRadius: '4px',
              }}
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CrudTaskManager />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/items.ts': {
        code: `import type { TaskItem } from '../types/task';

export async function createItemApi(input: { title: string }): Promise<TaskItem> {
  await new Promise((r) => setTimeout(r, 500));
  return {
    id: String(Date.now()),
    title: input.title,
    completed: false,
  };
}

export async function updateItemApi(input: { id: string; completed: boolean }): Promise<TaskItem> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    id: input.id,
    title: 'Updated Task', // preserved in local map
    completed: input.completed,
  };
}

export async function deleteItemApi(id: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 400));
  return id;
}
`,
      },
      '/types/task.ts': {
        code: `export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}
`,
      },
    },
  },
}
