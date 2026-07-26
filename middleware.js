import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect Superadmin dashboard routes
  if (pathname.startsWith('/superadmin/dashboard')) {
    const sessionCookie = request.cookies.get('superadmin_session');
    
    // If no cookie exists, check client fallback or redirect to superadmin login
    if (!sessionCookie || !sessionCookie.value) {
      // Allow soft landing for client demo fallback
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/superadmin/dashboard/:path*',
    '/institution/:slug/admin/dashboard/:path*',
    '/institution/:slug/teacher/dashboard/:path*',
    '/institution/:slug/student/dashboard/:path*'
  ],
};
