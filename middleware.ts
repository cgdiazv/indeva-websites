import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if trying to access the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check for admin session cookie
    const hasAdminSession = request.cookies.has('admin_session');
    
    // If no session, redirect to login page
    if (!hasAdminSession) {
      const loginUrl = new URL('/acceder', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
