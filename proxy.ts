import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /officer and /generate routes
  if (pathname.startsWith('/officer') || pathname.startsWith('/generate')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/officer/:path*', '/generate/:path*'],
};
