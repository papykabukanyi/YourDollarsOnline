import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../lib/database';
import { verifyToken, PERMISSIONS, checkAdminPermission } from '../../../../lib/auth';

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

    if (!checkAdminPermission(decoded, PERMISSIONS.VIEW_ANALYTICS)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const redis = await getRedisClient();

    // Get all orders for calculations
    const orderIds = await redis.sMembers('orders');
    let orders = [];
    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthlyRevenue = 0;
    let ordersByStatus = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    for (const orderId of orderIds) {
      const orderData = await redis.get(`order:${orderId}`);
      if (orderData) {
        const order = JSON.parse(orderData);
        orders.push(order);
        
        const orderDate = new Date(order.createdAt);
        
        // Total revenue
        if (order.status !== 'cancelled') {
          totalRevenue += order.total;
        }
        
        // Today's revenue
        if (orderDate >= startOfToday && order.status !== 'cancelled') {
          todayRevenue += order.total;
        }
        
        // Monthly revenue
        if (orderDate >= startOfMonth && order.status !== 'cancelled') {
          monthlyRevenue += order.total;
        }
        
        // Orders by status
        if (ordersByStatus.hasOwnProperty(order.status)) {
          ordersByStatus[order.status]++;
        }
      }
    }

    // Get product count
    const productIds = await redis.sMembers('products');
    let activeProducts = 0;
    let lowStockProducts = 0;
    
    for (const productId of productIds) {
      const productData = await redis.get(`product:${productId}`);
      if (productData) {
        const product = JSON.parse(productData);
        if (product.isActive) {
          activeProducts++;
        }
        if (product.stock <= 10) {
          lowStockProducts++;
        }
      }
    }

    // Get recent activity logs
    const recentLogs = await redis.lRange('admin_activity_logs', 0, 9);
    const recentActivity = recentLogs.map(log => JSON.parse(log));

    // Top selling products
    const productSales = {};
    for (const order of orders) {
      if (order.status !== 'cancelled') {
        for (const item of order.items) {
          if (productSales[item.id]) {
            productSales[item.id].quantity += item.quantity;
            productSales[item.id].revenue += item.price * item.quantity;
          } else {
            productSales[item.id] = {
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              revenue: item.price * item.quantity
            };
          }
        }
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return NextResponse.json({
      overview: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        todayRevenue: parseFloat(todayRevenue.toFixed(2)),
        monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
        totalOrders: orders.length,
        totalProducts: productIds.length,
        activeProducts,
        lowStockProducts
      },
      ordersByStatus,
      topProducts,
      recentActivity: recentActivity.slice(0, 10),
      permissions: decoded.permissions || [],
      role: decoded.role,
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
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
