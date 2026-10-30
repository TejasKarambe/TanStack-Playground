import type { LessonManifest } from '../../types'

export const virtualLargeDatasetLesson: LessonManifest = {
  id: 'virtual-large-dataset',
  libraryId: 'virtual',
  topicId: 'virtual-large-dataset',
  title: 'Large Datasets: 100,000 Items with Interactive Tuning',
  description: 'Control dataset size, overscan buffer, row height, and instant scroll jumping while monitoring live rendered DOM metrics.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/introduction',
  learningObjectives: [
    'Virtualize ultra-large datasets (10,000 to 100,000 items) without browser memory leaks.',
    'Tune the overscan property to eliminate white flashes during fast fling scrolls.',
    'Execute programmatic instant jumps with virtualizer.scrollToIndex().',
    'Inspect live DOM telemetry comparing total items vs actively mounted elements.',
  ],
  conceptSections: [
    {
      title: 'Scalability: From 10K to 100K Items',
      content:
        'Because useVirtualizer only computes mathematics based on scroll offsets and indices, list performance is virtually identical whether rendering 1,000 items or 100,000 items. Memory consumption remains constant because only visible items exist in the DOM.',
    },
    {
      title: 'Tuning Overscan for Smooth Scrolls',
      content:
        'The overscan option specifies how many rows outside the viewport should be pre-rendered above and below. Setting overscan: 5-10 guarantees that fast mobile flings and mouse wheel spins do not reveal blank areas before items render.',
    },
  ],
  importantApis: [
    {
      name: 'overscan',
      signature: 'overscan: number (default 1)',
      description: 'Number of extra items to render outside the visible viewport window.',
    },
    {
      name: 'virtualizer.scrollToIndex()',
      signature: 'virtualizer.scrollToIndex(index, { align: "start" | "center" | "end" })',
      description: 'Scrolls directly to the specified item index instantly or smoothly.',
    },
  ],
  previewInstructions: 'Adjust the Dataset Size slider from 10,000 to 100,000 items. Change the Overscan slider and Row Height. Use the Jump input to jump straight to item #50,000 and observe the live DOM node counter.',
  expectedResult: 'A high-performance virtualized feed showing 100,000 items with interactive sliders and real-time DOM telemetry.',
  commonMistakes: [
    {
      mistake: 'Setting overscan to hundreds of items.',
      fix: 'Keep overscan between 3 and 10. High overscan negates virtualization performance benefits.',
    },
  ],
  interviewQuestions: [
    {
      question: 'Why does memory usage in TanStack Virtual remain constant regardless of dataset size?',
      answer:
        'Because TanStack Virtual only instantiates DOM nodes for elements currently in the viewport plus overscan. A list with 100,000 items mounts the exact same number of DOM elements (~15) as a list with 100 items.',
    },
  ],
  example: {
    id: 'example-virtual-large-dataset',
    title: '100,000 Items Virtual List with Interactive Controls',
    description: 'Interactive sliders for dataset count, row height, and overscan buffer with live DOM node diagnostics.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Layers, Sliders, ArrowDown, Activity, Cpu } from 'lucide-react';

export default function App() {
  const [itemCount, setItemCount] = useState(50000);
  const [rowHeight, setRowHeight] = useState(48);
  const [overscan, setOverscan] = useState(5);
  const [jumpIndex, setJumpIndex] = useState(25000);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: itemCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const renderedCount = virtualItems.length;

  const handleJump = (target: number) => {
    const clamped = Math.max(0, Math.min(itemCount - 1, target));
    virtualizer.scrollToIndex(clamped, { align: 'center' });
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '640px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="#0284c7" />
          <span>Large Dataset Virtualization Controls</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Real-time performance tuning for up to 100,000 virtual records.
        </p>
      </header>

      {/* Interactive Sliders & Controls */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>
            Dataset Size: {itemCount.toLocaleString()}
          </label>
          <input
            type="range"
            min={1000}
            max={100000}
            step={5000}
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>
            Row Height: {rowHeight}px
          </label>
          <input
            type="range"
            min={36}
            max={80}
            step={4}
            value={rowHeight}
            onChange={(e) => setRowHeight(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '4px' }}>
            Overscan Buffer: {overscan}
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={overscan}
            onChange={(e) => setOverscan(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Programmatic Jump & Telemetry Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', background: '#0f172a', color: '#fff', padding: '10px 14px', borderRadius: '6px', fontSize: '12px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div>
            <span style={{ color: '#94a3b8' }}>Total Dataset: </span>
            <strong style={{ color: '#38bdf8' }}>{itemCount.toLocaleString()}</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Rendered in DOM: </span>
            <strong style={{ color: '#4ade80' }}>{renderedCount} nodes</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Efficiency: </span>
            <strong style={{ color: '#facc15' }}>{((renderedCount / itemCount) * 100).toFixed(3)}%</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => handleJump(jumpIndex)}
            style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
          >
            Jump to #{jumpIndex}
          </button>
          <input
            type="number"
            min={0}
            max={itemCount - 1}
            value={jumpIndex}
            onChange={(e) => setJumpIndex(Number(e.target.value))}
            style={{ width: '60px', padding: '3px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #475569', background: '#1e293b', color: '#fff' }}
          />
        </div>
      </div>

      {/* Virtual Scroll Window */}
      <div
        ref={parentRef}
        style={{
          height: '420px',
          overflowY: 'auto',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          background: '#ffffff',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: \`\${virtualizer.getTotalSize()}px\`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((item) => {
            const isTarget = item.index === jumpIndex;
            return (
              <div
                key={item.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: \`\${item.size}px\`,
                  transform: \`translateY(\${item.start}px)\`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  boxSizing: 'border-box',
                  borderBottom: '1px solid #f1f5f9',
                  background: isTarget ? '#eff6ff' : item.index % 2 === 0 ? '#ffffff' : '#fafafa',
                  fontSize: '13px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: isTarget ? '#2563eb' : '#64748b', width: '70px' }}>
                    #{item.index.toLocaleString()}
                  </span>
                  <span style={{ color: '#1e293b' }}>Telemetry Log Record - Sensor Stream #{item.index % 128}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {item.start}px - {item.start + item.size}px
                </span>
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
    dependencies: {
      '@tanstack/react-virtual': '^3.13.1',
      'lucide-react': '^1.65.0',
    },
  },
}

