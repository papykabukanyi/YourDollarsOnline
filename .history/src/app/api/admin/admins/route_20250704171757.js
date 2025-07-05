import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../../lib/database';
import { verifyToken, hashPassword, generateId, PERMISSIONS } from '../../../../../lib/auth';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    const redis = await getRedisClient();
    const adminKeys = await redis.keys('admin:*');
    const admins = [];

    for (const key of adminKeys) {
      const adminData = await redis.get(key);
      if (adminData) {
        const admin = JSON.parse(adminData);
        // Remove password from response
        const { password, ...adminWithoutPassword } = admin;
        admins.push(adminWithoutPassword);
      }
    }

    return NextResponse.json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    const { username, email, password, role, permissions } = await request.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const redis = await getRedisClient();
    
    // Check if admin already exists
    const existingAdmin = await redis.get(`admin:${username}`);
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin object
    const admin = {
      id: generateId(),
      username,
      email,
      password: hashedPassword,
      role,
      permissions: permissions || [],
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: decoded.username
    };

    // Save admin
    await redis.set(`admin:${username}`, JSON.stringify(admin));

    // Log activity
    const logData = {
      adminId: decoded.id,
      username: decoded.username,
      action: 'create_admin',
      targetAdmin: username,
      timestamp: new Date().toISOString()
    };
    await redis.lPush('admin_activity_logs', JSON.stringify(logData));

    const { password: _, ...adminWithoutPassword } = admin;
    return NextResponse.json({ 
      message: 'Admin created successfully', 
      admin: adminWithoutPassword 
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
