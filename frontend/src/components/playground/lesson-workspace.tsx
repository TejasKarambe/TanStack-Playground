import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import {
  SandpackProvider,
  useSandpack,
  type SandpackFiles,
} from '@codesandbox/sandpack-react'
import type { LessonExample } from '@/content/types'
import { MonacoCodeEditor } from './code-editor'
import { FileExplorer } from './file-explorer'
import { LivePreview } from './live-preview'
import {
  Columns2,
  SquareCode,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable-panel'
import { toast } from 'sonner'

interface LessonWorkspaceProps {
  example: LessonExample
}

type LayoutMode = 'split' | 'editor' | 'preview'

const STORAGE_PREFIX = 'tanstack_playground_lesson_code_'

function getStoredFiles(exampleId: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${exampleId}`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Inner coordinator that connects to useSandpack()
function WorkspaceInner({
  example,
  layout,
  showExplorer,
  onToggleExplorer: _onToggleExplorer,
  onResetAll,
}: {
  example: LessonExample
  layout: LayoutMode
  showExplorer: boolean
  onToggleExplorer: () => void
  onResetAll: () => void
}) {
  const { sandpack } = useSandpack()
  if (typeof window !== 'undefined') {
    ; (window as any).__sandpack = sandpack
  }

  // Track pristine starter files for diffing and reset
  const originalCodeMap = useMemo(() => {
    const map = new Map<string, string>()
    Object.entries(example.files).forEach(([path, fileConfig]) => {
      const code = typeof fileConfig === 'string' ? fileConfig : fileConfig.code
      map.set(path, code)
    })
    return map
  }, [example])

  const filePaths = useMemo(() => Object.keys(example.files), [example])

  // Active file in editor
  const [activeFile, setActiveFile] = useState<string>(
    example.entryFile || filePaths[0] || '/App.tsx'
  )

  // Track saved state per file (from localStorage + pristine)
  const [savedCodeMap, setSavedCodeMap] = useState<Map<string, string>>(() => {
    const map = new Map<string, string>()
    const stored = getStoredFiles(example.id)
    Object.entries(example.files).forEach(([path, fileConfig]) => {
      const originalCode = typeof fileConfig === 'string' ? fileConfig : fileConfig.code
      map.set(path, stored[path] !== undefined ? stored[path] : originalCode)
    })
    return map
  })

  // Track unsaved modifications currently in the editor buffer
  const [unsavedFiles, setUnsavedFiles] = useState<Set<string>>(new Set())

  // Reset maps if example ID changes
  useEffect(() => {
    const map = new Map<string, string>()
    const stored = getStoredFiles(example.id)
    Object.entries(example.files).forEach(([path, fileConfig]) => {
      const originalCode = typeof fileConfig === 'string' ? fileConfig : fileConfig.code
      map.set(path, stored[path] !== undefined ? stored[path] : originalCode)
    })
    setSavedCodeMap(map)
    setUnsavedFiles(new Set())
    setActiveFile(example.entryFile || filePaths[0] || '/App.tsx')
  }, [example.id, example.files, example.entryFile, filePaths])

  // Track dirty (modified from pristine starter code)
  const dirtyFiles = useMemo(() => {
    const dirty = new Set<string>()
    filePaths.forEach((path) => {
      const currentCode = sandpack.files[path]?.code ?? ''
      const originalCode = originalCodeMap.get(path) ?? ''
      if (currentCode.trim() !== originalCode.trim()) {
        dirty.add(path)
      }
    })
    return dirty
  }, [sandpack.files, originalCodeMap, filePaths])

  // Current code of the active file
  const activeCode = sandpack.files[activeFile]?.code ?? ''
  const hasUnsavedChanges = unsavedFiles.has(activeFile)

  // Ref to hold debounce timer for auto-recompilation on typing
  const autoRecompileTimerRef = useRef<any>(null)

  // Clean up auto-recompile timer on unmount
  useEffect(() => {
    return () => {
      if (autoRecompileTimerRef.current) {
        clearTimeout(autoRecompileTimerRef.current)
      }
    }
  }, [])

  // Handle user typing in Monaco
  const handleCodeChange = useCallback(
    (newCode: string) => {
      // Direct file state synchronization
      if (sandpack.files[activeFile]) {
        sandpack.files[activeFile].code = newCode
      }
      sandpack.updateFile(activeFile, newCode, true)

      const savedCode = savedCodeMap.get(activeFile) ?? ''
      setUnsavedFiles((prev) => {
        const next = new Set(prev)
        if (newCode !== savedCode) {
          next.add(activeFile)
        } else {
          next.delete(activeFile)
        }
        return next
      })

      // Debounce auto-recompilation (600ms after user pauses typing)
      if (autoRecompileTimerRef.current) {
        clearTimeout(autoRecompileTimerRef.current)
      }
      autoRecompileTimerRef.current = setTimeout(() => {
        sandpack.runSandpack()
      }, 600)
    },
    [sandpack, activeFile, savedCodeMap]
  )

  // Explicit Save active file (persists to localStorage & immediately re-executes bundler)
  const handleSaveActiveFile = useCallback(
    (explicitCode?: string) => {
      if (autoRecompileTimerRef.current) {
        clearTimeout(autoRecompileTimerRef.current)
      }

      const currentCode = explicitCode ?? (sandpack.files[activeFile]?.code ?? '')
      const storageKey = `${STORAGE_PREFIX}${example.id}`
      let stored: Record<string, string> = {}
      try {
        const raw = localStorage.getItem(storageKey)
        if (raw) stored = JSON.parse(raw)
      } catch { }

      stored[activeFile] = currentCode
      try {
        localStorage.setItem(storageKey, JSON.stringify(stored))
      } catch (err) {
        console.error('Failed to save to localStorage:', err)
      }

      setSavedCodeMap((prev) => {
        const next = new Map(prev)
        next.set(activeFile, currentCode)
        return next
      })

      setUnsavedFiles((prev) => {
        const next = new Set(prev)
        next.delete(activeFile)
        return next
      })

      // Force instant Sandpack bundler re-execution
      if (sandpack.files[activeFile]) {
        sandpack.files[activeFile].code = currentCode
      }
      sandpack.updateFile(activeFile, currentCode, true)
      sandpack.runSandpack()

      const fileName = activeFile.split('/').pop() ?? activeFile
      toast.success(`Saved ${fileName}`, {
        description: 'Changes persisted and preview recompiled',
        duration: 2000,
      })
    },
    [sandpack, activeFile, example.id]
  )

  // Global Ctrl+S / Cmd+S handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 's') {
        e.preventDefault()
        handleSaveActiveFile()
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleSaveActiveFile])

  // Reset active file to starter code
  const handleResetActiveFile = useCallback(() => {
    const original = originalCodeMap.get(activeFile)
    if (original !== undefined) {
      const storageKey = `${STORAGE_PREFIX}${example.id}`
      try {
        const raw = localStorage.getItem(storageKey)
        if (raw) {
          const stored = JSON.parse(raw)
          delete stored[activeFile]
          localStorage.setItem(storageKey, JSON.stringify(stored))
        }
      } catch { }

      setSavedCodeMap((prev) => {
        const next = new Map(prev)
        next.set(activeFile, original)
        return next
      })

      setUnsavedFiles((prev) => {
        const next = new Set(prev)
        next.delete(activeFile)
        return next
      })

      if (sandpack.files[activeFile]) {
        sandpack.files[activeFile].code = original
      }
      sandpack.updateFile(activeFile, original, true)
      sandpack.runSandpack()
      toast.info(`Reset ${activeFile.split('/').pop()} to starter code`)
    }
  }, [sandpack, activeFile, originalCodeMap, example.id])

  // Reset all files
  const handleResetAllFiles = useCallback(() => {
    const storageKey = `${STORAGE_PREFIX}${example.id}`
    try {
      localStorage.removeItem(storageKey)
    } catch { }

    originalCodeMap.forEach((code, path) => {
      if (sandpack.files[path]) {
        sandpack.files[path].code = code
      }
      sandpack.updateFile(path, code, true)
    })
    sandpack.runSandpack()

    setSavedCodeMap(new Map(originalCodeMap))
    setUnsavedFiles(new Set())
    toast.success('All files restored to original starter state')
    onResetAll()
  }, [sandpack, originalCodeMap, onResetAll, example.id])

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {layout === 'editor' && (
        <div className="flex-1 flex overflow-hidden">
          {showExplorer && (
            <div className="w-48 shrink-0 h-full">
              <FileExplorer
                files={filePaths}
                activeFile={activeFile}
                dirtyFiles={dirtyFiles}
                onSelectFile={setActiveFile}
                onResetFile={(file) => {
                  const original = originalCodeMap.get(file)
                  if (original !== undefined) {
                    sandpack.updateFile(file, original, true)
                    toast.info(`Reset ${file}`)
                  }
                }}
              />
            </div>
          )}
          <div className="flex-1 h-full overflow-hidden">
            <MonacoCodeEditor
              files={filePaths}
              activeFile={activeFile}
              code={activeCode}
              dirtyFiles={dirtyFiles}
              unsavedFiles={unsavedFiles}
              hasUnsavedChanges={hasUnsavedChanges}
              onChange={handleCodeChange}
              onSelectFile={setActiveFile}
              onSave={handleSaveActiveFile}
              onResetFile={handleResetActiveFile}
              onResetAll={handleResetAllFiles}
            />
          </div>
        </div>
      )}

      {layout === 'preview' && (
        <div className="flex-1 h-full overflow-hidden">
          <LivePreview />
        </div>
      )}

      {layout === 'split' && (
        <ResizablePanelGroup direction="horizontal" className="flex-1 h-full w-full min-h-0">
          {/* Editor Half */}
          <ResizablePanel id="editor-pane" defaultSize="50%" minSize="25%" className="flex h-full min-h-0 overflow-hidden">
            {showExplorer && (
              <div className="w-44 shrink-0 h-full min-h-0 border-r border-border">
                <FileExplorer
                  files={filePaths}
                  activeFile={activeFile}
                  dirtyFiles={dirtyFiles}
                  onSelectFile={setActiveFile}
                  onResetFile={(file) => {
                    const original = originalCodeMap.get(file)
                    if (original !== undefined) {
                      sandpack.updateFile(file, original, true)
                      toast.info(`Reset ${file}`)
                    }
                  }}
                />
              </div>
            )}
            <div className="flex-1 h-full min-h-0 overflow-hidden">
              <MonacoCodeEditor
                files={filePaths}
                activeFile={activeFile}
                code={activeCode}
                dirtyFiles={dirtyFiles}
                unsavedFiles={unsavedFiles}
                hasUnsavedChanges={hasUnsavedChanges}
                onChange={handleCodeChange}
                onSelectFile={setActiveFile}
                onSave={handleSaveActiveFile}
                onResetFile={handleResetActiveFile}
                onResetAll={handleResetAllFiles}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Half */}
          <ResizablePanel id="preview-pane" defaultSize="50%" minSize="25%" className="h-full min-h-0 overflow-hidden">
            <LivePreview />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  )
}

export function LessonWorkspace({ example }: LessonWorkspaceProps) {
  const [layout, setLayout] = useState<LayoutMode>('split')
  const [showExplorer, setShowExplorer] = useState(true)
  const [resetKey, setResetKey] = useState(0)

  // Construct Sandpack files structure (merges original starter files with stored user changes)
  const sandpackFiles: SandpackFiles = useMemo(() => {
    const formatted: SandpackFiles = {}
    const stored = getStoredFiles(example.id)

    Object.entries(example.files).forEach(([path, fileConfig]) => {
      const originalCode = typeof fileConfig === 'string' ? fileConfig : fileConfig.code
      const code = stored[path] !== undefined ? stored[path] : originalCode
      const readOnly = typeof fileConfig === 'object' ? fileConfig.readOnly : false
      const hidden = typeof fileConfig === 'object' ? fileConfig.hidden : false
      formatted[path] = { code, readOnly, hidden }
    })

    if (!formatted['/styles.css']) {
      formatted['/styles.css'] = {
        code: `html, body, #root {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n}\n* {\n  box-sizing: border-box;\n}`,
        hidden: true,
      }
    }
    return formatted
  }, [example, resetKey])

  const dependencies = useMemo(() => {
    return {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'lucide-react': '^1.65.0',
      ...example.dependencies,
    }
  }, [example])

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Top Workspace Controls Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card/40 text-xs">
        {/* Toggle File Explorer */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowExplorer(!showExplorer)}
            title={showExplorer ? 'Hide File Explorer' : 'Show File Explorer'}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
          >
            {showExplorer ? (
              <PanelLeftClose className="h-3.5 w-3.5" />
            ) : (
              <PanelLeftOpen className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Files</span>
          </Button>

          <span className="text-muted-foreground/30">|</span>

          <span className="font-semibold text-foreground truncate max-w-xs text-xs">
            {example.title}
          </span>
        </div>

        {/* Layout Switcher (Split, Editor, Preview) */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-muted/60 rounded-xs p-0.5 border border-border">
            <button
              onClick={() => setLayout('split')}
              title="Split View (Editor + Preview)"
              className={`flex items-center gap-1 px-2 py-0.5 rounded-xs transition-colors text-[11px] font-mono cursor-pointer ${layout === 'split' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Columns2 className="h-3 w-3" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setLayout('editor')}
              title="Editor Only"
              className={`flex items-center gap-1 px-2 py-0.5 rounded-xs transition-colors text-[11px] font-mono cursor-pointer ${layout === 'editor' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <SquareCode className="h-3 w-3" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              onClick={() => setLayout('preview')}
              title="Preview Only"
              className={`flex items-center gap-1 px-2 py-0.5 rounded-xs transition-colors text-[11px] font-mono cursor-pointer ${layout === 'preview' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Eye className="h-3 w-3 text-emerald-500" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sandpack Provider Wrapper */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
        <SandpackProvider
          key={resetKey}
          template="react-ts"
          className="h-full w-full flex-1 flex flex-col min-h-0"
          style={{ height: '100%', width: '100%' }}
          files={sandpackFiles}
          customSetup={{
            dependencies,
          }}
          options={{
            initMode: 'immediate',
            autorun: true,
            visibleFiles: Object.keys(example.files),
            activeFile: example.entryFile || '/App.tsx',
            recompileMode: 'delayed',
            recompileDelay: 300,
          }}
        >
          <WorkspaceInner
            example={example}
            layout={layout}
            showExplorer={showExplorer}
            onToggleExplorer={() => setShowExplorer(!showExplorer)}
            onResetAll={() => setResetKey((k) => k + 1)}
          />
        </SandpackProvider>
      </div>
    </div>
  )
}
