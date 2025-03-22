export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/register/verify-email",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
  },
  USER: {
    BASE: "/users",
    ME: "/users/me",
  },
  POSTS: {
    base: "/posts",
  },
} as const;
