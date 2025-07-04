import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../lib/database';
import { verifyToken, hashPassword, generateId, PERMISSIONS, ROLES, checkAdminPermission } from '../../../../lib/auth';

// GET - List all admins (Super Admin only)
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !checkAdminPermission(decoded, PERMISSIONS.MANAGE_ADMINS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const redis = await getRedisClient();
    const adminKeys = await redis.keys('admin:*');
    const admins = [];

    for (const key of adminKeys) {
      const adminData = await redis.get(key);
      if (adminData) {
        const admin = JSON.parse(adminData);
        // Remove password from response
        delete admin.password;
        admins.push(admin);
      }
    }

    return NextResponse.json({ admins });

  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

// POST - Create new admin (Super Admin only)
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !checkAdminPermission(decoded, PERMISSIONS.MANAGE_ADMINS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { username, email, password, role, customPermissions } = await request.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const redis = await getRedisClient();
    
    // Check if admin already exists
    const existingAdmin = await redis.get(`admin:${username}`);
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    // Validate role
    if (!ROLES[role]) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const adminId = generateId();

    // Determine permissions
    let permissions = ROLES[role].permissions;
    if (customPermissions && Array.isArray(customPermissions)) {
      // Super admin can assign custom permissions
      permissions = customPermissions.filter(perm => Object.values(PERMISSIONS).includes(perm));
    }

    const newAdmin = {
      id: adminId,
      username,
      email,
      password: hashedPassword,
      role,
      permissions,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: decoded.username,
      lastLogin: null
    };

    await redis.set(`admin:${username}`, JSON.stringify(newAdmin));

    // Log activity
    const logData = {
      adminId: decoded.id,
      username: decoded.username,
      action: 'create_admin',
      targetAdmin: username,
      timestamp: new Date().toISOString()
    };
    await redis.lPush('admin_activity_logs', JSON.stringify(logData));

    // Remove password from response
    delete newAdmin.password;

    return NextResponse.json({
      message: 'Admin created successfully',
      admin: newAdmin
    });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

// PUT - Update admin permissions (Super Admin only)
export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !checkAdminPermission(decoded, PERMISSIONS.MANAGE_ADMINS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { username, permissions, isActive, role } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const redis = await getRedisClient();
    const adminData = await redis.get(`admin:${username}`);

    if (!adminData) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const admin = JSON.parse(adminData);

    // Prevent super admin from modifying themselves
    if (admin.username === decoded.username) {
      return NextResponse.json({ error: 'Cannot modify your own permissions' }, { status: 400 });
    }

    // Update fields
    if (permissions && Array.isArray(permissions)) {
      admin.permissions = permissions.filter(perm => Object.values(PERMISSIONS).includes(perm));
    }
    if (typeof isActive === 'boolean') {
      admin.isActive = isActive;
    }
    if (role && ROLES[role]) {
      admin.role = role;
      // Update permissions based on new role if not custom
      if (!permissions) {
        admin.permissions = ROLES[role].permissions;
      }
    }

    admin.updatedAt = new Date().toISOString();
    admin.updatedBy = decoded.username;

    await redis.set(`admin:${username}`, JSON.stringify(admin));

    // Log activity
    const logData = {
      adminId: decoded.id,
      username: decoded.username,
      action: 'update_admin',
      targetAdmin: username,
      changes: { permissions, isActive, role },
      timestamp: new Date().toISOString()
    };
    await redis.lPush('admin_activity_logs', JSON.stringify(logData));

    // Remove password from response
    delete admin.password;

    return NextResponse.json({
      message: 'Admin updated successfully',
      admin
    });

  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
  }
}
