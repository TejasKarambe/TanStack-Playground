import type { LessonManifest } from '../../types'

export const queryDependentQueriesLesson: LessonManifest = {
  id: 'query-dependent-queries',
  libraryId: 'query',
  topicId: 'query-dependent',
  title: 'Dependent Queries: Sequential Execution with enabled Option',
  description: 'Execute chained queries sequentially by conditionally enabling subsequent queries with enabled: !!id.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries',
  learningObjectives: [
    'Chain queries where Query B depends on output from Query A.',
    'Use the enabled option to pause queries until prerequisites are ready.',
    'Avoid React Hooks conditional execution violations.',
    'Handle empty or unselected states gracefully.',
  ],
  conceptSections: [
    {
      title: 'The enabled Boolean Gate',
      content:
        'Because React forbids conditional hook invocations (e.g. if (userId) useQuery(...)), TanStack Query provides the enabled option. Passing enabled: Boolean(selectedUserId) keeps the query in a paused idle state until the dependent parameter becomes truthy.',
    },
    {
      title: 'Avoiding Cascading Waterfalls',
      content:
        'While dependent queries are essential when ID B requires API response A, consider whether your backend can provide a joined endpoint to eliminate client waterfalls where high latency is an issue.',
    },
  ],
  importantApis: [
    {
      name: 'enabled: boolean',
      signature: 'useQuery({ queryKey: ["orders", userId], queryFn, enabled: !!userId })',
      description: 'Controls whether the query executes automatically or waits.',
    },
    {
      name: 'fetchStatus: "idle"',
      signature: 'fetchStatus: "idle" | "fetching" | "paused"',
      description: 'Indicates query is enabled and waiting vs currently fetching.',
    },
  ],
  previewInstructions: 'Select different users from the dropdown. Notice how the Orders query stays idle until a user is chosen, then automatically fetches orders for that specific user.',
  expectedResult: 'A sequential customer orders viewer where second-level queries execute only when a user is selected.',
  commonMistakes: [
    {
      mistake: 'Putting useQuery inside an if (selectedId) block.',
      fix: 'Always declare hooks at the top level of the component and use enabled: Boolean(selectedId).',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the fetchStatus of a dependent query when enabled is false?',
      answer:
        'When enabled is false, fetchStatus is "idle" and status is "pending" (with no network request dispatched).',
    },
  ],
  example: {
    id: 'query-dependent-queries-example',
    title: 'Customer Orders Chained Query',
    description: 'Fetch user details and conditionally fetch orders using enabled.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-query': '^5.66.0',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { fetchCustomers, fetchOrdersByCustomerId } from './api/customers';
import type { Customer, Order } from './types/customer';
import { UserCheck, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

function CustomerOrderViewer() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('c1');

  // 1. Primary Query: Fetch customers
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  // 2. Dependent Query: Only runs when selectedCustomerId is truthy!
  const {
    data: orders,
    isPending: isOrdersPending,
    isFetching: isOrdersFetching,
  } = useQuery<Order[]>({
    queryKey: ['orders', { customerId: selectedCustomerId }],
    queryFn: () => fetchOrdersByCustomerId(selectedCustomerId),
    enabled: Boolean(selectedCustomerId), // Dependent guard
  });

  const selectedCustomer = customers?.find((c) => c.id === selectedCustomerId);

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={20} color="#6366f1" />
          Dependent Queries Pipeline
        </h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Query 2 (Orders) is gated by <code>enabled: Boolean(selectedCustomerId)</code>
        </span>
      </header>

      {/* Select Customer */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
          Select Customer (Primary Query):
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {customers?.map((customer) => (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomerId(customer.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: selectedCustomerId === customer.id ? '#6366f1' : '#cbd5e1',
                background: selectedCustomerId === customer.id ? '#eef2ff' : '#fff',
                color: selectedCustomerId === customer.id ? '#4338ca' : '#475569',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {customer.name}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Dependent View */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
            <ShoppingBag size={16} color="#6366f1" />
            Orders for {selectedCustomer?.name}
          </div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            {isOrdersFetching ? '⚡ Executing dependent query...' : '✓ Synced'}
          </span>
        </div>

        {isOrdersPending ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 6px' }} />
            Fetching customer order history...
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {orders?.map((order) => (
              <div
                key={order.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{order.item}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Order #{order.id}</div>
                </div>
                <strong style={{ fontSize: '13px', color: '#16a34a' }}>
                  \${order.total.toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerOrderViewer />
    </QueryClientProvider>
  );
}
`,
      },
      '/api/customers.ts': {
        code: `import type { Customer, Order } from '../types/customer';

export async function fetchCustomers(): Promise<Customer[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: 'c1', name: 'Acme Logistics' },
    { id: 'c2', name: 'Global Cloud Systems' },
    { id: 'c3', name: 'Vertex AI Labs' },
  ];
}

export async function fetchOrdersByCustomerId(customerId: string): Promise<Order[]> {
  await new Promise((r) => setTimeout(r, 600));

  const ordersMap: Record<string, Order[]> = {
    c1: [
      { id: 'ORD-101', item: 'Fleet GPS Transmitters (x10)', total: 1200 },
      { id: 'ORD-102', item: 'Rugged Tablet Docks (x5)', total: 650 },
    ],
    c2: [
      { id: 'ORD-201', item: 'Bare-Metal Rack Servers (x2)', total: 5400 },
      { id: 'ORD-202', item: '40Gbps Fiber Optic Cables', total: 320 },
    ],
    c3: [
      { id: 'ORD-301', item: 'H100 Tensor Cloud Units (500 hrs)', total: 12500 },
    ],
  };

  return ordersMap[customerId] || [];
}
`,
      },
      '/types/customer.ts': {
        code: `export interface Customer {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  item: string;
  total: number;
}
`,
      },
    },
  },
}

