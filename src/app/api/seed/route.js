import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';
import { generateId } from '../../../lib/auth';
import { generateSEOData } from '../../../lib/seo';

export async function POST() {
  try {
    const redis = await getRedisClient();
    
    // Sample products to seed the database
    const sampleProducts = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "Premium noise-canceling wireless headphones with 30-hour battery life and superior sound quality.",
        price: 199.99,
        category: "Electronics",
        stock: 50,
        tags: ["wireless", "bluetooth", "headphones", "audio", "music"]
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone connectivity.",
        price: 299.99,
        category: "Electronics", 
        stock: 25,
        tags: ["fitness", "watch", "smart", "health", "tracking"]
      },
      {
        name: "Premium Cotton T-Shirt",
        description: "Comfortable 100% organic cotton t-shirt available in multiple colors and sizes.",
        price: 29.99,
        category: "Clothing",
        stock: 100,
        tags: ["clothing", "cotton", "t-shirt", "casual", "organic"]
      },
      {
        name: "Ergonomic Office Chair",
        description: "Professional ergonomic chair with lumbar support and adjustable height for all-day comfort.",
        price: 349.99,
        category: "Home & Garden",
        stock: 15,
        tags: ["office", "chair", "ergonomic", "furniture", "comfort"]
      },
      {
        name: "Portable Bluetooth Speaker",
        description: "Waterproof portable speaker with 12-hour battery life and crystal clear sound.",
        price: 89.99,
        category: "Electronics",
        stock: 40,
        tags: ["speaker", "bluetooth", "portable", "waterproof", "music"]
      },
      {
        name: "Yoga Mat Premium",
        description: "Non-slip yoga mat made from eco-friendly materials, perfect for all types of yoga practice.",
        price: 49.99,
        category: "Sports & Outdoors",
        stock: 60,
        tags: ["yoga", "mat", "fitness", "exercise", "eco-friendly"]
      }
    ];

    const createdProducts = [];

    for (const productData of sampleProducts) {
      const productId = generateId();
      const product = {
        id: productId,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "system",
        isActive: true,
        views: Math.floor(Math.random() * 500),
        sales: Math.floor(Math.random() * 50),
        seo: generateSEOData(productData)
      };

      await redis.set(`product:${productId}`, JSON.stringify(product));
      await redis.sadd('products', productId);
      createdProducts.push(product);
    }

    return NextResponse.json({
      message: `Successfully seeded ${createdProducts.length} products`,
      products: createdProducts
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed products' },
      { status: 500 }
    );
  }
}
