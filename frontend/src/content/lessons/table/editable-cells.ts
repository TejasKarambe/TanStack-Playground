import type { LessonManifest } from '../../types'

export const tableEditableCellsLesson: LessonManifest = {
  id: 'table-editable-cells',
  libraryId: 'table',
  topicId: 'table-editable-cells',
  title: 'Editable Cells: Inline Editing & Data State Mutations',
  description: 'Implement responsive inline cell editing without losing focus or resetting table pagination and sorting.',
  difficulty: 'INTERMEDIATE',
  estimatedMinutes: 20,
  officialDocUrl: 'https://tanstack.com/table/latest/docs/guide/cells',
  learningObjectives: [
    'Define custom editable cell components with local blur handlers.',
    'Update the underlying data state via a custom updateData(rowIndex, columnId, value) callback.',
    'Pass custom methods into table.options.meta.',
    'Maintain cursor focus and avoid destructive re-renders during keystrokes.',
  ],
  conceptSections: [
    {
      title: 'The Table Meta Pattern',
      content:
        'When table cells need to communicate back to the parent state (e.g. updating an item name, salary, or status), TanStack Table provides the table.options.meta property. Any custom functions you attach to meta can be called inside cell formatters via info.table.options.meta?.updateData(...).',
    },
    {
      title: 'Local Buffering vs Commit on Blur',
      content:
        'To prevent the entire table from re-evaluating row models on every single keystroke, editable cells typically manage their own local useState while typing, and commit the final value to the parent dataset on onBlur or onEnter.',
    },
  ],
  importantApis: [
    {
      name: 'table.options.meta',
      signature: 'useReactTable({ data, columns, meta: { updateData } })',
      description: 'Extensible container for passing custom callbacks to cells and headers.',
    },
    {
      name: 'info.table.options.meta.updateData()',
      signature: 'meta?.updateData(rowIndex, columnId, value)',
      description: 'Invokes the parent mutation callback with targeted coordinates.',
    },
  ],
  previewInstructions: 'Click into any name, price, or stock number to edit it. Press Enter or click outside the input (blur) to commit the change to state.',
  expectedResult: 'A spreadsheet-like editable product table that preserves focus and commits edits to state.',
  commonMistakes: [
    {
      mistake: 'Re-creating the columns array on every render.',
      fix: 'Always memoize columns with useMemo or declare them statically outside the component to prevent losing input focus.',
    },
  ],
  interviewQuestions: [
    {
      question: 'How does table.options.meta prevent prop-drilling in TanStack Table?',
      answer:
        'meta is accessible to every cell, header, and footer context object (info.table.options.meta), allowing deep cells to call parent mutation functions without prop drilling.',
    },
  ],
  example: {
    id: 'table-editable-cells-example',
    title: 'Spreadsheet-Style Inline Cell Editing',
    description: 'Edit prices and inventory counts directly in table cells.',
    entryFile: '/App.tsx',
    dependencies: {
      '@tanstack/react-table': '^8.21.2',
      'lucide-react': '^1.65.0',
    },
    files: {
      '/App.tsx': {
        code: `import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from '@tanstack/react-table';
import { Edit3, Check, Table2 } from 'lucide-react';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const initialData: ProductItem[] = [
  { id: '1', name: 'USB-C Fast Charger 65W', price: 29.99, stock: 120 },
  { id: '2', name: 'Braided HDMI 2.1 Cable', price: 14.50, stock: 450 },
  { id: '3', name: 'Noise-Cancelling Earbuds', price: 119.00, stock: 65 },
];

// Reusable Editable Cell Component
function EditableCell({ getValue, row, column, table }: any) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  // Sync if external data changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };

  return (
    <input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      style={{
        width: '100%',
        padding: '4px 8px',
        border: '1px solid transparent',
        borderRadius: '4px',
        fontSize: '13px',
        background: 'transparent',
      }}
      onFocus={(e) => {
        e.target.style.background = '#fff';
        e.target.style.borderColor = '#3b82f6';
      }}
    />
  );
}

const columnHelper = createColumnHelper<ProductItem>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Product Name',
    cell: EditableCell,
  }),
  columnHelper.accessor('price', {
    header: 'Unit Price ($)',
    cell: EditableCell,
  }),
  columnHelper.accessor('stock', {
    header: 'Stock Units',
    cell: EditableCell,
  }),
];

export default function App() {
  const [data, setData] = useState(() => [...initialData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: columnId === 'name' ? value : Number(value),
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Edit3 size={20} color="#3b82f6" />
          Editable Cell Grid
        </h2>
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          Click any cell to edit. Edits commit on blur or Enter.
        </span>
      </header>

      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
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
                  <td key={cell.id} style={{ padding: '6px 10px' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* State Verification View */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
          Underlying React State (Updated via meta.updateData):
        </div>
        <pre style={{ margin: 0, fontSize: '11px', color: '#0f172a' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
`,
      },
    },
  },
}

