import { createClient } from 'redis';
import { getRedisUrl } from './env.js';

let client;

export async function getRedisClient() {
  if (!client) {
    try {
      // Skip Redis connection during build time
      if (process.env.SKIP_ENV_VALIDATION === 'true') {
        console.log('Skipping Redis connection during build...');
        return null;
      }
      
      const redisUrl = getRedisUrl();
      
      console.log('Redis connection info:', {
        hasRedisUrl: !!redisUrl,
        nodeEnv: process.env.NODE_ENV,
        redisUrlPreview: redisUrl?.substring(0, 20) + '...'
      });

      client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            console.log(`Redis reconnection attempt ${retries}`);
            return Math.min(retries * 1000, 3000); // Increased delays for Railway
          },
          connectTimeout: 60000, // 60 seconds
          lazyConnect: true,
          keepAlive: true,
          family: 4, // Force IPv4 for Railway compatibility
        },
      });

      client.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      client.on('connect', () => {
        console.log('Redis Client Connected Successfully');
      });

      client.on('reconnecting', () => {
        console.log('Redis Client Reconnecting...');
      });

      client.on('ready', () => {
        console.log('Redis Client Ready');
      });

      client.on('end', () => {
        console.log('Redis Client Connection Ended');
      });

      await client.connect();
      
      // Test the connection
      const pingResult = await client.ping();
      console.log('Redis connection test successful:', pingResult);
      
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        address: error.address,
        port: error.port
      });
      client = null;
      throw error;
    }
  }

  return client;
}

export async function getDatabase() {
  try {
    const redis = await getRedisClient();
    return redis;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed. Please check your Redis configuration.');
  }
}

export async function initializeDatabase() {
  const redis = await getRedisClient();
  
  // Initialize categories if they don't exist
  const categoriesExist = await redis.exists('categories');
  if (!categoriesExist) {
    const defaultCategories = [
      {
        id: 'electronics',
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        seo: {
          title: 'Electronics | YourDollarsOnline',
          description: 'Shop the latest electronics and accessories at YourDollarsOnline',
          keywords: 'electronics, gadgets, tech, accessories'
        }
      },
      {
        id: 'clothing',
        name: 'Clothing',
        description: 'Fashion and apparel for all',
        slug: 'clothing',
        seo: {
          title: 'Clothing & Fashion | YourDollarsOnline',
          description: 'Discover trendy clothing and fashion items at YourDollarsOnline',
          keywords: 'clothing, fashion, apparel, style'
        }
      },
      {
        id: 'home',
        name: 'Home & Garden',
        description: 'Home decor and garden essentials',
        slug: 'home-garden',
        seo: {
          title: 'Home & Garden | YourDollarsOnline',
          description: 'Transform your home with our home decor and garden essentials',
          keywords: 'home, garden, decor, furniture'
        }
      }
    ];

    await redis.set('categories', JSON.stringify(defaultCategories));
  }

  // Initialize super admin if doesn't exist
  const superAdminExists = await redis.exists('admin:superadmin');
  if (!superAdminExists) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'admin123', 10);
    
    const superAdmin = {
      id: 'superadmin',
      username: process.env.SUPER_ADMIN_USERNAME || 'superadmin',
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@yourdollarsonline.com',
      password: hashedPassword,
      role: 'super_admin',
      permissions: ['all'],
      createdAt: new Date().toISOString(),
      isActive: true
    };

    await redis.set('admin:superadmin', JSON.stringify(superAdmin));
  }
}

export async function getUserById(userId) {
  try {
    const redis = await getRedisClient();
    const adminKeys = await redis.keys('admin:*');
    
    for (const key of adminKeys) {
      const adminData = await redis.get(key);
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (admin.id === userId) {
          return admin;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

const database = { getRedisClient, getDatabase, initializeDatabase, getUserById };
export default database;
