import { createClient } from 'redis';

let client;

export async function getRedisClient() {
  if (!client) {
    try {
      client = createClient({
        url: process.env.REDIS_URL,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        },
      });

      client.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      client.on('connect', () => {
        console.log('Redis Client Connected');
      });

      await client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  return client;
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

export default { getRedisClient, initializeDatabase };
