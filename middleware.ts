import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/api/user'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Internal admin routes - require authentication and admin access
  const internalRoutes = ['/internal'];
  const isInternalRoute = internalRoutes.some(route => pathname.startsWith(route));
  
  // Allow Google OAuth routes
  if (pathname.startsWith('/api/auth/google') || pathname.startsWith('/google/success')) {
    return NextResponse.next();
  }
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  
  // Internal routes require authentication (admin check is handled in the layout)
  if (isInternalRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs'
};
