import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is authenticated and trying to access signin page, redirect to home
    if (pathname === "/signin" && token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If user is authenticated and trying to access onboarding, allow it
    if (pathname === "/onboarding" && token) {
      return NextResponse.next();
    }

    // If user is authenticated and trying to access dashboard, allow it
    if (pathname === "/dashboard" && token) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        
        // Allow access to auth API routes
        if (pathname.startsWith("/api/auth")) {
          return true;
        }

        // Allow public locations API (countries/states, no auth)
        if (pathname.startsWith("/api/countries")) {
          return true;
        }

        // Allow access to signin page without authentication
        if (pathname === "/signin") {
          return true;
        }

        // Allow access to home page without authentication (component will handle redirect)
        if (pathname === "/") {
          return true;
        }

        // Allow /onboarding without auth in middleware so OAuth callback redirect lands here;
        // OnboardingFlow will redirect to signin if session is unauthenticated after hydrate
        if (pathname === "/onboarding") {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};