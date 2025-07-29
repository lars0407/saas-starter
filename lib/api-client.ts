"use client"

interface ApiClientOptions {
  baseURL?: string
  timeout?: number
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

class ApiClient {
  private baseURL: string
  private timeout: number

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || 'https://api.jobjaeger.de'
    this.timeout = options.timeout || 10000
  }

  private getAuthToken(): string | null {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return null
    }

    try {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1] || null
    } catch (error) {
      console.error('Error extracting auth token:', error)
      return null
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout
    } = options

    // Get auth token
    const token = this.getAuthToken()
    
    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    }

    // Add auth header if token exists
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }

    // Prepare request config
    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout)
    }

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, requestConfig)

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.')
        }
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission for this action.')
        }
        if (response.status === 404) {
          throw new Error('Resource not found.')
        }
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.')
        }
        
        // Try to get error message from response
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Request failed with status ${response.status}`)
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }
      
      return await response.text() as T
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body })
  }

  async put<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body })
  }

  async delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async patch<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body })
  }
}

// Create and export a default instance
export const apiClient = new ApiClient()

// Export the class for custom instances
export { ApiClient } 