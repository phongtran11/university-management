"use server";

import { cookies } from "next/headers";

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

/**
 * Store authentication tokens in cookies
 */
export async function storeTokensInCookies(tokens: TokenResponse) {
  if (typeof window === "undefined") {
    // Server-side: Use cookies from next/headers
    const cookieStore = await cookies();

    // Store access token (short-lived)
    cookieStore.set("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokens.expires_in,
      path: "/",
      sameSite: "lax",
    });

    // Store refresh token (long-lived)
    cookieStore.set("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
      sameSite: "lax",
    });
  } else {
    // Client-side: Cannot directly set HTTP-only cookies
    // The API should handle setting cookies in the response
    console.warn("Cannot set HTTP-only cookies on the client-side.");
  }
}

/**
 * Clear authentication tokens from cookies
 */
export async function clearTokensFromCookies() {
  if (typeof window === "undefined") {
    // Server-side: Use cookies from next/headers
    const cookieStore = await cookies();

    cookieStore.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });

    cookieStore.set("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });
  } else {
    // Client-side: Cannot directly clear HTTP-only cookies
    // The API should handle clearing cookies in the response
    console.warn("Cannot clear HTTP-only cookies on the client-side.");
  }
}
