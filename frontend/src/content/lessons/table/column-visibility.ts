import type { LessonManifest } from '../../types'

export const tableColumnVisibilityLesson: LessonManifest = {
  id: 'table-column-visibility',
  libraryId: 'table',
  topicId: 'table-column-visibility',
  title: 'Column Visibility: Dynamic Column Toggles & Menus',
  description: 'Hide or show individual table columns dynamically using columnVisibility state and toggle handlers.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/column-visibility',
  learningObjectives: [
    'Manage column visibility state: VisibilityState (Record<string, boolean>).',
    'Build a column selector dropdown menu with checkbox toggles.',
    'Toggle visibility via column.getToggleVisibilityHandler().',
    'Provide "Show All" and "Reset Visibility" actions.',
  ],
  conceptSections: [
    {
      title: 'Configurable Data Grids',
      content:
        'In enterprise tables with 20+ columns, users often want to hide unneeded columns to focus on critical data. TanStack Table tracks column visibility via state.columnVisibility. Hidden columns are cleanly omitted from header groups and row cell iterations.',
    },
    {
      title: 'Visibility State Representation',
      content:
        'VisibilityState is an object mapping column IDs to booleans (e.g. { salary: false, phone: true }). If an ID is missing, it defaults to true unless explicitly configured.',
    },
  ],
  importantApis: [
    {
      name: 'column.getIsVisible()',
      signature: 'column.getIsVisible(): boolean',
      description: 'Checks whether the column is currently displayed in the table.',
    },
    {
      name: 'column.getToggleVisibilityHandler()',
      signature: 'onChange: column.getToggleVisibilityHandler()',
      description: 'Returns a change event handler to toggle column visibility on and off.',
    },
    {
      name: 'table.toggleAllColumnsVisible()',
      signature: 'table.toggleAllColumnsVisible(boolean)',
      description: 'Shows or hides all columns at once.',
    },
  ],
  previewInstructions: 'Uncheck columns in the "Toggle Columns" dropdown (e.g. uncheck "SKU" or "Rating"). Notice how the table re-flows dynamically without resetting data.',
  expectedResult: 'A flexible product inventory grid with an interactive column visibility menu.',
  commonMistakes: [
    {
      mistake: 'Using CSS display: none to hide columns instead of TanStack Table columnVisibility.',
      fix: 'Use table.setColumnVisibility to ensure header calculations, borders, and column models update cleanly.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How do you prevent a specific column (like an Actions column or ID) from being hidden?',
      answer:
        'Set enableHiding: false on that specific column definition. The column will remain visible permanently.',
    },
  ],
  example: {
    id: 'table-column-visibility-example',
    title: 'Product Catalog with Column Visibility Menu',
    description: 'Toggle columns on and off dynamically with a column chooser menu.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-table': '^8.21.2',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { SlidersHorizontal, Package, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

const products: Product[] = [
  { id: '1', sku: 'PRD-901', name: 'Ergonomic Mechanical Keyboard', category: 'Hardware', price: 189, stock: 45, rating: 4.8 },
  { id: '2', sku: 'PRD-902', name: '4K Ultra-Wide Studio Monitor', category: 'Displays', price: 899, stock: 12, rating: 4.9 },
  { id: '3', sku: 'PRD-903', name: 'Thunderbolt 4 Docking Hub', category: 'Accessories', price: 249, stock: 88, rating: 4.6 },
  { id: '4', sku: 'PRD-904', name: 'Precision Wireless Trackball', category: 'Hardware', price: 99, stock: 34, rating: 4.5 },
];

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Product Name',
    enableHiding: false, // Cannot be hidden
    cell: (info) => <strong>{info.getValue()}</strong>,
  }),
  columnHelper.accessor('sku', { header: 'SKU Code' }),
  columnHelper.accessor('category', { header: 'Category' }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => <span>\${info.getValue().toFixed(2)}</span>,
  }),
  columnHelper.accessor('stock', {
    header: 'In Stock',
    cell: (info) => (
      <span style={{ fontWeight: 600, color: info.getValue() < 20 ? '#dc2626' : '#16a34a' }}>
        {info.getValue()} units
      </span>
    ),
  }),
  columnHelper.accessor('rating', {
    header: 'Rating',
    cell: (info) => <span>★ {info.getValue()} / 5</span>,
  }),
];

export default function App() {
  const [data] = useState(() => [...products]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    sku: true,
    rating: false, // Default hidden
  });
  const [showMenu, setShowMenu] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} color="#3b82f6" />
            Product Inventory
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Visible columns: {table.getVisibleLeafColumns().length} of {table.getAllLeafColumns().length}
          </span>
        </div>

        {/* Column Visibility Menu Trigger */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={14} />
            Toggle Columns
          </button>

          {/* Visibility Dropdown */}
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '36px',
                width: '180px',
                background: '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '8px',
                zIndex: 10,
                fontSize: '12px',
              }}
            >
              <div style={{ fontWeight: 700, padding: '4px 6px', borderBottom: '1px solid #f1f5f9', marginBottom: '6px', color: '#475569' }}>
                Visible Columns
              </div>
              {table.getAllLeafColumns().map((column) => (
                <label
                  key={column.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 6px',
                    cursor: column.getCanHide() ? 'pointer' : 'not-allowed',
                    opacity: column.getCanHide() ? 1 : 0.5,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    disabled={!column.getCanHide()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  <span>{column.id}</span>
                </label>
              ))}

              <button
                onClick={() => setColumnVisibility({})}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '4px 6px',
                  border: 'none',
                  background: '#f8fafc',
                  color: '#3b82f6',
                  fontSize: '11px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Reset to Default
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Table */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ padding: '10px 14px', fontWeight: 600, color: '#334155' }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} style={{ padding: '10px 14px' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`,
      },
    },
  },
}

