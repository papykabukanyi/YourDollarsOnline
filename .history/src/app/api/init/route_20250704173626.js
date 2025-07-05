import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log('Initializing database...');
    const redis = await getRedisClient();
    
    // Test Redis connection
    await redis.ping();
    console.log('Redis connection successful');

    // Initialize admin user if doesn't exist
    const adminExists = await redis.exists('admin:superadmin');
    if (!adminExists) {
      console.log('Creating super admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = {
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
        isActive: true
      };

      await redis.set('admin:superadmin', JSON.stringify(admin));
      console.log('Super admin user created successfully');
    } else {
      console.log('Super admin user already exists');
    }

    // Also check for legacy admin user and update if needed
    const legacyAdminExists = await redis.exists('admin:admin');
    if (legacyAdminExists) {
      console.log('Updating legacy admin user...');
      const legacyAdmin = await redis.get('admin:admin');
      const adminData = JSON.parse(legacyAdmin);
      
      // Update to new format
      adminData.role = 'SUPER_ADMIN';
      adminData.permissions = [
        'manage_products',
        'manage_orders',
        'manage_users',
        'manage_admins',
        'manage_settings',
        'view_analytics',
        'manage_smtp'
      ];
      
      await redis.set('admin:admin', JSON.stringify(adminData));
      console.log('Legacy admin user updated');
    }

    // Initialize products set if it doesn't exist
    const productsExist = await redis.exists('products');
    if (!productsExist) {
      console.log('Creating products set...');
      await redis.sAdd('products', 'dummy'); // Add a dummy member
      await redis.sRem('products', 'dummy'); // Remove it to create an empty set
      console.log('Products set created');
    } else {
      console.log('Products set already exists');
    }

    return NextResponse.json({
      message: 'Database initialized successfully',
      admin: {
        username: 'admin',
        password: 'admin123'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
