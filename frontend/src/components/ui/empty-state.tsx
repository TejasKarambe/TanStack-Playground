import * as React from 'react'
import { Inbox } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center animate-in fade-in-50',
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

