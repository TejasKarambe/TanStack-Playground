import * as React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  retryLabel?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Failed to load content',
  message,
  retryLabel = 'Try again',
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center',
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-3">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

