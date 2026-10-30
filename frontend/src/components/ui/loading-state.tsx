import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  subMessage?: string
  spinnerSize?: 'sm' | 'default' | 'lg'
}

export function LoadingState({
  message = 'Loading data...',
  subMessage,
  spinnerSize = 'default',
  className,
  ...props
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
      {...props}
    >
      <Loader2
        className={cn(
          'animate-spin text-muted-foreground mb-3',
          sizeClasses[spinnerSize]
        )}
      />
      <p className="text-xs font-medium text-foreground">{message}</p>
      {subMessage && (
        <p className="text-[11px] text-muted-foreground mt-1">{subMessage}</p>
      )}
    </div>
  )
}

