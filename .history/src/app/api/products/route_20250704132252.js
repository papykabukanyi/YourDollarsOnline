import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';
import { verifyToken, generateId, sanitizeInput } from '../../../lib/auth';
import { generateSEOData } from '../../../lib/seo';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const redis = await getRedisClient();
    const productIds = await redis.sMembers('products');
    
    let products = [];
    for (const productId of productIds) {
      const productData = await redis.get(`product:${productId}`);
      if (productData) {
        products.push(JSON.parse(productData));
      }
    }

    // Filter by category
    if (category) {
      products = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        pages: Math.ceil(products.length / limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const productData = await request.json();
    
    // Validate required fields
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedData = {
      name: sanitizeInput(productData.name),
      description: sanitizeInput(productData.description),
      price: parseFloat(productData.price),
      category: sanitizeInput(productData.category),
      images: productData.images || [],
      stock: parseInt(productData.stock) || 0,
      tags: productData.tags || []
    };

    const productId = generateId();
    const product = {
      id: productId,
      ...sanitizedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: decoded.username,
      isActive: true,
      views: 0,
      sales: 0,
      seo: generateSEOData({
        name: sanitizedData.name,
        description: sanitizedData.description,
        category: sanitizedData.category,
        images: sanitizedData.images,
        tags: sanitizedData.tags
      })
    };

    const redis = await getRedisClient();
    
    // Save product
    await redis.set(`product:${productId}`, JSON.stringify(product));
    await redis.sAdd('products', productId);

    return NextResponse.json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
