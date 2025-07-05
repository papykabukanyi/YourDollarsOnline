import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../lib/database';
import { comparePassword, generateToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const redis = await getRedisClient();
    const adminData = await redis.get(`admin:${username}`);

    if (!adminData) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const admin = JSON.parse(adminData);

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    const isValidPassword = await comparePassword(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: admin.id,
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    });

    // Log login activity
    const logData = {
      adminId: admin.id,
      username: admin.username,
      action: 'login',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };

    await redis.lPush('admin_activity_logs', JSON.stringify(logData));

    // Update last login
    admin.lastLogin = new Date().toISOString();
    await redis.set(`admin:${username}`, JSON.stringify(admin));

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions || [],
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
