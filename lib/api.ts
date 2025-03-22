// API utilities for making authenticated requests

interface TokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  code?: number
}

// Store for auth tokens
let authTokens: TokenResponse | null = null

// Base API URL - replace with your actual API URL
const API_BASE_URL = "https://api.example.com"

/**
 * Enhanced fetch function with logging and token handling
 */
export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const isFullUrl = url.startsWith("http")
  const fullUrl = isFullUrl ? url : `${API_BASE_URL}${url}`

  // Prepare headers with auth token if available
  const headers = new Headers(options.headers || {})

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  // Add auth token if available and not a login/refresh request
  if (authTokens && !url.includes("/auth/login") && !url.includes("/auth/refresh-token")) {
    headers.set("Authorization", `${authTokens.token_type} ${authTokens.access_token}`)
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  // Log request
  console.log(`🚀 Request: ${options.method || "GET"} ${fullUrl}`)
  if (options.body) {
    try {
      // Only log if it's JSON
      if (typeof options.body === "string") {
        console.log("📦 Payload:", JSON.parse(options.body))
      } else if (!(options.body instanceof FormData)) {
        console.log("📦 Payload:", options.body)
      }
    } catch (e) {
      // If it's not JSON, don't log the body
    }
  }

  try {
    const response = await fetch(fullUrl, config)

    // Log response status
    console.log(`📥 Response Status: ${response.status} ${response.statusText}`)

    // Parse response
    const data = await response.json()
    console.log("📄 Response Data:", data)

    // Check if token expired
    if (data.success === false && (data.code === 401 || data.error === "Token expired")) {
      console.log("🔄 Token expired, attempting refresh...")

      // Try to refresh the token
      const refreshed = await refreshToken()

      if (refreshed) {
        // Retry the original request with new token
        console.log("🔄 Token refreshed, retrying original request...")
        return apiFetch<T>(url, options)
      } else {
        // If refresh failed, logout and redirect
        console.log("❌ Token refresh failed, logging out...")
        clearTokens()

        // In browser environment, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }

        throw new Error("Authentication failed. Please login again.")
      }
    }

    return data
  } catch (error) {
    console.error("❌ Fetch Error:", error)
    throw error
  }
}

/**
 * Store authentication tokens
 */
export function storeTokens(tokens: TokenResponse): void {
  authTokens = tokens

  // Also store in localStorage for persistence across page refreshes
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_tokens", JSON.stringify(tokens))
  }

  console.log("🔑 Auth tokens stored")
}

/**
 * Load tokens from storage (call this on app initialization)
 */
export function loadTokens(): boolean {
  if (typeof window !== "undefined") {
    const storedTokens = localStorage.getItem("auth_tokens")
    if (storedTokens) {
      try {
        authTokens = JSON.parse(storedTokens)
        console.log("🔑 Auth tokens loaded from storage")
        return true
      } catch (e) {
        console.error("Failed to parse stored tokens", e)
      }
    }
  }
  return false
}

/**
 * Clear authentication tokens
 */
export function clearTokens(): void {
  authTokens = null

  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_tokens")
  }

  console.log("🗑️ Auth tokens cleared")
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshToken(): Promise<boolean> {
  if (!authTokens?.refresh_token) {
    console.log("❌ No refresh token available")
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: authTokens.refresh_token,
      }),
    })

    const data = await response.json()

    if (data.success && data.data) {
      // Store the new tokens
      storeTokens(data.data)
      return true
    } else {
      console.log("❌ Token refresh failed:", data.error || "Unknown error")
      return false
    }
  } catch (error) {
    console.error("❌ Token refresh error:", error)
    return false
  }
}

/**
 * Initialize the API module
 * Call this when your app starts
 */
export function initApi(): void {
  loadTokens()
}

/**
 * Helper methods for common HTTP methods
 */
export const api = {
  get: <T>(url: string, options: RequestInit = {}) => 
    apiFetch<T>(url, { ...options, method: 'GET' }),
    
  post: <T>(url: string, data: any, options: RequestInit = {}) => 
    apiFetch<T>(url, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    
  put: <T>(url: string, data: any, options: RequestInit = {}) => 
    apiFetch<T>(url, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    
  delete: <T>(url: string, options: RequestInit = {}) => 
    apiFetch<T>(url, { ...options, method: 'DELETE' }),
};

// Export all necessary functions at the bottom to ensure they're available;

