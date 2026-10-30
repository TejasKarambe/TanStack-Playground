import type { LessonManifest } from '../../types'

export const storeBasicsLesson: LessonManifest = {
  id: 'store-basics',
  libraryId: 'store',
  topicId: 'store-basics',
  title: 'TanStack Store: Framework-Agnostic Reactive State & Subscriptions',
  description: 'Create lightweight reactive stores outside React, subscribe with fine-grained selectors, and compute derived state.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  officialDocUrl: 'https://tanstack.com/store/latest/docs/guide/introduction',
  learningObjectives: [
    'Instantiate standalone stores with new Store(initialState).',
    'Update state immutably using store.setState((prev) => ...).',
    'Subscribe components with useStore(store, selector) for targeted re-renders.',
    'Compute derived values and listen to raw changes via store.subscribe().',
  ],
  conceptSections: [
    {
      title: 'State Outside the React Component Lifecycle',
      content:
        'TanStack Store is a zero-dependency, framework-agnostic micro state container. Stores live outside the React tree, making them accessible in pure utility functions, WebSocket callbacks, route loaders, and background workers without Context boilerplate.',
    },
    {
      title: 'Fine-Grained Selector Re-Renders',
      content:
        'When using useStore(cartStore, (state) => state.totalItems), the component re-renders ONLY when totalItems changes, completely ignoring changes to unrelated fields in the store.',
    },
  ],
  importantApis: [
    {
      name: 'new Store(initialState)',
      signature: 'const store = new Store({ count: 0 })',
      description: 'Creates a reactive observable store instance.',
    },
    {
      name: 'store.setState(updater)',
      signature: 'store.setState((prev) => ({ ...prev, count: prev.count + 1 }))',
      description: 'Dispatches state updates and notifies subscribers.',
    },
    {
      name: 'useStore(store, selector)',
      signature: 'const value = useStore(store, (state) => state.property)',
      description: 'React hook that subscribes to a slice of the store.',
    },
  ],
  previewInstructions: 'Add items to the shopping cart. Watch the re-render counters: only the targeted subscriber components re-render when their respective slices change.',
  expectedResult: 'A reactive cart store demonstrating store.setState, useStore selectors, and outside-React console subscriptions.',
  commonMistakes: [
    {
      mistake: 'Directly mutating properties on store.state instead of using store.setState.',
      fix: 'Always call store.setState((prev) => ({ ...prev, ... })) to notify subscribers.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Store achieve framework independence?',
      answer:
        'The core @tanstack/store package contains zero React dependencies and exposes simple subscribe() and setState() primitives. Framework adapters (like @tanstack/react-store) wrap this core with useSyncExternalStore.',
    },
  ],
  example: {
    id: 'example-store-basics',
    title: 'E-Commerce Cart Store with Re-Render Diagnostics',
    description: 'Demonstrating new Store(), store.setState(), useStore() selector isolation, and derived calculations.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useRef } from 'react';
import { Store, useStore } from '@tanstack/react-store';
import { ShoppingBag, Plus, Minus, RotateCcw, Box, Eye } from 'lucide-react';

// 1. Create Standalone Reactive Store
interface CartState {
  items: { id: string; name: string; price: number; quantity: number }[];
  promoDiscount: number;
}

export const cartStore = new Store<CartState>({
  items: [
    { id: 'item_1', name: 'TanStack Mug', price: 18, quantity: 1 },
    { id: 'item_2', name: 'Developer Sticker Pack', price: 9, quantity: 2 },
  ],
  promoDiscount: 0.15,
});

// Component 1: Renders only cart item count (Watches items.length)
function CartHeader() {
  const renderCount = useRef(0);
  renderCount.current++;

  const totalQuantity = useStore(cartStore, (s) =>
    s.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eef2ff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #c7d2fe', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4338ca', fontWeight: 600, fontSize: '13px' }}>
        <ShoppingBag size={16} /> Total Items in Cart: {totalQuantity}
      </div>
      <span style={{ fontSize: '11px', color: '#6366f1', background: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
        Header Renders: {renderCount.current}
      </span>
    </div>
  );
}

// Component 2: Renders order summary & total price calculation
function OrderSummary() {
  const renderCount = useRef(0);
  renderCount.current++;

  const { subtotal, discountAmount, grandTotal } = useStore(cartStore, (s) => {
    const rawSubtotal = s.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const disc = rawSubtotal * s.promoDiscount;
    return {
      subtotal: rawSubtotal,
      discountAmount: disc,
      grandTotal: rawSubtotal - disc,
    };
  });

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px', fontSize: '13px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ color: '#64748b' }}>Subtotal:</span>
        <span style={{ fontWeight: 600 }}>\${subtotal.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#059669' }}>
        <span>Special Promo (15% off):</span>
        <span style={{ fontWeight: 600 }}>-\${discountAmount.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '8px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
        <span>Final Total:</span>
        <span>\${grandTotal.toFixed(2)}</span>
      </div>
      <div style={{ marginTop: '8px', textAlign: 'right', fontSize: '11px', color: '#94a3b8' }}>
        Summary Renders: {renderCount.current}
      </div>
    </div>
  );
}

export default function App() {
  const items = useStore(cartStore, (s) => s.items);

  const updateQuantity = (id: string, delta: number) => {
    cartStore.setState((prev) => ({
      ...prev,
      items: prev.items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    }));
  };

  const resetCart = () => {
    cartStore.setState(() => ({
      items: [
        { id: 'item_1', name: 'TanStack Mug', price: 18, quantity: 1 },
        { id: 'item_2', name: 'Developer Sticker Pack', price: 9, quantity: 2 },
      ],
      promoDiscount: 0.15,
    }));
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '560px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={20} color="#6366f1" />
            <span>TanStack Store: Reactive State</span>
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Lightweight, framework-agnostic store with fine-grained subscription selectors.
          </p>
        </div>
        <button
          onClick={resetCart}
          title="Reset Cart"
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <RotateCcw size={13} /> Reset
        </button>
      </header>

      <CartHeader />

      {/* Cart Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>\${item.price.toFixed(2)} each</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => updateQuantity(item.id, -1)}
                style={{ width: '26px', height: '26px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Minus size={13} />
              </button>
              <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                style={{ width: '26px', height: '26px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <OrderSummary />
    </div>
  );
}
`,
      },
    },
    dependencies: {
      '@tanstack/react-store': '^0.11.2',
      'lucide-react': '^1.65.0',
    },
  },
}

