import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      }, { status: 400 });
    }

    const redis = await getRedisClient();
    const productIds = await redis.smembers('products');
    
    let products = [];
    for (const productId of productIds) {
      const productData = await redis.get(`product:${productId}`);
      if (productData) {
        products.push(JSON.parse(productData));
      }
    }

    // Perform search
    const searchLower = query.toLowerCase();
    const searchResults = products.filter(product => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    });

    // Sort by relevance (name matches first, then description, then category)
    searchResults.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(searchLower);
      const bNameMatch = b.name.toLowerCase().includes(searchLower);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      // If both match name or neither matches name, sort by creation date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return NextResponse.json({
      success: true,
      products: searchResults.slice(0, 10), // Limit to 10 results for dropdown
      total: searchResults.length,
      query
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
