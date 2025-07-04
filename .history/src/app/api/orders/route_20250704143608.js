import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../lib/database';
import { verifyToken, generateId, PERMISSIONS, checkAdminPermission } from '../../../lib/auth';
import { sendOrderConfirmationEmail, sendShippingNotificationEmail } from '../../../lib/email';

// GET - Get all orders
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const redis = await getRedisClient();
    const orderIds = await redis.sMembers('orders');
    
    let orders = [];
    for (const orderId of orderIds) {
      const orderData = await redis.get(`order:${orderId}`);
      if (orderData) {
        const order = JSON.parse(orderData);
        if (!status || order.status === status) {
          orders.push(order);
        }
      }
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: orders.length,
        totalPages: Math.ceil(orders.length / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    const orderData = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      items,
      paymentMethod,
      paymentDetails
    } = orderData;

    if (!customerName || !customerEmail || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const redis = await getRedisClient();
    const orderId = generateId();
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

    // Calculate total
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    const shipping = 9.99; // Default shipping cost
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const order = {
      id: orderId,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      paymentDetails,
      trackingNumber: null,
      shippedAt: null,
      deliveredAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await redis.set(`order:${orderId}`, JSON.stringify(order));
    await redis.sAdd('orders', orderId);

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        customerEmail,
        customerName,
        orderNumber,
        items,
        total,
        shippingAddress
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PUT - Update order status
export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !checkAdminPermission(decoded, PERMISSIONS.MANAGE_ORDERS)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { orderId, status, trackingNumber } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    const redis = await getRedisClient();
    const orderData = await redis.get(`order:${orderId}`);

    if (!orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = JSON.parse(orderData);

    // Update order status
    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.updatedBy = decoded.username;

    // Handle shipping status
    if (status === 'shipped') {
      if (!trackingNumber) {
        return NextResponse.json({ 
          error: 'Tracking number is required when marking order as shipped' 
        }, { status: 400 });
      }
      
      order.trackingNumber = trackingNumber;
      order.shippedAt = new Date().toISOString();

      // Send shipping notification email
      try {
        await sendShippingNotificationEmail(order, trackingNumber);
      } catch (emailError) {
        console.error('Failed to send shipping notification email:', emailError);
        // Don't fail the status update if email fails
      }
    }

    if (status === 'delivered') {
      order.deliveredAt = new Date().toISOString();
    }

    await redis.set(`order:${orderId}`, JSON.stringify(order));

    // Log activity
    const logData = {
      adminId: decoded.id,
      username: decoded.username,
      action: 'update_order_status',
      orderId,
      orderNumber: order.orderNumber,
      newStatus: status,
      trackingNumber: trackingNumber || null,
      timestamp: new Date().toISOString()
    };
    await redis.lPush('admin_activity_logs', JSON.stringify(logData));

    return NextResponse.json({
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
