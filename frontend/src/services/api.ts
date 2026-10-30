/**
 * TanStack Playground REST API Client
 * Connects to Spring Boot backend (/api) with HttpOnly credentials support
 */

export interface UserResponse {
  id: string
  email: string
  displayName: string
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresInSeconds: number
  user: UserResponse
}

export interface UserProgressResponse {
  id: string
  userId: string
  topicId: string
  completed: boolean
  lastVisitedAt: string
  completedAt?: string
}

export interface ProgressSummaryResponse {
  totalTopics: number
  completedTopics: number
  progressPercentage: number
}

export interface BookmarkResponse {
  id: string
  userId: string
  topicId: string
  createdAt: string
}

export interface PreferenceResponse {
  id: string
  userId: string
  theme: string
  editorFontSize: number
  editorWordWrap: boolean
  previewLayout: string
}

const API_BASE = '/api'

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('tanstack_auth_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // for HttpOnly session cookies
  })

  if (!response.ok) {
    let errorDetail = response.statusText
    try {
      const errJson = await response.json()
      errorDetail = errJson.message || errJson.error || JSON.stringify(errJson)
    } catch {
      // ignore
    }
    throw new Error(`API Error ${response.status}: ${errorDetail}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

export const authApi = {
  login: async (creds: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(creds),
    })
    if (res.accessToken) {
      localStorage.setItem('tanstack_auth_token', res.accessToken)
    }
    return res
  },

  register: async (data: { email: string; password: string; displayName: string }): Promise<AuthResponse> => {
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (res.accessToken) {
      localStorage.setItem('tanstack_auth_token', res.accessToken)
    }
    return res
  },

  logout: async (): Promise<void> => {
    try {
      await request<void>('/auth/logout', { method: 'POST' })
    } finally {
      localStorage.removeItem('tanstack_auth_token')
    }
  },

  getMe: async (): Promise<UserResponse> => {
    return request<UserResponse>('/auth/me')
  },
}

export const progressApi = {
  getProgress: async (): Promise<UserProgressResponse[]> => {
    return request<UserProgressResponse[]>('/progress')
  },

  markCompleted: async (topicId: string): Promise<UserProgressResponse> => {
    return request<UserProgressResponse>(`/progress/${topicId}/complete`, { method: 'POST' })
  },

  recordVisit: async (topicId: string): Promise<UserProgressResponse> => {
    return request<UserProgressResponse>(`/progress/${topicId}/visit`, { method: 'POST' })
  },

  getSummary: async (): Promise<ProgressSummaryResponse> => {
    return request<ProgressSummaryResponse>('/progress/summary')
  },
}

export const bookmarkApi = {
  getBookmarks: async (): Promise<BookmarkResponse[]> => {
    return request<BookmarkResponse[]>('/bookmarks')
  },

  addBookmark: async (topicId: string): Promise<BookmarkResponse> => {
    return request<BookmarkResponse>(`/bookmarks/${topicId}`, { method: 'POST' })
  },

  removeBookmark: async (topicId: string): Promise<void> => {
    return request<void>(`/bookmarks/${topicId}`, { method: 'DELETE' })
  },
}

export const preferenceApi = {
  getPreferences: async (): Promise<PreferenceResponse> => {
    return request<PreferenceResponse>('/preferences')
  },

  updatePreferences: async (prefs: Partial<PreferenceResponse>): Promise<PreferenceResponse> => {
    return request<PreferenceResponse>('/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    })
  },
}

