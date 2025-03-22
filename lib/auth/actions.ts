"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as serverApi from "../api/server";
import {
  clearTokensFromCookies,
  storeTokensInCookies,
  type TokenResponse,
} from "../api/tokens";
import { API_ROUTES } from "../constants";
import type {
  CheckEmailVerifiedResult,
  GetUserResult,
  LoginCredentials,
  LoginResult,
  LogoutResult,
  RefreshTokenResult,
  RegisterData,
  RegisterResult,
  User,
  VerifyEmailResult,
} from "./types";

/**
 * Server action to handle login
 */
export async function loginAction(
  credentials: LoginCredentials
): Promise<LoginResult> {
  try {
    // Call the login API
    const response = await serverApi.post<TokenResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || "Login failed",
      };
    }

    // Store the tokens in cookies
    await storeTokensInCookies(response.data);

    const getCurrentUserResult = await getCurrentUserAction();
    const user = getCurrentUserResult.user;
    if (!getCurrentUserResult.success || !user) {
      return {
        success: false,
        error: getCurrentUserResult.error || "Failed to fetch user profile",
      };
    }

    return {
      success: true,
      user: user,
    };
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}

/**
 * Server action to handle registration
 */
export async function registerAction(
  data: RegisterData
): Promise<RegisterResult> {
  try {
    // Format date of birth if it exists
    const formattedData = {
      ...data,
      date_of_birth: data.date_of_birth
        ? data.date_of_birth.toISOString()
        : undefined,
    };

    // Call the register API
    const response = await serverApi.post<TokenResponse>(
      API_ROUTES.AUTH.REGISTER,
      formattedData
    );

    if (!response.success) {
      return {
        success: false,
        error: response.error || "Registration failed",
      };
    }

    // Store the tokens in cookies
    await storeTokensInCookies(response.data);

    return {
      success: true,
      tokens: response.data,
    };
  } catch (error) {
    console.error("Registration error:", error);

    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}

/**
 * Server action to verify email
 */
export async function verifyEmailAction(
  code: string
): Promise<VerifyEmailResult> {
  try {
    // Call the verify email API
    const response = await serverApi.post(API_ROUTES.AUTH.VERIFY_EMAIL, {
      code,
    });

    if (!response.success) {
      return {
        success: false,
        error: response.error || "Email verification failed",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Email verification error:", error);

    return {
      success: false,
      error: "Invalid verification code",
    };
  }
}

/**
 * Server action to check if email is verified
 */
export async function checkEmailVerifiedAction(): Promise<CheckEmailVerifiedResult> {
  try {
    // Call the API to get current user
    const response = await serverApi.get<User>(API_ROUTES.USERS.ME);

    if (!response.success || !response.data) {
      return {
        success: false,
        verified: false,
        error: response.error || "Failed to check email verification status",
      };
    }

    return { success: true, verified: response.data.email_verified };
  } catch (error) {
    console.error("Check email verification error:", error);

    return {
      success: false,
      verified: false,
      error: "An unknown error occurred",
    };
  }
}

/**
 * Server action to handle logout
 */
export async function logoutAction(): Promise<LogoutResult> {
  try {
    // Call the logout API
    const response = await serverApi.post(API_ROUTES.AUTH.LOGOUT, {});

    if (!response.success) {
      return {
        success: false,
        error: response.error || "Logout failed",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);

    return {
      success: false,
      error: "An unknown error occurred",
    };
  } finally {
    // Always clear tokens even if API call fails
    clearTokensFromCookies();
  }
}

/**
 * Server action to get current user
 */
export async function getCurrentUserAction(): Promise<GetUserResult> {
  try {
    // Call the API to get current user
    const response = await serverApi.get<User>(API_ROUTES.USERS.ME);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || "Failed to fetch user profile",
      };
    }

    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    console.error("Get current user error:", error);

    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}

/**
 * Server action to refresh token
 */
export async function refreshTokenAction(): Promise<RefreshTokenResult> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return { success: false, error: "No refresh token available" };
    }

    // Call the refresh token API
    const response = await serverApi.post<{ data: TokenResponse }>(
      API_ROUTES.AUTH.REFRESH_TOKEN,
      {
        refresh_token: refreshToken,
      }
    );

    if (!response.success || !response.data.data) {
      return {
        success: false,
        error: response.error || "Token refresh failed",
      };
    }

    // Store the new tokens
    await storeTokensInCookies(response.data.data);
    return { success: true };
  } catch (error) {
    console.error("Token refresh error:", error);

    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}
