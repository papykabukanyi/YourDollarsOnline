import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import { getDatabase } from '../../../../lib/database';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    const db = await getDatabase();
    
    // Calculate date range
    const now = new Date();
    const daysBack = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Get all orders
    const orderKeys = await db.keys('order:*');
    const orders = [];
    
    for (const key of orderKeys) {
      const order = await db.hgetall(key);
      if (order && order.id) {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= startDate) {
          orders.push({
            ...order,
            total: parseFloat(order.total) || 0,
            createdAt: orderDate,
            items: order.items ? JSON.parse(order.items) : []
          });
        }
      }
    }

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const prevOrders = [];
    
    for (const key of orderKeys) {
      const order = await db.hgetall(key);
      if (order && order.id) {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= prevStartDate && orderDate < startDate) {
          prevOrders.push({
            ...order,
            total: parseFloat(order.total) || 0,
            createdAt: orderDate,
            items: order.items ? JSON.parse(order.items) : []
          });
        }
      }
    }

    // Calculate metrics
    const revenue = {
      total: orders.reduce((sum, order) => sum + order.total, 0),
      change: calculateChange(
        orders.reduce((sum, order) => sum + order.total, 0),
        prevOrders.reduce((sum, order) => sum + order.total, 0)
      )
    };

    const ordersData = {
      total: orders.length,
      change: calculateChange(orders.length, prevOrders.length)
    };

    const uniqueCustomers = new Set(orders.map(order => order.customerEmail));
    const prevUniqueCustomers = new Set(prevOrders.map(order => order.customerEmail));
    
    const customers = {
      new: uniqueCustomers.size,
      change: calculateChange(uniqueCustomers.size, prevUniqueCustomers.size)
    };

    const averageOrder = {
      value: orders.length > 0 ? revenue.total / orders.length : 0,
      change: calculateChange(
        orders.length > 0 ? revenue.total / orders.length : 0,
        prevOrders.length > 0 ? prevOrders.reduce((sum, order) => sum + order.total, 0) / prevOrders.length : 0
      )
    };

    // Top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            id: item.id,
            name: item.name,
            sales: 0,
            revenue: 0
          };
        }
        productSales[item.id].sales += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Order status breakdown
    const statusCounts = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const orderStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: (count / orders.length) * 100
    }));

    // Recent activity
    const recentActivity = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(order => ({
        description: `Order #${order.id.substring(0, 8)} - ${order.customerName}`,
        timestamp: new Date(order.createdAt).toLocaleString()
      }));

    return NextResponse.json({
      revenue,
      orders: ordersData,
      customers,
      averageOrder,
      topProducts,
      orderStatus,
      recentActivity
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics data' 
    }, { status: 500 });
  }
}

function calculateChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
