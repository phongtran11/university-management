import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APP_ROUTES, PUBLIC_ROUTES, AUTH_ROUTES } from "./lib/constants";
import { getCurrentUserAction } from "./lib/auth";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Check if the path is public (login, register)
  const isPublicRoute = PUBLIC_ROUTES.includes(path);

  // Check if the path requires auth but not verification (verify email page)
  const isAuthRoute = AUTH_ROUTES.includes(path);

  // Check if user is authenticated
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isAuthenticated = !!accessToken || !!refreshToken;

  // If the route is not public and the user is not authenticated, redirect to login
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL(APP_ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated and trying to access public routes, redirect to dashboard
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
  }

  // For authenticated routes that require verification, we need to check the user's verification status
  if (isAuthenticated && !isPublicRoute && !isAuthRoute) {
    // We'll make a request to get the user's profile and check verification status
    try {
      const getCurrentUserResult = await getCurrentUserAction();
      const user = getCurrentUserResult.user;
      if (getCurrentUserResult.success && user) {
        // If email is not verified and trying to access a protected route, redirect to verify
        if (user && !user.email_verified && path !== APP_ROUTES.VERIFY) {
          return NextResponse.redirect(new URL(APP_ROUTES.VERIFY, request.url));
        }

        // If email is verified and trying to access verify page, redirect to dashboard
        if (user && user.email_verified && path === APP_ROUTES.VERIFY) {
          return NextResponse.redirect(
            new URL(APP_ROUTES.DASHBOARD, request.url)
          );
        }
      } else {
        // If the API call fails, we'll clear the tokens and redirect to login
        const response = NextResponse.redirect(
          new URL(APP_ROUTES.LOGIN, request.url)
        );
        response.cookies.set("access_token", "", { maxAge: 0 });
        response.cookies.set("refresh_token", "", { maxAge: 0 });
        return response;
      }
    } catch (error) {
      console.error("Error checking user verification status:", error);
      // If there's an error, we'll let the request continue and let the page handle it
    }
  }

  return NextResponse.next();
}

// Match all routes except for static files, api routes, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
