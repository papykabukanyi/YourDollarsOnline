import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';

export async function GET() {
  try {
    const redis = await getRedisClient();
    const productIds = await redis.smembers('products');
    
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

    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
