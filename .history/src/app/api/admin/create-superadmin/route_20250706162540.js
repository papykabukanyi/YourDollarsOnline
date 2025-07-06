import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../lib/database';
import bcrypt from 'bcryptjs';

// Force Node.js runtime for jsonwebtoken
export const runtime = 'nodejs';

export async function POST() {
  try {
    console.log('Creating/resetting super admin user...');
    const redis = await getRedisClient();
    
    // Create super admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const superAdmin = {
      id: 'superadmin',
      username: 'superadmin',
      email: 'admin@yourdollarsonline.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      permissions: [
        'manage_products',
        'manage_orders',
        'manage_users',
        'manage_admins',
        'manage_settings',
        'view_analytics',
        'manage_smtp'
      ],
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true
    };

    await redis.set('admin:superadmin', JSON.stringify(superAdmin));
    console.log('Super admin user created/reset successfully');

    return NextResponse.json({
      message: 'Super admin user created/reset successfully',
      username: 'superadmin',
      password: 'admin123',
      role: 'SUPER_ADMIN'
    });

  } catch (error) {
    console.error('Error creating super admin:', error);
    return NextResponse.json(
      { error: 'Failed to create super admin user' },
      { status: 500 }
    );
  }
}
