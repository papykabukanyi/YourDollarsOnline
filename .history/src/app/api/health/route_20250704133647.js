import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';

export async function GET() {
  try {
    const redis = await getRedisClient();
    await redis.ping();
    
    const productCount = await redis.sCard('products');
    const adminExists = await redis.exists('admin:admin');
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      productCount,
      adminExists: adminExists === 1,
      version: '1.0.0'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
