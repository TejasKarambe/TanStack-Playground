import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/auth-context'

function TestAuthConsumer() {
  const { user, isAuthenticated, loginAsDemo, logout } = useAuth()
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'AUTHENTICATED' : 'ANONYMOUS'}</div>
      <div data-testid="user-email">{user ? user.email : 'NONE'}</div>
      <button onClick={() => loginAsDemo()}>Demo Login</button>
      <button onClick={() => logout()}>Sign Out</button>
    </div>
  )
}

describe('Auth Context & Anonymous Browsing Support', () => {
  it('starts in anonymous guest mode when no session is stored', () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status').textContent).toBe('ANONYMOUS')
    expect(screen.getByTestId('user-email').textContent).toBe('NONE')
  })

  it('signs in as demo user and updates authentication state', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    )

    await act(async () => {
      screen.getByText('Demo Login').click()
    })

    expect(screen.getByTestId('auth-status').textContent).toBe('AUTHENTICATED')
    expect(screen.getByTestId('user-email').textContent).toBe('demo@tanstack.dev')
  })

  it('signs out and reverts to anonymous guest mode cleanly', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    )

    await act(async () => {
      screen.getByText('Demo Login').click()
    })
    expect(screen.getByTestId('auth-status').textContent).toBe('AUTHENTICATED')

    await act(async () => {
      screen.getByText('Sign Out').click()
    })
    expect(screen.getByTestId('auth-status').textContent).toBe('ANONYMOUS')
  })
})
