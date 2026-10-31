import * as React from 'react'
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from 'react-resizable-panels'
import { GripVertical, GripHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ResizablePanelGroupProps extends Omit<GroupProps, 'orientation'> {
  direction?: 'horizontal' | 'vertical'
  orientation?: 'horizontal' | 'vertical'
}

export const ResizablePanelGroup = ({
  direction = 'horizontal',
  orientation,
  className,
  ...props
}: ResizablePanelGroupProps) => {
  const actualOrientation = orientation || direction
  return (
    <Group
      orientation={actualOrientation}
      className={cn('flex h-full w-full min-h-0 min-w-0', className)}
      {...props}
    />
  )
}

function normalizeConstraint(
  val: number | string | undefined
): string | number | undefined {
  if (val === undefined) return undefined
  if (typeof val === 'number') {
    // In react-resizable-panels 4.x, numbers are treated as pixels!
    // To support standard percentage syntax, normalize numbers <= 100 to percentages
    return `${val}%`
  }
  return val
}

export interface ExtendedPanelProps extends Omit<PanelProps, 'defaultSize' | 'minSize' | 'maxSize' | 'collapsedSize'> {
  defaultSize?: number | string
  minSize?: number | string
  maxSize?: number | string
  collapsedSize?: number | string
}

export const ResizablePanel = ({
  defaultSize,
  minSize,
  maxSize,
  collapsedSize,
  className,
  ...props
}: ExtendedPanelProps) => {
  return (
    <Panel
      defaultSize={normalizeConstraint(defaultSize) as any}
      minSize={normalizeConstraint(minSize) as any}
      maxSize={normalizeConstraint(maxSize) as any}
      collapsedSize={normalizeConstraint(collapsedSize) as any}
      className={cn('min-h-0 min-w-0 h-full w-full', className)}
      {...props}
    />
  )
}

export interface ResizableHandleProps extends SeparatorProps {
  withHandle?: boolean
  direction?: 'horizontal' | 'vertical'
}

export const ResizableHandle = ({
  withHandle = false,
  direction: _direction,
  className,
  ...props
}: ResizableHandleProps) => (
  <Separator
    className={cn(
      'relative flex items-center justify-center shrink-0 bg-border/80 hover:bg-primary/70 active:bg-primary transition-colors select-none focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring z-20 touch-none',
      // Vertical separator (when panels are placed side-by-side horizontally)
      'aria-[orientation=vertical]:w-2 aria-[orientation=vertical]:cursor-col-resize aria-[orientation=vertical]:after:absolute aria-[orientation=vertical]:after:inset-y-0 aria-[orientation=vertical]:after:left-1/2 aria-[orientation=vertical]:after:w-4 aria-[orientation=vertical]:after:-translate-x-1/2 aria-[orientation=vertical]:after:z-30 hover:aria-[orientation=vertical]:after:w-6',
      // Horizontal separator (when panels are placed top-and-bottom vertically)
      'aria-[orientation=horizontal]:h-2 aria-[orientation=horizontal]:cursor-row-resize aria-[orientation=horizontal]:after:absolute aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-4 aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:z-30 hover:aria-[orientation=horizontal]:after:h-6',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-30 flex items-center justify-center rounded-xs border border-border bg-card/95 shadow-2xs hover:border-primary/60 transition-colors pointer-events-none">
        <GripVertical className="hidden aria-[orientation=vertical]:block h-3.5 w-3 text-muted-foreground hover:text-foreground" />
        <GripHorizontal className="hidden aria-[orientation=horizontal]:block h-3 w-3.5 text-muted-foreground hover:text-foreground" />
      </div>
    )}
  </Separator>
)
