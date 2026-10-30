import type { LessonManifest } from '../../types'

export const virtualHorizontalLesson: LessonManifest = {
  id: 'virtual-horizontal',
  libraryId: 'virtual',
  topicId: 'virtual-horizontal',
  title: 'Horizontal Virtualization: Multi-Year Timeline Carousel',
  description: 'Virtualize horizontal timelines and wide data sequences using horizontal: true and translateX transforms.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/horizontal',
  learningObjectives: [
    'Configure horizontal virtualizers with horizontal: true.',
    'Apply translateX transforms to position columns and timeline cards.',
    'Manage horizontal scroll containers with overflow-x: auto.',
    'Execute horizontal jumps using virtualizer.scrollToIndex().',
  ],
  conceptSections: [
    {
      title: 'Virtualizing the Horizontal Axis',
      content:
        'Spreadsheets, Gantt charts, audio waveforms, and multi-year release timelines require horizontal scrolling. Passing horizontal: true to useVirtualizer causes it to observe container scrollLeft and calculate column widths instead of heights.',
    },
    {
      title: 'Container Widths & Transforms',
      content:
        'The inner spacer div sets width: virtualizer.getTotalSize() px, while virtual cards are positioned using transform: translateX(${item.start}px).',
    },
  ],
  importantApis: [
    {
      name: 'horizontal: true',
      signature: 'useVirtualizer({ horizontal: true, count, getScrollElement, estimateSize })',
      description: 'Instructs the virtualizer to compute horizontal offsets along the X-axis.',
    },
    {
      name: 'virtualizer.scrollToIndex()',
      signature: 'virtualizer.scrollToIndex(index, { align: "center" })',
      description: 'Scrolls horizontally to the target card index.',
    },
  ],
  previewInstructions: 'Scroll horizontally through 1,000 timeline milestone cards. Use the year jump buttons (2024, 2025, 2026, 2027) to scroll across multiple years instantly.',
  expectedResult: 'A fluid horizontal project timeline rendering only the ~5 cards currently visible on screen.',
  commonMistakes: [
    {
      mistake: 'Using translateY transforms instead of translateX for horizontal virtualizers.',
      fix: 'When horizontal: true is set, position items using transform: translateX(${item.start}px).',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Virtual determine whether to listen to scrollLeft or scrollTop?',
      answer:
        'When horizontal: true is passed to useVirtualizer, it subscribes to scrollLeft and clientWidth events on the parent scroll element.',
    },
  ],
  example: {
    id: 'example-virtual-horizontal',
    title: '1,000 Milestone Horizontal Roadmap Timeline',
    description: 'Horizontal virtualization along the X-axis with programmatic year navigation.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Calendar, ChevronRight, Milestone, ArrowRight, Flag } from 'lucide-react';

const totalMilestones = 1000;
const cardWidth = 220;

export default function App() {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: totalMilestones,
    getScrollElement: () => parentRef.current,
    estimateSize: () => cardWidth,
    overscan: 3,
  });

  const jumpToYear = (yearIndex: number) => {
    virtualizer.scrollToIndex(yearIndex, { align: 'start' });
  };

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '640px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Milestone size={20} color="#059669" />
          <span>Horizontal Roadmap Timeline</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Virtualizing 1,000 milestone cards horizontally with <code>horizontal: true</code>.
        </p>
      </header>

      {/* Year Jump Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Quick Year Jump:</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: '2024 (Sprint 1)', index: 0 },
            { label: '2025 (Sprint 250)', index: 250 },
            { label: '2026 (Sprint 500)', index: 500 },
            { label: '2027 (Sprint 750)', index: 750 },
          ].map((btn) => (
            <button
              key={btn.index}
              onClick={() => jumpToYear(btn.index)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostics */}
      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Total cards: <strong>{totalMilestones}</strong></span>
        <span>Active DOM elements: <strong>{virtualItems.length} cards</strong></span>
        <span>Track width: <strong>{(virtualizer.getTotalSize() / 1000).toFixed(1)}k px</strong></span>
      </div>

      {/* Horizontal Scroll Window */}
      <div
        ref={parentRef}
        style={{
          width: '100%',
          overflowX: 'auto',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          background: '#f8fafc',
          position: 'relative',
          padding: '16px 0',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: \`\${virtualizer.getTotalSize()}px\`,
            height: '180px',
            position: 'relative',
          }}
        >
          {virtualItems.map((item) => {
            const sprintNum = item.index + 1;
            const year = 2024 + Math.floor(item.index / 250);

            return (
              <div
                key={item.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: \`\${item.size}px\`,
                  transform: \`translateX(\${item.start}px)\`,
                  padding: '0 8px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ height: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                        {year}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                        #{sprintNum}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a', marginBottom: '4px' }}>
                      Sprint Delivery #{sprintNum}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Release targets & feature bundle checklist.
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#475569' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flag size={12} color="#059669" /> Milestone
                    </span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>Ready</span>
                  </div>
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
    dependencies: {
      '@tanstack/react-virtual': '^3.13.1',
      'lucide-react': '^1.65.0',
    },
  },
}

