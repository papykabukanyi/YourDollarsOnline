// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('redis');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testLoginFlow() {
  console.log('=== TESTING LOGIN FLOW ===');
  
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

    // Simulate login request
    const username = 'superadmin';
    const password = 'admin123';
    
    console.log('Attempting login with:', { username, password });
    
    // Get admin data
    const adminData = await client.get(`admin:${username}`);
    
    if (!adminData) {
      console.log('✗ Admin not found');
      return;
    }
    
    const admin = JSON.parse(adminData);
    console.log('✓ Admin found:', admin.username);
    
    // Check if active
    if (!admin.isActive) {
      console.log('✗ Account is deactivated');
      return;
    }
    
    console.log('✓ Account is active');
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      console.log('✗ Invalid password');
      return;
    }
    
    console.log('✓ Password is valid');
    
    // Generate token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    const token = jwt.sign({
      userId: admin.id,
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    }, JWT_SECRET, { expiresIn: '24h' });
    
    console.log('✓ Token generated');
    
    // Update last login
    admin.lastLogin = new Date().toISOString();
    await client.set(`admin:${username}`, JSON.stringify(admin));
    
    console.log('✓ Last login updated');
    
    // Return success response
    const response = {
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions || [],
        lastLogin: admin.lastLogin
      }
    };
    
    console.log('✓ LOGIN SUCCESSFUL');
    console.log('User data:', response.user);
    
    await client.disconnect();
    console.log('✓ Redis disconnected');
    
  } catch (error) {
    console.error('✗ Login error:', error.message);
  }
}

testLoginFlow();
