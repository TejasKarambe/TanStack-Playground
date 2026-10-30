import React, { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { X, Lock, Mail, User, Sparkles, Loader2 } from 'lucide-react'

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, loginAsDemo, register, isLoading } = useAuth()
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  if (!isAuthModalOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'LOGIN') {
      await login(email, password)
    } else {
      await register(email, password, displayName || 'Developer')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50 duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
          title="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {mode === 'LOGIN' ? 'Sign In to TanStack Playground' : 'Create Free Account'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Save lesson completion progress, manage bookmarks, and sync editor preferences.
          </p>
        </div>

        {/* Demo Fast Login Button */}
        <button
          type="button"
          onClick={() => loginAsDemo()}
          disabled={isLoading}
          className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium text-xs border border-emerald-500/20 transition-colors cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Quick 1-Click Sign In with Demo Account</span>
        </button>

        <div className="relative flex py-2 items-center mb-4">
          <div className="grow border-t border-border"></div>
          <span className="shrink mx-3 text-[11px] text-muted-foreground uppercase font-mono">
            Or continue with email
          </span>
          <div className="grow border-t border-border"></div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'REGISTER' && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Display Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@tanstack.dev"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-ring"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{mode === 'LOGIN' ? 'Sign In to Account' : 'Complete Registration'}</span>
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div className="mt-5 text-center text-xs text-muted-foreground">
          {mode === 'LOGIN' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('REGISTER')}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Continue as anonymous guest &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
