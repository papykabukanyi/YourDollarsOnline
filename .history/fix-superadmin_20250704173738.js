// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('redis');

async function fixSuperAdminRole() {
  console.log('=== FIXING SUPER ADMIN ROLE ===');
  
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

    // Get current super admin
    const adminData = await client.get('admin:superadmin');
    if (adminData) {
      const admin = JSON.parse(adminData);
      console.log('Current admin role:', admin.role);
      
      // Update role and permissions
      admin.role = 'SUPER_ADMIN';
      admin.permissions = [
        'manage_products',
        'manage_orders',
        'manage_users',
        'manage_admins',
        'manage_settings',
        'view_analytics',
        'manage_smtp'
      ];
      
      await client.set('admin:superadmin', JSON.stringify(admin));
      console.log('✓ Super admin role updated to SUPER_ADMIN');
      console.log('✓ Permissions updated');
    }

    // Also fix legacy admin if exists
    const legacyAdminData = await client.get('admin:admin');
    if (legacyAdminData) {
      const legacyAdmin = JSON.parse(legacyAdminData);
      console.log('Current legacy admin role:', legacyAdmin.role);
      
      legacyAdmin.role = 'SUPER_ADMIN';
      legacyAdmin.permissions = [
        'manage_products',
        'manage_orders',
        'manage_users',
        'manage_admins',
        'manage_settings',
        'view_analytics',
        'manage_smtp'
      ];
      
      await client.set('admin:admin', JSON.stringify(legacyAdmin));
      console.log('✓ Legacy admin role updated to SUPER_ADMIN');
    }

    await client.disconnect();
    console.log('✓ Redis disconnected');
    
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

fixSuperAdminRole();
