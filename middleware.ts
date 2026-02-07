import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = request.nextUrl.pathname === '/admin/login';

  // Redirect to login if accessing admin without auth
  if (isAdminPath && !isLoginPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect to admin dashboard if already logged in and trying to access login
  if (isLoginPath && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
