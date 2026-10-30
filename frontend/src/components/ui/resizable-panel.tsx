import * as React from 'react'
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type SeparatorProps,
} from 'react-resizable-panels'
import { GripVertical } from 'lucide-react'
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
}: ResizablePanelGroupProps) => (
  <Group
    orientation={orientation || direction}
    className={cn('flex h-full w-full', className)}
    {...props}
  />
)

export const ResizablePanel = Panel

export interface ResizableHandleProps extends SeparatorProps {
  withHandle?: boolean
}

export const ResizableHandle = ({
  withHandle = false,
  className,
  ...props
}: ResizableHandleProps) => (
  <Separator
    className={cn(
      'relative flex w-px items-center justify-center bg-border transition-colors hover:bg-ring/50 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-col-resize',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border border-border bg-border">
        <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
      </div>
    )}
  </Separator>
)
