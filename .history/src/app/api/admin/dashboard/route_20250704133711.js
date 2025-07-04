import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../lib/database';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request) {
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

    const redis = await getRedisClient();
    
    // Get dashboard stats
    const productsCount = await redis.scard('products') || 0;
    const ordersCount = await redis.scard('orders') || 0;
    const adminsCount = await redis.scard('admins') || 0;
    
    // Get recent orders
    const orderIds = await redis.smembers('orders');
    const recentOrders = [];
    
    for (const orderId of orderIds.slice(-5)) {
      const orderData = await redis.get(`order:${orderId}`);
      if (orderData) {
        recentOrders.push(JSON.parse(orderData));
      }
    }

    // Get revenue data (mock data for now)
    const revenueData = {
      today: 1234.56,
      week: 8765.43,
      month: 34567.89,
      year: 123456.78
    };

    return NextResponse.json({
      stats: {
        products: productsCount,
        orders: ordersCount,
        admins: adminsCount,
        revenue: revenueData
      },
      recentOrders,
      user: {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
