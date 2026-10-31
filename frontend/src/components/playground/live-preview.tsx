import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react'
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Terminal,
  AlertTriangle,
  Trash2,
  Copy,
  GripHorizontal,
  Search,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type ViewportMode = 'desktop' | 'tablet' | 'mobile'

export interface ConsoleLogEntry {
  id: string
  method: 'log' | 'info' | 'warn' | 'error' | 'table' | 'clear'
  data: any[]
  timestamp: string
}

interface LivePreviewProps {
  autoRun?: boolean
  onToggleAutoRun?: () => void
}

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

export function LivePreview({ autoRun: _autoRun = true, onToggleAutoRun: _onToggleAutoRun }: LivePreviewProps) {
  const { sandpack, listen } = useSandpack()
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [showConsole, setShowConsole] = useState(false)
  const [consoleHeight, setConsoleHeight] = useState(200) // height in pixels
  const [isDragging, setIsDragging] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([])
  const [filterLevel, setFilterLevel] = useState<'all' | 'log' | 'warn' | 'error'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedLogs, setCopiedLogs] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const terminalBottomRef = useRef<HTMLDivElement>(null)

  const hasRuntimeError = Boolean(sandpack.error)

  // 1. Reactive Bundler Compilation Status Tracking & Console Collector
  useEffect(() => {
    const processMessage = (msg: any) => {
      if (!msg || typeof msg !== 'object') return

      // Lifecycle status
      if (
        msg.type === 'start' ||
        (msg.type === 'status' && (msg.status === 'transpiling' || msg.status === 'evaluating' || msg.status === 'installing-dependencies'))
      ) {
        setIsCompiling(true)
      } else if (
        msg.type === 'done' ||
        msg.type === 'success' ||
        (msg.type === 'status' && msg.status === 'idle')
      ) {
        setIsCompiling(false)
      }

      // Console logs collector
      if (msg.type === 'console' && msg.log) {
        const payloadLogs = Array.isArray(msg.log) ? msg.log : [msg.log]

        if (payloadLogs.some((l: any) => l?.method === 'clear')) {
          setLogs([])
          return
        }

        const newEntries: ConsoleLogEntry[] = []
        payloadLogs.forEach((item: any, idx: number) => {
          if (!item) return
          const rawData = item.data !== undefined ? item.data : []
          const dataArray = Array.isArray(rawData) ? rawData : [rawData]

          // Filter out internal system logs if any
          const isInternal = dataArray.some(
            (arg) => typeof arg === 'string' && (arg.startsWith('[Sandpack-Msg]') || arg.startsWith('[vite]'))
          )
          if (isInternal) return

          newEntries.push({
            id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${idx}`,
            method: item.method || 'log',
            data: dataArray,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          })
        })

        if (newEntries.length > 0) {
          setLogs((prev) => {
            const existingIds = new Set(prev.map((p) => p.id))
            const fresh = newEntries.filter((e) => !existingIds.has(e.id))
            return fresh.length > 0 ? [...prev, ...fresh].slice(-500) : prev
          })
        }
      }
    }

    // Direct window message listener (guaranteed delivery from iframe postMessage)
    const handleWindowMessage = (event: MessageEvent) => {
      processMessage(event.data)
    }
    window.addEventListener('message', handleWindowMessage)

    // Sandpack client listener
    const unsubscribe = listen(processMessage)

    // Initial fallback: if sandpack initialized fast or was already running, dismiss "Compiling..."
    const initialFallback = setTimeout(() => {
      setIsCompiling(false)
    }, 1000)

    return () => {
      window.removeEventListener('message', handleWindowMessage)
      unsubscribe()
      clearTimeout(initialFallback)
    }
  }, [listen])

  // Auto-scroll console terminal to bottom when new logs arrive and drawer is open
  useEffect(() => {
    if (showConsole && terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs.length, showConsole])

  const handleRestart = () => {
    setIsCompiling(true)
    sandpack.runSandpack()
    const timer = setTimeout(() => {
      setIsCompiling(false)
    }, 1000)
    return () => clearTimeout(timer)
  }

  const handleClearLogs = () => {
    setLogs([])
    toast.info('Console logs cleared')
  }

  const handleCopyLogs = async () => {
    if (logs.length === 0) return
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.method.toUpperCase()}] ${l.data.map(formatArg).join(' ')}`)
      .join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopiedLogs(true)
      toast.success('Console logs copied to clipboard')
      setTimeout(() => setCopiedLogs(false), 2000)
    } catch {
      toast.error('Failed to copy logs')
    }
  }

  // Handle dragging the resizer bar between Preview and Console
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsDragging(true)

      const startY = e.clientY
      const startHeight = consoleHeight
      const containerHeight = containerRef.current?.getBoundingClientRect().height || 500

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaY = startY - moveEvent.clientY
        const maxConsoleHeight = Math.floor(containerHeight * 0.75)
        const nextHeight = Math.min(Math.max(80, startHeight + deltaY), maxConsoleHeight)
        setConsoleHeight(nextHeight)
      }

      const handlePointerUp = (upEvent: PointerEvent) => {
        setIsDragging(false)
        try {
          e.currentTarget.releasePointerCapture(upEvent.pointerId)
        } catch { }
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }

      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    },
    [consoleHeight]
  )

  // Filtered console logs
  const filteredLogs = logs.filter((l) => {
    if (filterLevel !== 'all' && l.method !== filterLevel) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery?.toLowerCase()
    return l.data.some((arg) => formatArg(arg)?.toLowerCase().includes(q))
  })

  const logCounts = {
    all: logs.length,
    log: logs.filter((l) => l.method === 'log').length,
    warn: logs.filter((l) => l.method === 'warn').length,
    error: logs.filter((l) => l.method === 'error').length,
  }

  // Viewport styles
  const viewportStyles: Record<ViewportMode, { width: string; maxWidth: string }> = {
    desktop: { width: '100%', maxWidth: '100%' },
    tablet: { width: '768px', maxWidth: '100%' },
    mobile: { width: '375px', maxWidth: '100%' },
  }

  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-background overflow-hidden relative">
      {/* Top Preview Control Bar */}
      <div className="flex items-center justify-between border-b border-border bg-card/60 px-3 py-1.5 text-xs select-none shrink-0 z-10">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {hasRuntimeError ? (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-destructive font-semibold">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              Runtime Error
            </span>
          ) : isCompiling ? (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-500 font-semibold">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Compiling...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live Preview
            </span>
          )}
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-muted/50 rounded-xs p-0.5 border border-border">
          <button
            onClick={() => setViewport('desktop')}
            title="Desktop View (100%)"
            className={`p-1 rounded-xs transition-colors cursor-pointer ${viewport === 'desktop' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            title="Tablet View (768px)"
            className={`p-1 rounded-xs transition-colors cursor-pointer ${viewport === 'tablet' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            title="Mobile View (375px)"
            className={`p-1 rounded-xs transition-colors cursor-pointer ${viewport === 'mobile' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Execution & Console Actions */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRestart}
            title="Reload & re-execute preview"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Toggle Console Drawer with Live Count Badge */}
          <Button
            size="sm"
            variant={showConsole ? 'secondary' : 'ghost'}
            onClick={() => setShowConsole(!showConsole)}
            title={showConsole ? 'Hide Console Panel' : 'Open Console Panel with Draggable Resizer'}
            className="h-7 px-2 text-xs gap-1.5 cursor-pointer relative text-muted-foreground hover:text-foreground"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Console</span>
            {logs.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-mono font-bold">
                {logs.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Error Banner Overlay */}
      {hasRuntimeError && (
        <div className="bg-destructive/10 border-b border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2 shrink-0 animate-in slide-in-from-top-2 duration-200 z-10">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="overflow-hidden">
            <div className="font-semibold">Sandpack Execution Warning</div>
            <div className="font-mono text-[11px] mt-1 break-all whitespace-pre-wrap">
              {sandpack.error?.message ?? 'A compilation or runtime error occurred.'}
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Frame: Preview ALWAYS mounted at top + Optional Draggable Divider & Console */}
      <div
        ref={containerRef}
        className="flex-1 w-full min-h-0 overflow-hidden flex flex-col relative"
      >
        {/* Top: Live Preview Frame (Never unmounted so preview output stays active at all times) */}
        <div className="flex-1 w-full min-h-0 overflow-hidden flex flex-col relative bg-neutral-950/5 dark:bg-black/30">
          {/* While dragging, an invisible overlay prevents the iframe from intercepting mouse move events */}
          {isDragging && (
            <div className="absolute inset-0 z-50 cursor-row-resize select-none pointer-events-auto" />
          )}

          <div className="flex-1 w-full h-full min-h-0 overflow-hidden flex flex-col items-center justify-start">
            <div
              style={viewportStyles[viewport]}
              className={`h-full w-full flex flex-col transition-all duration-300 overflow-hidden ${viewport !== 'desktop'
                  ? 'my-auto max-h-[700px] border border-border rounded-lg shadow-md bg-background'
                  : 'border-0 bg-background'
                }`}
            >
              {viewport !== 'desktop' && (
                <div className="bg-muted px-3 py-1 text-[10px] font-mono text-muted-foreground text-center border-b border-border select-none shrink-0">
                  Viewport: {viewport === 'tablet' ? '768px (Tablet)' : '375px (Mobile)'}
                </div>
              )}

              <div className="flex-1 w-full h-full min-h-0 relative">
                <SandpackPreview
                  showRefreshButton={false}
                  showOpenInCodeSandbox={false}
                  style={{ height: '100%', width: '100%', border: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Draggable Resizer Bar (Visible when console is open) */}
        {showConsole && (
          <div
            onPointerDown={handlePointerDown}
            className="h-2 w-full shrink-0 bg-border/80 hover:bg-primary/70 active:bg-primary cursor-row-resize flex items-center justify-center relative touch-none select-none z-30 transition-colors group"
            title="Click and drag to resize Console and Preview"
          >
            {/* Extended click target */}
            <div className="absolute -inset-y-1.5 inset-x-0 z-30 cursor-row-resize" />
            <div className="z-40 flex h-3.5 w-8 items-center justify-center rounded-xs border border-border bg-card/95 shadow-2xs group-hover:border-primary/60 transition-colors pointer-events-none">
              <GripHorizontal className="h-3 w-3.5 text-muted-foreground group-hover:text-foreground" />
            </div>
          </div>
        )}

        {/* Bottom: Custom Persistent Console Terminal (Visible when console is open) */}
        {showConsole && (
          <div
            style={{ height: `${consoleHeight}px` }}
            className="w-full shrink-0 flex flex-col min-h-0 bg-card border-t border-border overflow-hidden animate-in slide-in-from-bottom-2 duration-150"
          >
            {/* Console Toolbar Header */}
            <div className="px-3 py-1.5 border-b border-border bg-muted/40 text-[11px] font-mono text-muted-foreground flex items-center justify-between shrink-0 select-none gap-2">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                <div className="flex items-center gap-1 text-foreground font-semibold shrink-0 mr-1">
                  <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Console</span>
                </div>

                {/* Level Filters */}
                <div className="flex items-center bg-card rounded-xs p-0.5 border border-border shrink-0">
                  <button
                    onClick={() => setFilterLevel('all')}
                    className={`px-1.5 py-0.5 rounded-xs text-[10px] cursor-pointer transition-colors ${filterLevel === 'all' ? 'bg-muted text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    All ({logCounts.all})
                  </button>
                  <button
                    onClick={() => setFilterLevel('log')}
                    className={`px-1.5 py-0.5 rounded-xs text-[10px] cursor-pointer transition-colors ${filterLevel === 'log' ? 'bg-muted text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    Log ({logCounts.log})
                  </button>
                  <button
                    onClick={() => setFilterLevel('warn')}
                    className={`px-1.5 py-0.5 rounded-xs text-[10px] cursor-pointer transition-colors ${filterLevel === 'warn' ? 'bg-muted text-amber-500 font-bold' : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    Warn ({logCounts.warn})
                  </button>
                  <button
                    onClick={() => setFilterLevel('error')}
                    className={`px-1.5 py-0.5 rounded-xs text-[10px] cursor-pointer transition-colors ${filterLevel === 'error' ? 'bg-muted text-destructive font-bold' : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    Error ({logCounts.error})
                  </button>
                </div>

                {/* Search in logs */}
                <div className="hidden sm:flex items-center bg-card rounded-xs px-2 py-0.5 border border-border text-[11px]">
                  <Search className="h-3 w-3 text-muted-foreground mr-1" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter logs..."
                    className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-24 text-[10px]"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground ml-1">
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleCopyLogs}
                  disabled={logs.length === 0}
                  title="Copy console output"
                  className="p-1 hover:text-foreground text-muted-foreground rounded-xs transition-colors cursor-pointer disabled:opacity-30"
                >
                  {copiedLogs ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
                <button
                  onClick={handleClearLogs}
                  disabled={logs.length === 0}
                  title="Clear console logs"
                  className="p-1 hover:text-foreground text-muted-foreground rounded-xs transition-colors cursor-pointer disabled:opacity-30"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setShowConsole(false)}
                  title="Close console panel"
                  className="p-1 hover:text-foreground text-muted-foreground rounded-xs transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 min-h-0 overflow-auto bg-neutral-950 font-mono text-xs text-neutral-200 p-2.5 space-y-1 select-text scrollbar-thin">
              {filteredLogs.length === 0 ? (
                <div className="text-muted-foreground/60 text-[11px] py-4 text-center select-none">
                  {logs.length === 0 ? (
                    <div>
                      <span className="text-emerald-500 font-semibold">&gt;</span> Console is ready. Calls to{' '}
                      <code className="text-foreground bg-muted/40 px-1 py-0.5 rounded-xs font-mono">console.log(...)</code> in
                      your code will stream here.
                    </div>
                  ) : (
                    'No logs match the current filter.'
                  )}
                </div>
              ) : (
                filteredLogs.map((entry) => {
                  const isErr = entry.method === 'error'
                  const isWarn = entry.method === 'warn'
                  const isInfo = entry.method === 'info'

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-2 py-1 px-1.5 rounded-xs border-b border-white/5 transition-colors ${isErr
                          ? 'bg-destructive/15 text-red-300 border-destructive/20'
                          : isWarn
                            ? 'bg-amber-500/10 text-amber-200 border-amber-500/20'
                            : isInfo
                              ? 'bg-sky-500/10 text-sky-200'
                              : 'hover:bg-white/5 text-neutral-200'
                        }`}
                    >
                      {/* Timestamp */}
                      <span className="text-[10px] text-neutral-500 shrink-0 select-none mt-0.5">
                        [{entry.timestamp}]
                      </span>

                      {/* Method Badge */}
                      <span
                        className={`text-[9px] font-bold px-1 py-0.2 rounded-xs uppercase shrink-0 select-none ${isErr
                            ? 'bg-destructive/30 text-destructive-foreground'
                            : isWarn
                              ? 'bg-amber-500/30 text-amber-300'
                              : isInfo
                                ? 'bg-sky-500/30 text-sky-300'
                                : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                      >
                        {entry.method}
                      </span>

                      {/* Log Arguments Output */}
                      <div className="flex-1 overflow-x-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed">
                        {entry.data.map((arg, idx) => {
                          const formatted = formatArg(arg)
                          const isObject = typeof arg === 'object' && arg !== null
                          return (
                            <span
                              key={idx}
                              className={`mr-2 inline-block ${isObject
                                  ? 'text-cyan-300 font-semibold'
                                  : typeof arg === 'number'
                                    ? 'text-amber-300'
                                    : typeof arg === 'boolean'
                                      ? 'text-purple-300'
                                      : ''
                                }`}
                            >
                              {formatted}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={terminalBottomRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
