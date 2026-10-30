import React, { useState } from 'react'
import {
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react'
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Terminal,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type ViewportMode = 'desktop' | 'tablet' | 'mobile'

interface LivePreviewProps {
  autoRun?: boolean
  onToggleAutoRun?: () => void
}

export function LivePreview({ autoRun: _autoRun = true, onToggleAutoRun: _onToggleAutoRun }: LivePreviewProps) {
  const { sandpack } = useSandpack()
  const [viewport, setViewport] = useState<ViewportMode>('desktop')
  const [showConsole, setShowConsole] = useState(false)

  const isCompiling = sandpack.status === 'running' || sandpack.status === 'initial'
  const hasError = Boolean(sandpack.error)

  const handleRestart = () => {
    sandpack.runSandpack()
  }

  // Dimensions based on viewport
  const viewportStyles: Record<ViewportMode, { width: string; maxWidth: string }> = {
    desktop: { width: '100%', maxWidth: '100%' },
    tablet: { width: '768px', maxWidth: '100%' },
    mobile: { width: '375px', maxWidth: '100%' },
  }

  return (
    <div className="flex flex-col h-full bg-muted/10 overflow-hidden relative">
      {/* Top Preview Control Bar */}
      <div className="flex items-center justify-between border-b border-border bg-card/60 px-3 py-1.5 text-xs select-none">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {hasError ? (
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
            className={`p-1 rounded-xs transition-colors ${
              viewport === 'desktop' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            title="Tablet View (768px)"
            className={`p-1 rounded-xs transition-colors ${
              viewport === 'tablet' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            title="Mobile View (375px)"
            className={`p-1 rounded-xs transition-colors ${
              viewport === 'mobile' ? 'bg-card text-foreground shadow-2xs font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Execution & Console Actions */}
        <div className="flex items-center gap-1">
          {/* Manual Run button if autoRun is off or to force update */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRestart}
            title="Reload & re-execute preview"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Toggle Console Drawer */}
          <Button
            size="sm"
            variant={showConsole ? 'secondary' : 'ghost'}
            onClick={() => setShowConsole(!showConsole)}
            title="Toggle Console Output"
            className="h-7 px-2 text-xs gap-1.5"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Console</span>
          </Button>
        </div>
      </div>

      {/* Error Banner Overlay */}
      {hasError && (
        <div className="bg-destructive/10 border-b border-destructive/20 p-3 text-xs text-destructive flex items-start gap-2 animate-in slide-in-from-top-2 duration-200">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="overflow-hidden">
            <div className="font-semibold">Sandpack Execution Warning</div>
            <div className="font-mono text-[11px] mt-1 break-all whitespace-pre-wrap">
              {sandpack.error?.message ?? 'A compilation or runtime error occurred.'}
            </div>
          </div>
        </div>
      )}

      {/* Main Preview Frame Container */}
      <div className="flex-1 w-full overflow-auto p-4 flex flex-col items-center justify-start bg-neutral-950/5 dark:bg-black/30 scrollbar-thin">
        <div
          style={viewportStyles[viewport]}
          className={`h-full flex flex-col transition-all duration-300 rounded-lg overflow-hidden border border-border shadow-xs bg-background ${
            viewport !== 'desktop' ? 'my-auto max-h-[700px]' : ''
          }`}
        >
          {viewport !== 'desktop' && (
            <div className="bg-muted px-3 py-1 text-[10px] font-mono text-muted-foreground text-center border-b border-border select-none">
              Viewport: {viewport === 'tablet' ? '768px (Tablet)' : '375px (Mobile)'}
            </div>
          )}

          <div className="flex-1 w-full h-full relative">
            <SandpackPreview
              showRefreshButton={false}
              showOpenInCodeSandbox={false}
              style={{ height: '100%', width: '100%', border: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Expandable Console Drawer */}
      {showConsole && (
        <div className="h-44 border-t border-border bg-card flex flex-col animate-in slide-in-from-bottom-2 duration-200">
          <div className="px-3 py-1.5 border-b border-border bg-muted/40 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3" />
              <span>Console Logs</span>
            </div>
            <button
              onClick={() => setShowConsole(false)}
              className="text-xs hover:text-foreground text-muted-foreground px-1"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-black font-mono text-xs text-emerald-400 p-2 scrollbar-thin">
            <SandpackConsole style={{ height: '100%', background: 'transparent' }} resetOnPreviewRestart />
          </div>
        </div>
      )}
    </div>
  )
}

