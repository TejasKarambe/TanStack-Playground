import * as React from 'react'
import { Button, type ButtonProps } from './button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends ButtonProps {
  label: string
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  showTooltip?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      label,
      tooltipSide = 'bottom',
      showTooltip = true,
      children,
      size = 'icon',
      variant = 'ghost',
      ...props
    },
    ref
  ) => {
    const button = (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn('h-8 w-8 text-muted-foreground hover:text-foreground', className)}
        aria-label={label}
        {...props}
      >
        {children}
      </Button>
    )

    if (!showTooltip) {
      return button
    }

    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side={tooltipSide} className="text-xs font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)
IconButton.displayName = 'IconButton'

