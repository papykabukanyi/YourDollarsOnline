import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';
import { comparePassword, generateToken } from '../../../lib/auth';

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
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    });

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
        role: admin.role
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
