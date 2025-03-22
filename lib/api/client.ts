import { apiFetch } from "./fetch";

/**
 * Client-side API helpers using BFF pattern
 * Instead of calling external APIs directly, we'll call our Next.js API routes
 * which will act as a Backend-For-Frontend (BFF)
 */
export const clientApi = {
  get: async <T>(path: string, options: RequestInit = {}) => {
    // Convert external API path to our internal Next.js API route
    const url = `/api${path}`;

    return apiFetch<T>(url, {
      ...options,
      method: "GET",
      credentials: "include",
    });
  },

  post: async <T>(path: string, data: any, options: RequestInit = {}) => {
    const url = `/api${path}`;

    return apiFetch<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    });
  },

  put: async <T>(path: string, data: any, options: RequestInit = {}) => {
    const url = `/api${path}`;

    return apiFetch<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
      credentials: "include",
    });
  },

  delete: async <T>(path: string, options: RequestInit = {}) => {
    const url = `/api${path}`;

    return apiFetch<T>(url, {
      ...options,
      method: "DELETE",
      credentials: "include",
    });
  },
};
