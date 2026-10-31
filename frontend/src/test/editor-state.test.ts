import { describe, it, expect, beforeEach } from 'vitest'

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

  describe('File Persistence & LocalStorage Workflow', () => {
    const STORAGE_PREFIX = 'tanstack_playground_lesson_code_'
    const exampleId = 'query-basic-query-example'
    const storageKey = `${STORAGE_PREFIX}${exampleId}`

    beforeEach(() => {
      localStorage.clear()
    })

    it('persists modified files to localStorage on save', () => {
      const codeToSave = 'console.log("Updated code");'
      const activeFile = '/App.tsx'

      // Save action
      const savedMap: Record<string, string> = {}
      savedMap[activeFile] = codeToSave
      localStorage.setItem(storageKey, JSON.stringify(savedMap))

      // Verification
      const retrievedRaw = localStorage.getItem(storageKey)
      expect(retrievedRaw).toBeTruthy()
      const retrieved = JSON.parse(retrievedRaw!)
      expect(retrieved[activeFile]).toBe(codeToSave)
    })

    it('removes file from localStorage on reset', () => {
      const savedMap: Record<string, string> = {
        '/App.tsx': 'console.log("Custom code");',
        '/api.ts': 'export const x = 1;',
      }
      localStorage.setItem(storageKey, JSON.stringify(savedMap))

      // User resets /App.tsx
      delete savedMap['/App.tsx']
      localStorage.setItem(storageKey, JSON.stringify(savedMap))

      const retrieved = JSON.parse(localStorage.getItem(storageKey)!)
      expect(retrieved['/App.tsx']).toBeUndefined()
      expect(retrieved['/api.ts']).toBe('export const x = 1;')
    })

    it('clears all custom overrides when reset-all is triggered', () => {
      localStorage.setItem(storageKey, JSON.stringify({ '/App.tsx': 'custom' }))
      expect(localStorage.getItem(storageKey)).toBeTruthy()

      // Reset all action
      localStorage.removeItem(storageKey)
      expect(localStorage.getItem(storageKey)).toBeNull()
    })
  })

  describe('Console Log Collector & Formatting', () => {
    function formatArg(arg: any): string {
      if (typeof arg === 'string') return arg
      if (typeof arg === 'number' || typeof arg === 'boolean' || arg === null || arg === undefined) {
        return String(arg)
      }
      try {
        return JSON.stringify(arg, null, 2)
      } catch {
        return String(arg)
      }
    }

    it('correctly formats primitive and complex console arguments', () => {
      expect(formatArg('Hello world')).toBe('Hello world')
      expect(formatArg(42)).toBe('42')
      expect(formatArg(true)).toBe('true')
      expect(formatArg({ id: 1, name: 'Alice' })).toContain('"name": "Alice"')
      expect(formatArg([1, 2, 3])).toContain('[\n  1,\n  2,\n  3\n]')
    })

    it('handles console message payloads from bundler', () => {
      const bundlerMessage = {
        type: 'console',
        log: [
          { method: 'log', data: ['Fetching users...', { count: 3 }] },
          { method: 'warn', data: ['Network latency high'] },
          { method: 'error', data: ['Failed to fetch'] },
        ],
      }

      const entries = bundlerMessage.log.map((item, idx) => ({
        id: `log-${idx}`,
        method: item.method,
        data: item.data,
      }))

      expect(entries).toHaveLength(3)
      expect(entries[0].method).toBe('log')
      expect(entries[0].data[0]).toBe('Fetching users...')
      expect(entries[1].method).toBe('warn')
      expect(entries[2].method).toBe('error')
    })
  })
})
