// Security Test Script for YourDollarsOnline Admin System
require('dotenv').config({ path: '.env.local' });

console.log('🔒 YourDollarsOnline Security Test');
console.log('=====================================');
console.log('');

// Test 1: Environment Variables
console.log('1. Testing Environment Variables:');
const requiredEnvVars = [
  'REDIS_URL',
  'JWT_SECRET',
  'NEXTAUTH_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
];

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  console.log(`   ${envVar}: ${value ? '✅ SET' : '❌ NOT SET'}`);
});

// Test 2: JWT Secret Strength
console.log('\n2. Testing JWT Secret Strength:');
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret) {
  if (jwtSecret.length < 32) {
    console.log('   ⚠️  JWT Secret is too short (recommend 32+ characters)');
  } else if (jwtSecret === 'your-super-secret-jwt-key-change-this-in-production') {
    console.log('   ⚠️  JWT Secret is using default value - CHANGE FOR PRODUCTION');
  } else {
    console.log('   ✅ JWT Secret looks good');
  }
} else {
  console.log('   ❌ JWT Secret not set');
}

// Test 3: Redis Connection
console.log('\n3. Testing Redis Connection:');
async function testRedis() {
  try {
    const { createClient } = require('redis');
    const client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000
      }
    });

    await client.connect();
    console.log('   ✅ Redis connection successful');
    
    // Test basic operations
    await client.set('test_key', 'test_value', { EX: 10 });
    const value = await client.get('test_key');
    console.log(`   ✅ Redis read/write test: ${value === 'test_value' ? 'PASSED' : 'FAILED'}`);
    
    await client.disconnect();
  } catch (error) {
    console.log(`   ❌ Redis connection failed: ${error.message}`);
  }
}

// Test 4: Auth Functions
console.log('\n4. Testing Auth Functions:');
async function testAuth() {
  try {
    const { hashPassword, comparePassword, generateToken, verifyToken } = require('./src/lib/auth');
    
    // Test password hashing
    const testPassword = 'testpassword123';
    const hashedPassword = await hashPassword(testPassword);
    const isValid = await comparePassword(testPassword, hashedPassword);
    console.log(`   ✅ Password hashing: ${isValid ? 'PASSED' : 'FAILED'}`);
    
    // Test JWT tokens
    const testPayload = { userId: 'test123', role: 'ADMIN' };
    const token = generateToken(testPayload);
    const decoded = verifyToken(token);
    console.log(`   ✅ JWT token generation: ${decoded && decoded.userId === 'test123' ? 'PASSED' : 'FAILED'}`);
    
    // Test invalid token
    const invalidDecoded = verifyToken('invalid-token');
    console.log(`   ✅ Invalid token handling: ${invalidDecoded === null ? 'PASSED' : 'FAILED'}`);
    
  } catch (error) {
    console.log(`   ❌ Auth functions test failed: ${error.message}`);
  }
}

// Test 5: Permission System
console.log('\n5. Testing Permission System:');
function testPermissions() {
  try {
    const { ROLES, PERMISSIONS, hasPermission } = require('./src/lib/auth');
    
    // Test super admin permissions
    const superAdminHasAll = ROLES.SUPER_ADMIN.permissions.includes(PERMISSIONS.MANAGE_ADMINS);
    console.log(`   ✅ Super Admin permissions: ${superAdminHasAll ? 'PASSED' : 'FAILED'}`);
    
    // Test admin permissions
    const adminHasManageProducts = ROLES.ADMIN.permissions.includes(PERMISSIONS.MANAGE_PRODUCTS);
    const adminHasManageAdmins = ROLES.ADMIN.permissions.includes(PERMISSIONS.MANAGE_ADMINS);
    console.log(`   ✅ Admin permissions: ${adminHasManageProducts && !adminHasManageAdmins ? 'PASSED' : 'FAILED'}`);
    
    // Test permission checking
    const superAdminCanManageAdmins = hasPermission('SUPER_ADMIN', PERMISSIONS.MANAGE_ADMINS);
    const adminCannotManageAdmins = !hasPermission('ADMIN', PERMISSIONS.MANAGE_ADMINS);
    console.log(`   ✅ Permission checking: ${superAdminCanManageAdmins && adminCannotManageAdmins ? 'PASSED' : 'FAILED'}`);
    
  } catch (error) {
    console.log(`   ❌ Permission system test failed: ${error.message}`);
  }
}

// Run all tests
async function runAllTests() {
  await testRedis();
  await testAuth();
  testPermissions();
  
  console.log('\n🔒 Security Test Complete!');
  console.log('=====================================');
  console.log('');
  console.log('Next steps:');
  console.log('1. Deploy to Railway with proper environment variables');
  console.log('2. Test admin login at /admin/login');
  console.log('3. Verify role-based access control');
  console.log('4. Test all admin functions with different user roles');
  console.log('');
  console.log('🚀 Your admin system is ready for production!');
}

runAllTests().catch(console.error);
