// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Quick diagnostic script to test environment variables
console.log('=== ENVIRONMENT DIAGNOSTIC ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REDIS_URL present:', !!process.env.REDIS_URL);
console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);
console.log('NEXTAUTH_SECRET present:', !!process.env.NEXTAUTH_SECRET);
console.log('NEXTAUTH_URL present:', !!process.env.NEXTAUTH_URL);

console.log('\n=== ALL ENVIRONMENT VARIABLES ===');
const envVars = Object.keys(process.env).filter(key => 
  key.startsWith('REDIS_') || 
  key.startsWith('JWT_') || 
  key.startsWith('NEXTAUTH_') || 
  key.startsWith('SMTP_') || 
  key.startsWith('PAYPAL_') || 
  key.startsWith('ADMIN_') ||
  key.startsWith('RATE_LIMIT_') ||
  key === 'NODE_ENV'
);

envVars.forEach(key => {
  const value = process.env[key];
  console.log(`${key}: ${value ? '[SET]' : '[NOT SET]'}`);
});

console.log('\n=== TESTING REDIS CONNECTION ===');
try {
  const { createClient } = require('redis');
  const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: 5000,
      reconnectOnError: true
    }
  });
  
  client.connect().then(() => {
    console.log('Redis connection: SUCCESS');
    client.disconnect();
  }).catch(err => {
    console.log('Redis connection: FAILED', err.message);
  });
} catch (err) {
  console.log('Redis connection: ERROR', err.message);
}
