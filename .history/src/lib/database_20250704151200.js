import { createClient } from 'redis';

let client;

export async function getRedisClient() {
  if (!client) {
    try {
      const redisUrl = process.env.REDIS_URL;
      
      console.log('Environment check:', {
        hasRedisUrl: !!redisUrl,
        nodeEnv: process.env.NODE_ENV,
        redisUrlPreview: redisUrl?.substring(0, 20) + '...'
      });
      
      if (!redisUrl) {
        console.error('REDIS_URL not found in environment variables');
        console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('REDIS')));
        throw new Error('REDIS_URL environment variable is not set');
      }

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

export async function getDatabase() {
  try {
    const redis = await getRedisClient();
    return redis;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed. Please check your Redis configuration.');
  }
}

const database = { getRedisClient, getDatabase, initializeDatabase };
export default database;
