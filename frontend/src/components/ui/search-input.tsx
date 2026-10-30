import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  shortcut?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, shortcut = '⌘K', ...props }, ref) => {
    const hasValue = Boolean(value)

    return (
      <div className="relative flex items-center w-full max-w-sm">
        <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          className={cn(
            'flex h-8 w-full rounded-md border border-border bg-background/50 pl-8 pr-12 text-xs text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          {...props}
        />
        {hasValue ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 p-0.5 rounded-xs text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        ) : shortcut ? (
          <kbd className="pointer-events-none absolute right-2 hidden h-4.5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
            {shortcut}
          </kbd>
        ) : null}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

