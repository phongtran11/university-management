// Authentication functions using the enhanced API

import { api, storeTokens, clearTokens } from "./api"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  email_verified: boolean
  phone_number?: string | null
  date_of_birth?: Date | null
  gender?: number | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number?: string | null
  date_of_birth?: Date | null
  gender?: number | null
}

interface LoginResponse {
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

// Mock user data for development
let currentUser: User | null = null

// Login function
export async function loginUser(credentials: LoginCredentials): Promise<User> {
  try {
    // Call the login API
    const response = await api.post<LoginResponse>("/auth/login", credentials)

    if (response.success && response.data) {
      // Store the tokens
      storeTokens(response.data)

      // Fetch user profile
      const userResponse = await api.get<User>("/api/me")

      if (userResponse.success && userResponse.data) {
        currentUser = userResponse.data
        return userResponse.data
      }
    }

    throw new Error(response.error || "Login failed")
  } catch (error) {
    console.error("Login error:", error)

    // For development/demo purposes, return mock data
    if (process.env.NODE_ENV !== "production") {
      console.log("Using mock login data for development")

      // Mock token response
      const mockTokens = {
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        expires_in: 3600,
        refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        token_type: "Bearer",
      }

      // Store mock tokens
      storeTokens(mockTokens)

      // Mock user
      const user: User = {
        id: "1",
        email: credentials.email,
        first_name: "Nguyễn",
        last_name: "Văn A",
        email_verified: false,
        phone_number: "0912345678",
        date_of_birth: new Date("1990-01-01"),
        gender: 1,
      }

      currentUser = user
      return user
    }

    throw error
  }
}

// Register function
export async function registerUser(data: RegisterData): Promise<User> {
  try {
    // Call the register API
    const response = await api.post<User>("/auth/register", data)

    if (response.success && response.data) {
      currentUser = response.data
      return response.data
    }

    throw new Error(response.error || "Registration failed")
  } catch (error) {
    console.error("Registration error:", error)

    // For development/demo purposes, return mock data
    if (process.env.NODE_ENV !== "production") {
      console.log("Using mock registration data for development")

      const user: User = {
        id: "1",
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        email_verified: false,
        phone_number: data.phone_number,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
      }

      currentUser = user
      return user
    }

    throw error
  }
}

// Verify email function
export async function verifyEmail(code: string): Promise<boolean> {
  try {
    // Call the verify email API
    const response = await api.post<{ verified: boolean }>("/auth/verify-email", { code })

    if (response.success && response.data?.verified) {
      // Update the user's email_verified status
      if (currentUser) {
        currentUser.email_verified = true
      }
      return true
    }

    throw new Error(response.error || "Email verification failed")
  } catch (error) {
    console.error("Email verification error:", error)

    // For development/demo purposes
    if (process.env.NODE_ENV !== "production") {
      console.log("Using mock verification for development")

      // Check if the code is valid (mock validation)
      if (code === "123456" || code.length === 6) {
        // Update the user's email_verified status
        if (currentUser) {
          currentUser.email_verified = true
        }
        return true
      }
    }

    throw new Error("Invalid verification code")
  }
}

// Check if email is verified
export async function checkEmailVerified(): Promise<boolean> {
  try {
    // Call the API to get current user
    const response = await api.get<User>("/api/me")

    if (response.success && response.data) {
      currentUser = response.data
      return response.data.email_verified
    }

    throw new Error(response.error || "Failed to check email verification status")
  } catch (error) {
    console.error("Check email verification error:", error)

    // For development/demo purposes
    if (process.env.NODE_ENV !== "production") {
      console.log("Using mock email verification check for development")

      if (!currentUser) {
        throw new Error("User not logged in")
      }

      return currentUser.email_verified
    }

    throw error
  }
}

// Logout function
export async function logoutUser(): Promise<void> {
  try {
    // Call the logout API
    await api.post<{}>("/auth/logout", {})

    // Clear tokens and user data
    clearTokens()
    currentUser = null
  } catch (error) {
    console.error("Logout error:", error)

    // Always clear tokens and user data even if API call fails
    clearTokens()
    currentUser = null

    // For development/demo purposes, we don't throw here
    if (process.env.NODE_ENV === "production") {
      throw error
    }
  }
}

// Get current user function
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Call the API to get current user
    const response = await api.get<User>("/api/me")

    if (response.success && response.data) {
      currentUser = response.data
      return response.data
    }

    return null
  } catch (error) {
    console.error("Get current user error:", error)

    // For development/demo purposes
    if (process.env.NODE_ENV !== "production") {
      console.log("Using mock current user for development")
      return currentUser
    }

    return null
  }
}

