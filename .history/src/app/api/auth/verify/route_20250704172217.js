import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { getRedisClient } from '../../../../lib/database';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user from Redis database
    const redis = await getRedisClient();
    const userKey = `admin:${decoded.username}`;
    const userData = await redis.get(userKey);
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = JSON.parse(userData);

    // Return user data without password
    const responseData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive !== false
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
