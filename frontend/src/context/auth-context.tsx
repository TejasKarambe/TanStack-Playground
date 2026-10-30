import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi, type UserResponse } from '../services/api'
import { toast } from 'sonner'

interface AuthContextType {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  login: (email: string, password: string) => Promise<void>
  loginAsDemo: () => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Verify session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('tanstack_auth_token')
        if (token) {
          const profile = await authApi.getMe()
          setUser(profile)
        }
      } catch {
        // Anonymous visitor session or expired token
        localStorage.removeItem('tanstack_auth_token')
      } finally {
        setIsLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.login({ email, password })
      setUser(res.user)
      setIsAuthModalOpen(false)
      toast.success(`Welcome back, ${res.user.displayName || res.user.email}!`)
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsDemo = async () => {
    setIsLoading(true)
    try {
      // First try logging into seeded demo account
      const res = await authApi.login({
        email: 'demo@tanstack.dev',
        password: 'password123',
      })
      setUser(res.user)
      setIsAuthModalOpen(false)
      toast.success(`Signed in as ${res.user.displayName}!`)
    } catch {
      // If backend is unreachable or not seeded yet, fallback to client-side demo user
      const mockDemoUser: UserResponse = {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'demo@tanstack.dev',
        displayName: 'Demo Developer',
        createdAt: new Date().toISOString(),
      }
      setUser(mockDemoUser)
      setIsAuthModalOpen(false)
      toast.success('Signed in as Demo Developer (Local Session)')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.register({ email, password, displayName })
      setUser(res.user)
      setIsAuthModalOpen(false)
      toast.success(`Account created! Welcome, ${res.user.displayName}!`)
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    } finally {
      setUser(null)
      localStorage.removeItem('tanstack_auth_token')
      toast.info('Signed out. Continuing in anonymous guest mode.')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        loginAsDemo,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

