import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
import { connectDB, getUserById } from '../../../lib/database';

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

    // Get user from database with current data
    const db = await connectDB();
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data without password
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive !== false
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
