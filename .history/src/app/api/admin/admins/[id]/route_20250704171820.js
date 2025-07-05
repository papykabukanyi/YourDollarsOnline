import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../../../lib/database';
import { verifyToken, hashPassword } from '../../../../../../lib/auth';

export async function PUT(request, { params }) {
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

    const { id } = params;
    const { username, email, password, role, permissions, isActive } = await request.json();

    if (!username || !email || !role) {
      return NextResponse.json({ error: 'Username, email, and role are required' }, { status: 400 });
    }

    const redis = await getRedisClient();
    
    // Find admin by ID
    const adminKeys = await redis.keys('admin:*');
    let adminKey = null;
    let existingAdmin = null;

    for (const key of adminKeys) {
      const adminData = await redis.get(key);
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (admin.id === id) {
          adminKey = key;
          existingAdmin = admin;
          break;
        }
      }
    }

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Update admin data
    const updatedAdmin = {
      ...existingAdmin,
      username,
      email,
      role,
      permissions: permissions || [],
      isActive: isActive !== undefined ? isActive : existingAdmin.isActive,
      updatedAt: new Date().toISOString(),
      updatedBy: decoded.username
    };

    // Update password if provided
    if (password && password.trim()) {
      updatedAdmin.password = await hashPassword(password);
    }

    // If username changed, delete old key and create new one
    if (existingAdmin.username !== username) {
      await redis.del(adminKey);
      await redis.set(`admin:${username}`, JSON.stringify(updatedAdmin));
    } else {
      await redis.set(adminKey, JSON.stringify(updatedAdmin));
    }

    // Log activity
    const logData = {
      adminId: decoded.id,
      username: decoded.username,
      action: 'update_admin',
      targetAdmin: username,
      timestamp: new Date().toISOString()
    };
    await redis.lPush('admin_activity_logs', JSON.stringify(logData));

    const { password: _, ...adminWithoutPassword } = updatedAdmin;
    return NextResponse.json({ 
      message: 'Admin updated successfully', 
      admin: adminWithoutPassword 
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = params;
    const redis = await getRedisClient();
    
    // Find admin by ID
    const adminKeys = await redis.keys('admin:*');
    let adminKey = null;
    let existingAdmin = null;

    for (const key of adminKeys) {
      const adminData = await redis.get(key);
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (admin.id === id) {
          adminKey = key;
          existingAdmin = admin;
          break;
        }
      }
    }

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Prevent deleting super admin
    if (existingAdmin.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot delete super admin' }, { status: 400 });
    }

    // Delete admin
    await redis.del(adminKey);

    // Log activity
    const logData = {
      adminId: decoded.id,
      username: decoded.username,
      action: 'delete_admin',
      targetAdmin: existingAdmin.username,
      timestamp: new Date().toISOString()
    };
    await redis.lPush('admin_activity_logs', JSON.stringify(logData));

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
