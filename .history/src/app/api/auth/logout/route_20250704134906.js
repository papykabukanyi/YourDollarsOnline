import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { getRedisClient } from '../../../../lib/database';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Optional: Add token to blacklist in Redis
    const redis = await getRedisClient();
    await redis.setEx(`blacklisted_token:${token}`, 86400, 'true'); // 24 hours

    // Log logout activity
    const logData = {
      adminId: decoded.id,
      username: decoded.username,
      action: 'logout',
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };

    await redis.lPush('admin_activity_logs', JSON.stringify(logData));

    return NextResponse.json({
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
