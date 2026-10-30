import type { LessonManifest } from '../../types'

export const virtualVariableHeightLesson: LessonManifest = {
  id: 'virtual-variable-height',
  libraryId: 'virtual',
  topicId: 'virtual-variable-height',
  title: 'Variable-Height Rows: Dynamic Measurement with measureElement',
  description: 'Render rows with unpredictable content heights using measureElement callbacks and dynamic size recalculation.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/virtual/latest/docs/guide/dynamic',
  learningObjectives: [
    'Attach ref={virtualizer.measureElement} to dynamically sized row DOM nodes.',
    'Provide estimateSize as a baseline fallback before elements are measured.',
    'Handle row expand/collapse toggles that resize elements after initial render.',
    'Prevent scroll jumping when items change height during scrolling.',
  ],
  conceptSections: [
    {
      title: 'Fixed vs Dynamic Item Measurement',
      content:
        'When rows contain variable-length paragraphs, expandable comment threads, or loaded images, row height cannot be predicted statically. TanStack Virtual measures the actual rendered clientHeight of each mounted node via measureElement and dynamically updates total scroll dimensions.',
    },
    {
      title: 'The Role of estimateSize',
      content:
        'Even with dynamic measurement, estimateSize provides an approximate height for unmounted off-screen items so the scrollbar remains proportional before items are scrolled into view.',
    },
  ],
  importantApis: [
    {
      name: 'ref={virtualizer.measureElement}',
      signature: 'ref={virtualizer.measureElement} data-index={item.index}',
      description: 'Ref callback that measures actual DOM height and informs the virtualizer.',
    },
    {
      name: 'estimateSize',
      signature: 'estimateSize: () => 70',
      description: 'Baseline height approximation for off-screen unmeasured rows.',
    },
  ],
  previewInstructions: 'Click "Expand Details" on various discussion posts. Watch the row expand smoothly while sibling rows adjust their positions without scroll displacement.',
  expectedResult: 'A forum discussion feed where rows have varying text heights and expand/collapse dynamically without layout glitches.',
  commonMistakes: [
    {
      mistake: 'Forgetting to pass data-index={item.index} or ref={virtualizer.measureElement}.',
      fix: 'measureElement requires data-index on the node to identify which item index was measured.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Virtual handle dynamic height changes when an item expands or collapses?',
      answer:
        'When an item node resizes, measureElement registers the updated height in the virtualizer cache, recalculates subsequent item offsets, and updates the total scroll container size.',
    },
  ],
  example: {
    id: 'example-virtual-variable-height',
    title: 'Dynamic Comment Thread with Dynamic Row Measurement',
    description: 'Dynamic variable-height rows measured via measureElement with expand/collapse controls.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MessageSquare, ChevronDown, ChevronUp, User, ThumbsUp } from 'lucide-react';

// Generates dynamic posts with random lengths
const initialPosts = Array.from({ length: 500 }, (_, i) => {
  const sentences = [
    'TanStack Virtual completely changed how we handle our internal dashboard analytics.',
    'The headless nature of these libraries means we keep 100% control over design systems and Tailwind styling.',
    'When dealing with variable height rows, attaching measureElement ensures zero scroll position jumps.',
    'We combined TanStack Query with TanStack Virtual for an infinite feed with 50,000 community comments.',
    'Make sure to pass data-index to the measured element so the virtualizer maps the height measurement accurately.',
  ];
  const count = (i % 4) + 1;
  const content = sentences.slice(0, count).join(' ');

  return {
    id: i + 1,
    author: ['Sarah Connor', 'Alex Mercer', 'David Chen', 'Elena Rostova'][i % 4],
    timestamp: \`\${(i % 12) + 1}h ago\`,
    likes: (i * 7) % 45,
    content,
    expanded: false,
  };
});

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
  });

  const toggleExpand = (index: number) => {
    setPosts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, expanded: !p.expanded } : p))
    );
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '620px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={20} color="#7c3aed" />
          <span>Variable-Height Discussion Stream</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          500 dynamic posts measured with <code>ref={'{'}virtualizer.measureElement{'}'}</code>.
        </p>
      </header>

      {/* Virtual Scroll Window */}
      <div
        ref={parentRef}
        style={{
          height: '460px',
          overflowY: 'auto',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          background: '#f8fafc',
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
          {virtualizer.getVirtualItems().map((item) => {
            const post = posts[item.index];
            return (
              <div
                key={item.key}
                data-index={item.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: \`translateY(\${item.start}px)\`,
                  padding: '10px 16px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                        {post.author[0]}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{post.author}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>#{post.id} • {post.timestamp}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ThumbsUp size={12} /> {post.likes}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                    {post.content}
                  </p>

                  {post.expanded && (
                    <div style={{ background: '#f1f5f9', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', color: '#475569', marginBottom: '10px', borderLeft: '3px solid #7c3aed' }}>
                      <strong>Expanded Diagnostics:</strong> Measured DOM node height for post #{post.id} automatically recalculated scroll offsets for all subsequent items.
                    </div>
                  )}

                  <button
                    onClick={() => toggleExpand(item.index)}
                    style={{ background: 'transparent', border: 'none', color: '#7c3aed', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {post.expanded ? (
                      <>
                        <ChevronUp size={14} /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> Expand Details & Replies
                      </>
                    )}
                  </button>
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

