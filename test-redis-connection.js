// Redis Connection Test Script
// Run this with: node test-redis-connection.js

const { createClient } = require('redis');
require('dotenv').config({ path: '.env.local' });

async function testRedisConnection() {
  console.log('Testing Redis connection...');
  console.log('REDIS_URL:', process.env.REDIS_URL ? 'Set' : 'Not set');
  
  if (!process.env.REDIS_URL) {
    console.error('REDIS_URL environment variable is not set');
    return;
  }

  let client;
  
  try {
    client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          console.log(`Reconnection attempt ${retries}`);
          return Math.min(retries * 50, 500);
        },
        connectTimeout: 60000,
      },
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      console.log('✅ Redis Client Connected');
    });

    client.on('ready', () => {
      console.log('✅ Redis Client Ready');
    });

    await client.connect();
    
    // Test ping
    const pingResult = await client.ping();
    console.log('✅ Ping result:', pingResult);
    
    // Test set/get
    await client.set('test:key', 'test value');
    const getValue = await client.get('test:key');
    console.log('✅ Set/Get test:', getValue);
    
    // Clean up
    await client.del('test:key');
    console.log('✅ Cleanup completed');
    
    console.log('🎉 Redis connection test successful!');
    
  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    });
  } finally {
    if (client) {
      await client.disconnect();
      console.log('✅ Redis client disconnected');
    }
  }
}

testRedisConnection();
