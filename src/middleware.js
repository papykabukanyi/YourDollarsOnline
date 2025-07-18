import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/api/health',
    '/api/categories',
    '/api/products',
    '/api/search',
    '/api/env-check',
    '/api/test-redis',
    '/api/init',
    '/admin/login'
  ];

  // Check if it's a public route
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protected admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('adminToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Super admin only routes
    const superAdminRoutes = [
      '/admin/admins',
      '/admin/settings',
      '/api/admin/admins'
    ];

    if (superAdminRoutes.some(route => pathname.startsWith(route))) {
      if (decoded.role !== 'SUPER_ADMIN') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
      }
    }

    // Add user info to request headers for API routes
    if (pathname.startsWith('/api/admin')) {
      const response = NextResponse.next();
      response.headers.set('X-User-ID', decoded.id || '');
      response.headers.set('X-User-Role', decoded.role || '');
      response.headers.set('X-User-Username', decoded.username || '');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
