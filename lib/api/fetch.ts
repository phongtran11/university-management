import { API_ROUTES } from "../constants";

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  code?: number;
}

// Base API URL from environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

/**
 * Enhanced fetch function with logging and token handling
 * This version works on both client and server
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<ApiResponse<T>> {
  const isFullUrl = url.startsWith("http");
  const fullUrl = isFullUrl ? url : `${API_BASE_URL}${url}`;

  // Prepare headers with auth token if available
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  console.log("🔑 Access Token:", accessToken);

  // Add auth token if available and not a login/refresh request
  if (
    accessToken &&
    !url.includes(API_ROUTES.AUTH.LOGIN) &&
    !url.includes(API_ROUTES.AUTH.REFRESH_TOKEN)
  ) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  // Log request
  console.log(`🚀 Request: ${options.method || "GET"} ${fullUrl}`);
  if (options.body) {
    try {
      // Only log if it's JSON
      if (typeof options.body === "string") {
        console.log("📦 Payload:", JSON.parse(options.body));
      } else if (!(options.body instanceof FormData)) {
        console.log("📦 Payload:", options.body);
      }
    } catch (e) {
      // If it's not JSON, don't log the body
    }
  }

  try {
    const response = await fetch(fullUrl, config);

    // Log response status
    console.log(
      `📥 Response Status: ${response.status} ${response.statusText}`
    );

    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API Error:", errorData);

      // Return a standardized error response
      return {
        success: false,
        data: {} as T,
        error:
          errorData.message ||
          errorData.error ||
          `HTTP error ${response.status}`,
        code: response.status,
      };
    }

    // Parse response
    const data = await response.json();
    console.log("📄 Response Data:", data);

    // If the API doesn't wrap responses in a success/data structure,
    // we'll do it here to maintain a consistent interface
    if (data.success === undefined) {
      return {
        success: true,
        data: data as T,
      };
    }

    return data;
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return {
      success: false,
      data: {} as T,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
