import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  copied: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    copied: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, copied: false }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, copied: false })
  }

  private handleCopy = () => {
    if (this.state.error?.stack) {
      navigator.clipboard.writeText(this.state.error.stack)
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-xl border border-destructive/30 bg-destructive/5 p-6 shadow-lg space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">Something went wrong</h3>
                <p className="text-xs text-muted-foreground">An unexpected client error occurred</p>
              </div>
            </div>

            {this.state.error && (
              <div className="rounded-md bg-muted/80 p-3 font-mono text-xs text-foreground/90 overflow-x-auto max-h-40 border border-border">
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button size="sm" onClick={this.handleReset} className="gap-1.5 cursor-pointer">
                <RefreshCw className="h-3.5 w-3.5" />
                Try Again
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.assign('/dashboard')}
                className="gap-1.5 cursor-pointer"
              >
                <Home className="h-3.5 w-3.5" />
                Return to Dashboard
              </Button>
              {this.state.error && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={this.handleCopy}
                  className="gap-1.5 ml-auto text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {this.state.copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {this.state.copied ? 'Copied' : 'Copy Trace'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

