import React, { useState, useMemo, useCallback } from 'react'
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

  // Track original pristine starter files for diffing and reset
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

  // Track dirty (modified) files
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

  // Handle user typing in Monaco
  const handleCodeChange = useCallback(
    (newCode: string) => {
      sandpack.updateFile(activeFile, newCode)
    },
    [sandpack, activeFile]
  )

  // Reset active file to starter code
  const handleResetActiveFile = useCallback(() => {
    const original = originalCodeMap.get(activeFile)
    if (original !== undefined) {
      sandpack.updateFile(activeFile, original)
      toast.info(`Reset ${activeFile.split('/').pop()} to starter code`)
    }
  }, [sandpack, activeFile, originalCodeMap])

  // Reset all files
  const handleResetAllFiles = useCallback(() => {
    originalCodeMap.forEach((code, path) => {
      sandpack.updateFile(path, code)
    })
    toast.success('All files restored to original starter state')
    onResetAll()
  }, [sandpack, originalCodeMap, onResetAll])

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
                    sandpack.updateFile(file, original)
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
              onChange={handleCodeChange}
              onSelectFile={setActiveFile}
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
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Editor Half */}
          <ResizablePanel defaultSize={50} minSize={30} className="flex overflow-hidden">
            {showExplorer && (
              <div className="w-44 shrink-0 h-full">
                <FileExplorer
                  files={filePaths}
                  activeFile={activeFile}
                  dirtyFiles={dirtyFiles}
                  onSelectFile={setActiveFile}
                  onResetFile={(file) => {
                    const original = originalCodeMap.get(file)
                    if (original !== undefined) {
                      sandpack.updateFile(file, original)
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
                onChange={handleCodeChange}
                onSelectFile={setActiveFile}
                onResetFile={handleResetActiveFile}
                onResetAll={handleResetAllFiles}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Preview Half */}
          <ResizablePanel defaultSize={50} minSize={30} className="overflow-hidden">
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

  // Construct Sandpack files structure
  const sandpackFiles: SandpackFiles = useMemo(() => {
    const formatted: SandpackFiles = {}
    Object.entries(example.files).forEach(([path, fileConfig]) => {
      const code = typeof fileConfig === 'string' ? fileConfig : fileConfig.code
      const readOnly = typeof fileConfig === 'object' ? fileConfig.readOnly : false
      const hidden = typeof fileConfig === 'object' ? fileConfig.hidden : false
      formatted[path] = { code, readOnly, hidden }
    })
    return formatted
  }, [example, resetKey])

  const dependencies = useMemo(() => {
    return {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
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
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
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
              className={`flex items-center gap-1 px-2 py-0.5 rounded-xs transition-colors text-[11px] font-mono ${
                layout === 'split' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Columns2 className="h-3 w-3" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setLayout('editor')}
              title="Editor Only"
              className={`flex items-center gap-1 px-2 py-0.5 rounded-xs transition-colors text-[11px] font-mono ${
                layout === 'editor' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <SquareCode className="h-3 w-3" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              onClick={() => setLayout('preview')}
              title="Preview Only"
              className={`flex items-center gap-1 px-2 py-0.5 rounded-xs transition-colors text-[11px] font-mono ${
                layout === 'preview' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="h-3 w-3 text-emerald-500" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sandpack Provider Provider Wrapper */}
      <div className="flex-1 overflow-hidden relative">
        <SandpackProvider
          key={resetKey}
          template="react-ts"
          files={sandpackFiles}
          customSetup={{
            dependencies,
          }}
          options={{
            visibleFiles: Object.keys(example.files),
            activeFile: example.entryFile || '/App.tsx',
            recompileMode: 'delayed',
            recompileDelay: 350,
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
