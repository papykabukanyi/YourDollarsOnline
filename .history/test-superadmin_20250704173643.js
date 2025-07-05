// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('redis');
const bcrypt = require('bcryptjs');

async function testSuperAdminLogin() {
  console.log('=== TESTING SUPER ADMIN LOGIN ===');
  
  try {
    // Connect to Redis
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        reconnectOnError: true
      }
    });
    
    await client.connect();
    console.log('✓ Redis connected');

    // Check if super admin exists
    const adminData = await client.get('admin:superadmin');
    
    if (!adminData) {
      console.log('✗ Super admin user not found, creating...');
      
      // Create super admin
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

      await client.set('admin:superadmin', JSON.stringify(superAdmin));
      console.log('✓ Super admin user created');
      
      // Verify creation
      const newAdminData = await client.get('admin:superadmin');
      const newAdmin = JSON.parse(newAdminData);
      console.log('✓ Super admin verified:', {
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        isActive: newAdmin.isActive
      });
      
    } else {
      console.log('✓ Super admin user found');
      const admin = JSON.parse(adminData);
      console.log('Admin details:', {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        permissions: admin.permissions
      });
      
      // Test password
      const isValidPassword = await bcrypt.compare('admin123', admin.password);
      console.log('✓ Password test:', isValidPassword ? 'VALID' : 'INVALID');
    }

    // Check for legacy admin user
    const legacyAdminData = await client.get('admin:admin');
    if (legacyAdminData) {
      console.log('! Legacy admin user found');
      const legacyAdmin = JSON.parse(legacyAdminData);
      console.log('Legacy admin details:', {
        username: legacyAdmin.username,
        email: legacyAdmin.email,
        role: legacyAdmin.role,
        isActive: legacyAdmin.isActive
      });
    }

    await client.disconnect();
    console.log('✓ Redis disconnected');
    
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

testSuperAdminLogin();
