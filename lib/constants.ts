/**
 * API route constants
 */
export const API_ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    VERIFY_EMAIL: "/auth/register/verify-email",
  },
  // User routes
  USERS: {
    ME: "/users/me",
    LIST: "/users",
  },
}

/**
 * Application routes
 */
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY: "/verify",
  DASHBOARD: "/dashboard",
}

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [APP_ROUTES.LOGIN, APP_ROUTES.REGISTER]

/**
 * Routes that require authentication but not email verification
 */
export const AUTH_ROUTES = [APP_ROUTES.VERIFY]

