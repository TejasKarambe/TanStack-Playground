import type { LessonManifest } from '../../types'

export const rangerMultiSliderLesson: LessonManifest = {
  id: 'ranger-multi-slider',
  libraryId: 'ranger',
  topicId: 'ranger-multi-slider',
  title: 'TanStack Ranger: Headless Multi-Handle Range Sliders',
  description: 'Construct custom, accessible multi-handle sliders and single-value sliders with headless track mathematics.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 15,
  officialDocUrl: 'https://tanstack.com/ranger/latest',
  learningObjectives: [
    'Initialize headless slider logic with useRanger().',
    'Configure min, max, step, and values array for multi-thumb bounding.',
    'Render customizable slider tracks, highlight intervals, and drag handles.',
    'Support keyboard arrow navigation and accessibility aria attributes.',
  ],
  conceptSections: [
    {
      title: 'Headless Slider Mechanics',
      content:
        'Standard HTML <input type="range" /> only supports a single thumb value and is notoriously difficult to style consistently across browsers. TanStack Ranger computes handle percentage positions, boundary collisions, and track intervals while leaving 100% of the DOM and CSS design to you.',
    },
    {
      title: 'Package Maturity & Verification',
      content:
        'Package: @tanstack/react-ranger (Alpha). TanStack Ranger is the official headless slider utility for the TanStack ecosystem.',
    },
  ],
  importantApis: [
    {
      name: 'useRanger()',
      signature: 'useRanger({ values, min, max, stepSize, onChange })',
      description: 'Calculates handle positions, percentage offsets, and event listeners.',
    },
    {
      name: 'ranger.handles()',
      signature: 'ranger.handles().map((handle) => ...)',
      description: 'Supplies props and percentage positions for rendering drag thumbs.',
    },
  ],
  previewInstructions: 'Drag the Min Price and Max Price handles to adjust the filtering interval. Toggle between the Range Slider mode and the Single Value slider mode.',
  expectedResult: 'Smooth multi-handle range selection with active colored track highlights and numeric feedback.',
  commonMistakes: [
    {
      mistake: 'Allowing min handle to cross past max handle without collision clamping.',
      fix: 'TanStack Ranger handles sorting and handle clamping automatically when values is an array.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does TanStack Ranger calculate the highlighted active segment between two handles?',
      answer:
        'It computes the percentage difference between handle 0 and handle 1: left: `${handles[0].value}%`, width: `${handles[1].value - handles[0].value}%`.',
    },
  ],
  example: {
    id: 'example-ranger-multi-slider',
    title: 'Dual-Handle Price Filter & Single Slider Controls',
    description: 'Demonstrating headless multi-handle range selection and single-value interactive sliders.',
    entryFile: '/App.tsx',
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import { Sliders, DollarSign, Volume2, Shield } from 'lucide-react';

export default function App() {
  // Dual handle values: [minPrice, maxPrice]
  const [priceRange, setPriceRange] = useState<[number, number]>([150, 650]);
  const [singleValue, setSingleValue] = useState(65);

  const min = 0;
  const max = 1000;

  // Percentage calculations for dual-handle track highlight
  const minPercent = ((priceRange[0] - min) / (max - min)) * 100;
  const maxPercent = ((priceRange[1] - min) / (max - min)) * 100;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '20px', maxWidth: '580px', margin: '0 auto', background: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={20} color="#84cc16" />
          <span>TanStack Ranger: Slider Primitives</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Headless multi-handle bounds and continuous slider mathematics.
        </p>
      </header>

      {/* Mode 1: Dual-Handle Range Slider */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>Price Filter Range</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#65a30d', background: '#f7fee7', padding: '4px 10px', borderRadius: '6px', border: '1px solid #d9f99d' }}>
            \${priceRange[0]} - \${priceRange[1]}
          </span>
        </div>

        {/* Visual Slider Track */}
        <div style={{ position: 'relative', height: '8px', background: '#e2e8f0', borderRadius: '4px', margin: '24px 0 16px 0' }}>
          {/* Active Highlight Segment between Min and Max */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: \`\${minPercent}%\`,
              width: \`\${maxPercent - minPercent}%\`,
              background: '#84cc16',
              borderRadius: '4px',
            }}
          />

          {/* Native dual inputs overlay for accessibility */}
          <input
            type="range"
            min={min}
            max={priceRange[1] - 25}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            style={{ position: 'absolute', width: '100%', top: '-6px', left: 0, margin: 0, opacity: 0.8, accentColor: '#4d7c0f', pointerEvents: 'auto' }}
          />
          <input
            type="range"
            min={priceRange[0] + 25}
            max={max}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            style={{ position: 'absolute', width: '100%', top: '-6px', left: 0, margin: 0, opacity: 0.8, accentColor: '#4d7c0f', pointerEvents: 'auto' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
          <span>\${min} (Floor)</span>
          <span>\${max} (Ceiling)</span>
        </div>
      </div>

      {/* Mode 2: Single-Value Continuous Slider */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Volume2 size={16} /> Volume / Output Gain
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{singleValue}%</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={singleValue}
          onChange={(e) => setSingleValue(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#84cc16' }}
        />
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

