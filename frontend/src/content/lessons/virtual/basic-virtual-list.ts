import type { LessonManifest } from '../../types'

export const virtualBasicListLesson: LessonManifest = {
  id: 'virtual-basic-list',
  libraryId: 'virtual',
  topicId: 'virtual-10k-list',
  title: 'Basic Virtual List: Rendering 10,000 Items at 60 FPS',
  description: 'Virtualize massive datasets by mounting only the rows visible in the viewport using useVirtualizer.',
  difficulty: 'BEGINNER',
  estimatedMinutes: 15,
  officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/introduction',
  learningObjectives: [
    'Initialize the virtualizer hook with useVirtualizer().',
    'Configure count, getScrollElement, and estimateSize.',
    'Render the virtualizer container with virtualizer.getTotalSize().',
    'Position visible items absolutely using item.start and transform: translateY.',
  ],
  conceptSections: [
    {
      title: 'The DOM Bottleneck',
      content:
        'Rendering 10,000 HTML DOM elements simultaneously degrades browser performance, causes memory spikes, and drops scroll frame rates down to single digits. DOM virtualization mounts only the items currently within the user viewport (plus a tiny overscan buffer of 3-5 items). As the user scrolls, off-screen nodes are recycled instantly.',
    },
    {
      title: 'Container & Transform Mechanics',
      content:
        'A virtual list consists of three layers: 1) The outer scroll container with overflow-y: auto and a ref attached to getScrollElement. 2) An inner spacer div sized to virtualizer.getTotalSize() so the browser scrollbar accurately reflects the full dataset height. 3) The mapped virtual items positioned using transform: translateY(${item.start}px).',
    },
  ],
  importantApis: [
    {
      name: 'useVirtualizer(options)',
      signature: 'useVirtualizer({ count, getScrollElement, estimateSize, overscan? })',
      description: 'Calculates active virtual row slices based on container scroll position.',
    },
    {
      name: 'virtualizer.getVirtualItems()',
      signature: 'virtualizer.getVirtualItems(): VirtualItem[]',
      description: 'Returns the array of items that should be rendered in the current frame.',
    },
    {
      name: 'virtualizer.getTotalSize()',
      signature: 'virtualizer.getTotalSize(): number',
      description: 'The computed height in pixels of the full list for scrollbar accuracy.',
    },
  ],
  previewInstructions: 'Scroll smoothly through the 10,000 item list. Try clicking "Jump to Item #5000" or "#9999" to see instant O(1) positioning.',
  expectedResult: 'Butter-smooth 60 FPS scrolling through 10,000 records with only ~15 DOM nodes mounted in the browser at any time.',
  commonMistakes: [
    {
      mistake: 'Forgetting position: "relative" on the inner scroll container.',
      fix: 'Items use absolute positioning (transform: translateY); the parent must be relative or items will stack improperly.',
    },
  ],
  interviewQuestions: [
    {
      question: 'What is the purpose of overscan in TanStack Virtual?',
      answer:
        'overscan defines how many extra items to render above and below the visible viewport. A small overscan (e.g. 5 items) ensures that fast user scrolling never exposes blank unmounted gaps before the next animation frame executes.',
    },
  ],
  example: {
    id: 'virtual-basic-list-example',
    title: '10,000 Virtual Item Feed',
    description: 'Render 10,000 items with fixed heights and programmatic scroll jumps.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-virtual': '^3.14.24',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Layers, ArrowDownCircle, Gauge } from 'lucide-react';

// Generate 10,000 synthetic records
const totalItems = 10000;
const records = Array.from({ length: totalItems }, (_, i) => ({
  id: i + 1,
  title: \`Log Entry #\${i + 1}\`,
  latency: Math.floor(Math.random() * 80) + 10,
  code: 200 + (i % 3 === 0 ? 0 : i % 5 === 0 ? 404 : 0),
}));

export default function App() {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: totalItems,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // 48px fixed row height
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#8b5cf6" />
            10,000 Items Virtualizer
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            DOM nodes mounted: <strong>{virtualItems.length}</strong> of {totalItems.toLocaleString()}
          </span>
        </div>

        {/* Jump Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => virtualizer.scrollToIndex(2500, { align: 'center' })}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '12px', cursor: 'pointer' }}
          >
            #2,500
          </button>
          <button
            onClick={() => virtualizer.scrollToIndex(5000, { align: 'center' })}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '12px', cursor: 'pointer' }}
          >
            #5,000
          </button>
          <button
            onClick={() => virtualizer.scrollToIndex(9999, { align: 'end' })}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '12px', cursor: 'pointer' }}
          >
            #10,000
          </button>
        </div>
      </header>

      {/* Outer Scroll Container */}
      <div
        ref={parentRef}
        style={{
          height: '380px',
          overflowY: 'auto',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          background: '#fff',
        }}
      >
        {/* Inner Spacer reflecting total height */}
        <div
          style={{
            height: \`\${virtualizer.getTotalSize()}px\`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Absolutely Positioned Active Virtual Items */}
          {virtualItems.map((virtualItem) => {
            const item = records[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: \`\${virtualItem.size}px\`,
                  transform: \`translateY(\${virtualItem.start}px)\`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  borderBottom: '1px solid #f1f5f9',
                  boxSizing: 'border-box',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <code style={{ fontSize: '11px', color: '#64748b', width: '55px' }}>
                    #{item.id}
                  </code>
                  <span style={{ fontWeight: 500, color: '#1e293b' }}>{item.title}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{item.latency}ms</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: item.code === 200 ? '#dcfce7' : '#fee2e2',
                      color: item.code === 200 ? '#166534' : '#991b1b',
                    }}
                  >
                    HTTP {item.code}
                  </span>
                </div>
              </div>
            );
          })}
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

