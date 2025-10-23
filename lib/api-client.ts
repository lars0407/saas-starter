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

export async function saveResume(
  documentId: number = 0, 
  documentName: string, 
  data: any,
  templateId: number = 8
) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const response = await fetch("https://api.jobjaeger.de/api:SiRHLF4Y/documents/resume/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify({
      document_id: documentId,
      document_name: documentName,
      template_id: templateId,
      data: data
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchDocument(documentId: number) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const response = await fetch(`https://api.jobjaeger.de/api:SiRHLF4Y/documents/${documentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function generateResumePDF(
  templateId: number = 8,
  documentName: string,
  documentId: number,
  data: any
) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const response = await fetch("https://api.jobjaeger.de/api:SiRHLF4Y/documents/resume/generatepdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify({
      template_id: templateId,
      document_name: documentName,
      document_id: documentId,
      data: data
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function saveCoverLetter(
  documentId: number = 0, 
  documentName: string, 
  data: any,
  templateId: number = 10
) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const response = await fetch("https://api.jobjaeger.de/api:SiRHLF4Y/documents/cover_letter/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify({
      document_id: documentId,
      document_name: documentName,
      template_id: templateId,
      data: data
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function generateCoverLetterPDF(
  templateId: number = 10,
  documentName: string,
  documentId: number,
  data: any
) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const response = await fetch("https://api.jobjaeger.de/api:SiRHLF4Y/documents/cover_letter/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify({
      template_id: templateId,
      document_name: documentName,
      document_id: documentId,
      data: data
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  
  // Return the new response format directly
  return result;
}

export async function generateResumeSummary(resumeData: any) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const response = await fetch('https://api.jobjaeger.de/api:6H_xVEFw/artifact/resume/summary/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({
      resume_data: resumeData
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Save published date to database
 */
export async function savePublishedDate(
  documentId: number,
  intervalValue: number,
  metadata?: Record<string, any>
) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const response = await fetch("https://api.jobjaeger.de/api:SiRHLF4Y/documents/publish-date", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    },
    body: JSON.stringify({
      document_id: documentId,
      date_published: intervalValue, // Speichert 1, 3, 7 oder 30
      metadata: metadata || {}
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get published date from database
 */
export async function getPublishedDate(documentId: number) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const response = await fetch(`https://api.jobjaeger.de/api:SiRHLF4Y/documents/${documentId}/publish-date`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Search addresses using JobJaeger API (same as job search)
 */
export async function searchAddresses(query: string, limit: number = 5) {
  try {
    const response = await fetch(`https://api.jobjaeger.de/api:O72K2wiB/geopoint/search?adresse=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Address search failed')
    }

    const data = await response.json()
    
    if (data.suggestions && Array.isArray(data.suggestions)) {
      return data.suggestions.map((item: any) => {
        // Extract coordinates and full address
        const coordinates = item.geometry?.coordinates
        const lon = coordinates?.[0]
        const lat = coordinates?.[1]
        
        // Use full_address if available, otherwise construct from name and place_formatted
        let fullAddress = 'Unbekannter Ort'
        if (item.properties && item.properties.full_address) {
          fullAddress = item.properties.full_address
        } else if (item.properties && item.properties.name && item.properties.place_formatted) {
          fullAddress = `${item.properties.name}, ${item.properties.place_formatted}`
        } else if (item.properties && item.properties.name) {
          fullAddress = item.properties.name
        }
        
        return {
          id: item.id || item.properties?.mapbox_id || Math.random(),
          display_name: fullAddress,
          lat: lat || 0,
          lon: lon || 0,
          type: item.properties?.feature_type || 'place',
          importance: 0.5, // Default importance since JobJaeger API doesn't provide this
          address: {
            city: item.properties?.name,
            state: item.properties?.context?.region?.name,
            country: item.properties?.context?.country?.name,
            postcode: '', // JobJaeger API doesn't provide postcode in this format
            street: '', // JobJaeger API doesn't provide street in this format
            house_number: '' // JobJaeger API doesn't provide house number in this format
          }
        }
      }).slice(0, limit) // Limit results
    }
    
    return []
  } catch (error) {
    console.error('Address search error:', error)
    throw new Error('Address search failed. Please try again.')
  }
}

/**
 * Get address details from coordinates (reverse geocoding)
 */
export async function getAddressDetails(lat: number, lon: number) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Address details fetch failed')
    }

    const data = await response.json()
    return {
      id: data.place_id,
      display_name: data.display_name,
      lat: parseFloat(data.lat),
      lon: parseFloat(data.lon),
      address: {
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postcode: data.address?.postcode,
        street: data.address?.road,
        house_number: data.address?.house_number
      }
    }
  } catch (error) {
    console.error('Address details error:', error)
    throw new Error('Address details fetch failed. Please try again.')
  }
}