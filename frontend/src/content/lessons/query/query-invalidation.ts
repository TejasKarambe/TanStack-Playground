import type { LessonManifest } from '../../types'

export const queryInvalidationLesson: LessonManifest = {
  id: 'query-invalidation',
  libraryId: 'query',
  topicId: 'query-invalidation',
  title: 'Query Invalidation: Automatic Cache Synchronization',
  description: 'Connect mutations to queries by invalidating cache tags to trigger seamless background re-synchronization.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation',
  learningObjectives: [
    'Obtain the QueryClient instance using the useQueryClient hook.',
    'Trigger automated cache invalidation upon successful mutation using invalidateQueries.',
    'Understand exact vs prefix matching when invalidating query caches.',
    'Observe how active screen queries automatically refetch while inactive queries are flagged as stale.',
  ],
  conceptSections: [
    {
      title: 'Why Cache Invalidation?',
      content:
        'When data is modified on the server via a mutation, any cached queries representing that data become stale. Instead of manually stitching together updated state trees, query invalidation tells TanStack Query: "This data is outdated; refetch it automatically if a component is actively looking at it."',
    },
    {
      title: 'Active vs Inactive Invalidation',
      content:
        'When you call queryClient.invalidateQueries({ queryKey }), two things happen: 1) The query is marked as stale immediately. 2) If the query is currently mounted and being rendered on screen, TanStack Query refetches it immediately in the background without UI flickering.',
    },
    {
      title: 'Prefix Matching Rules',
      content:
        'Invalidating ["items"] will invalidate ["items"], ["items", 1], and ["items", { status: "done" }]. To invalidate only the root key without children, specify { exact: true }.',
    },
  ],
  importantApis: [
    {
      name: 'useQueryClient()',
      signature: 'useQueryClient(): QueryClient',
      description: 'Accesses the QueryClient instance from React Context.',
    },
    {
      name: 'queryClient.invalidateQueries(filters)',
      signature: 'invalidateQueries({ queryKey: [...], exact?: boolean })',
      description: 'Marks matching queries as stale and triggers active query refetches.',
    },
  ],
  previewInstructions: 'Add an item to the inventory. Watch the query state badge toggle to "⚡ Refetching..." as the list automatically refetches from the server.',
  expectedResult: 'A reactive inventory table that remains in 100% sync with the server mock after every mutation.',
  commonMistakes: [
    {
      mistake: 'Instantiating new QueryClient() inside the component instead of useQueryClient().',
      fix: 'Always use useQueryClient() to access the shared client provided by QueryClientProvider.',
    },
    {
      mistake: 'Forgetting to return the promise or await invalidateQueries if needed in onSettled.',
      fix: 'Returning the invalidateQueries promise ensures the mutation stays in isPending state until cache refetch completes if desired.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the performance advantage of invalidating queries rather than manually mutating client cache arrays?',
      answer:
        'Invalidation guarantees cache accuracy by pulling the true source of truth from the server, eliminating drift, concurrency conflicts, and server-side generated fields (such as timestamps, IDs, or computed counters).',
    },
  ],
  example: {
    id: 'query-invalidation-example',
    title: 'useQueryClient & invalidateQueries',
    description: 'Mutate server data and trigger automatic query cache invalidation.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInventory, addInventoryItem } from './api/inventory';
import type { InventoryItem } from './types/inventory';
import { Package, Plus, RefreshCw, Layers } from 'lucide-react';

const queryClient = new QueryClient();

function InventoryList() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  // 1. Subscribe to inventory query
  const { data: items, isFetching } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  // 2. Mutation that invalidates the query
  const mutation = useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => {
      // Invalidate queries matching ['inventory'] -> triggers automatic background refetch!
      qc.invalidateQueries({ queryKey: ['inventory'] });
      setName('');
      setQuantity(1);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({ name: name.trim(), quantity });
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#6366f1" />
            Inventory Stock
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {isFetching ? '⚡ Invalidated: Syncing with server...' : '✓ Cache synced'}
          </span>
        </div>
      </header>

      {/* Add Item Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name (e.g. SSD, RAM)..."
          disabled={mutation.isPending}
          style={{ flex: 2, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
        />
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          disabled={mutation.isPending}
          style={{ width: '80px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
        />
        <button
          type="submit"
          disabled={mutation.isPending || !name.trim()}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#6366f1',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={15} />
          {mutation.isPending ? 'Saving...' : 'Add Stock'}
        </button>
      </form>

      {/* Items List */}
      <div style={{ display: 'grid', gap: '8px' }}>
        {items?.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '12px 14px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={16} color="#6366f1" />
              <span style={{ fontWeight: 500, fontSize: '13px' }}>{item.name}</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, background: '#ede9fe', color: '#5b21b6', padding: '2px 10px', borderRadius: '999px' }}>
              Qty: {item.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InventoryList />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/inventory.ts': {
        code: `import type { InventoryItem, NewItemInput } from '../types/inventory';

let SERVER_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'NVMe Gen4 2TB Drive', quantity: 14 },
  { id: '2', name: 'DDR5 32GB RAM Kit', quantity: 28 },
  { id: '3', name: 'Mechanical Keychron Q1', quantity: 7 },
];

export async function fetchInventory(): Promise<InventoryItem[]> {
  await new Promise((r) => setTimeout(r, 450));
  return [...SERVER_INVENTORY];
}

export async function addInventoryItem(input: NewItemInput): Promise<InventoryItem> {
  await new Promise((r) => setTimeout(r, 500));
  const newItem: InventoryItem = {
    id: String(Date.now()),
    name: input.name,
    quantity: input.quantity,
  };
  SERVER_INVENTORY.push(newItem);
  return newItem;
}
`,
      },
      '/types/inventory.ts': {
        code: `export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export interface NewItemInput {
  name: string;
  quantity: number;
}
`,
      },
    },
  },
}

