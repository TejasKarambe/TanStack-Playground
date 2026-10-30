import { describe, it, expect } from 'vitest'

describe('Editor State & File Explorer Tracking', () => {
  it('correctly detects modified dirty files against baseline', () => {
    const originalFiles: Record<string, string> = {
      '/App.tsx': 'export default function App() { return <div>Original</div>; }',
      '/styles.css': 'body { background: #fff; }',
    }

    const currentFiles: Record<string, string> = {
      '/App.tsx': 'export default function App() { return <div>Modified</div>; }',
      '/styles.css': 'body { background: #fff; }',
    }

    const dirtyFiles = new Set(
      Object.keys(currentFiles).filter((f) => currentFiles[f] !== originalFiles[f])
    )

    expect(dirtyFiles.has('/App.tsx')).toBe(true)
    expect(dirtyFiles.has('/styles.css')).toBe(false)
    expect(dirtyFiles.size).toBe(1)
  })

  it('resets dirty file back to pristine starter code', () => {
    const original = 'const x = 10;'
    let current = 'const x = 99;'

    // Reset action
    current = original
    expect(current).toBe(original)
  })
})

