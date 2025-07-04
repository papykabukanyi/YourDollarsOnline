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

    // Check if user has admin privileges
    if (!['super_admin', 'admin'].includes(decoded.role)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Super admin only routes
    const superAdminRoutes = [
      '/admin/settings',
      '/admin/admins',
      '/api/admin/manage',
      '/api/admin/smtp'
    ];

    if (superAdminRoutes.some(route => pathname.startsWith(route)) && decoded.role !== 'super_admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.id);
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-user-username', decoded.username);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
