import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';

export async function GET() {
  try {
    const redis = await getRedisClient();
    console.log('Redis connected successfully');
    
    // Check if products set exists
    const productsExist = await redis.exists('products');
    console.log('Products set exists:', productsExist);
    
    const productIds = await redis.sMembers('products');
    console.log('Product IDs found:', productIds);
    
    // Get all unique categories from products
    const categorySet = new Set();
    
    for (const productId of productIds) {
      const productData = await redis.get(`product:${productId}`);
      if (productData) {
        const product = JSON.parse(productData);
        if (product.category) {
          categorySet.add(product.category);
        }
      }
    }

    // Convert to array and sort alphabetically
    const categories = Array.from(categorySet).sort().map(category => ({
      name: category,
      slug: category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
    }));

    console.log('Categories found:', categories);

    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}
