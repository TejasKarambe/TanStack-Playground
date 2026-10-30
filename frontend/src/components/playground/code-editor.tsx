import React, { useRef } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import {
  Copy,
  Check,
  RotateCcw,
  AlignLeft,
  WrapText,
  ZoomIn,
  ZoomOut,
  Code2,
  FileCode,
  FileText,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useTheme } from '@/components/theme-provider'

interface CodeEditorProps {
  files: string[]
  activeFile: string
  code: string
  isDirty?: boolean
  dirtyFiles?: Set<string>
  readOnly?: boolean
  onChange: (value: string) => void
  onSelectFile: (file: string) => void
  onResetFile: () => void
  onResetAll: () => void
}

function getLanguage(path: string): string {
  if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript'
  if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript'
  if (path.endsWith('.json')) return 'json'
  if (path.endsWith('.css')) return 'css'
  if (path.endsWith('.html')) return 'html'
  return 'typescript'
}

function getFileIcon(path: string) {
  if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
    return <Code2 className="h-3.5 w-3.5 text-sky-400" />
  }
  if (path.endsWith('.ts') || path.endsWith('.js')) {
    return <FileCode className="h-3.5 w-3.5 text-amber-400" />
  }
  if (path.endsWith('.json')) {
    return <FileText className="h-3.5 w-3.5 text-emerald-400" />
  }
  return <FileText className="h-3.5 w-3.5 text-muted-foreground" />
}

export function MonacoCodeEditor({
  files,
  activeFile,
  code,
  dirtyFiles = new Set(),
  readOnly = false,
  onChange,
  onSelectFile,
  onResetFile,
  onResetAll,
}: CodeEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)
  const [copied, setCopied] = React.useState(false)
  const [fontSize, setFontSize] = React.useState(13)
  const [wordWrap, setWordWrap] = React.useState(true)

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Source code copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
      toast.info('Document formatted')
    }
  }

  const monacoTheme = theme === 'light' ? 'light' : 'vs-dark'

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* File Tabs & Controls Header */}
      <div className="flex items-center justify-between border-b border-border bg-card/50 px-2 py-1 text-xs">
        {/* Open File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {files.map((file) => {
            const isActive = file === activeFile
            const isFileDirty = dirtyFiles.has(file)
            const fileName = file.split('/').pop() ?? file

            return (
              <button
                key={file}
                onClick={() => onSelectFile(file)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs font-mono text-xs transition-colors shrink-0 ${
                  isActive
                    ? 'bg-muted text-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {getFileIcon(file)}
                <span>{fileName}</span>
                {isFileDirty && (
                  <span
                    title="Modified file"
                    className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block shrink-0"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Editor Toolbar Actions */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {readOnly && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-xs mr-1">
              <Lock className="h-3 w-3" />
              Read-Only
            </span>
          )}

          {/* Word Wrap Toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setWordWrap(!wordWrap)}
            title={wordWrap ? 'Disable word wrap' : 'Enable word wrap'}
            className={`h-7 px-2 text-xs ${wordWrap ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <WrapText className="h-3.5 w-3.5" />
          </Button>

          {/* Font Size Zoom */}
          <div className="flex items-center bg-muted/40 rounded-xs px-1">
            <button
              onClick={() => setFontSize((s) => Math.max(11, s - 1))}
              disabled={fontSize <= 11}
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              title="Decrease font size"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="text-[10px] font-mono px-1 text-muted-foreground">{fontSize}px</span>
            <button
              onClick={() => setFontSize((s) => Math.min(20, s + 1))}
              disabled={fontSize >= 20}
              className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
              title="Increase font size"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>

          {/* Format Document */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleFormat}
            title="Format document"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </Button>

          {/* Copy Source Code */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            title="Copy current file code"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>

          {/* Reset Current File */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onResetFile}
            title="Reset current file to original"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          {/* Reset All Files */}
          {dirtyFiles.size > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={onResetAll}
              className="h-7 px-2 text-xs text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
              title="Reset all modified files"
            >
              Reset All ({dirtyFiles.size})
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full overflow-hidden relative">
        <Editor
          height="100%"
          path={activeFile}
          language={getLanguage(activeFile)}
          value={code}
          theme={monacoTheme}
          onMount={handleEditorDidMount}
          onChange={(val) => onChange(val ?? '')}
          options={{
            readOnly,
            fontSize,
            wordWrap: wordWrap ? 'on' : 'off',
            minimap: { enabled: false },
            lineNumbers: 'on',
            tabSize: 2,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            folding: true,
            renderLineHighlight: 'all',
            padding: { top: 8, bottom: 8 },
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
          }}
        />
      </div>
    </div>
  )
}

