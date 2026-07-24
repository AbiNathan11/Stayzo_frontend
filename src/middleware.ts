import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('stayzo_token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard/tenant')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  if (pathname.startsWith('/dashboard/owners')) {
    if (pathname.startsWith('/dashboard/owners/broker')) {
      return NextResponse.next();
    }
    if (!token) {
      return NextResponse.redirect(new URL('/auth?role=landlord', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/tenant/:path*',
    '/dashboard/owners/:path*',
  ],
};
