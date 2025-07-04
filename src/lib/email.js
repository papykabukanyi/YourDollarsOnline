import nodemailer from 'nodemailer';
import { getRedisClient } from './database';

// Default SMTP settings (can be overridden by super admin)
const defaultSmtpSettings = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};

export async function getSmtpSettings() {
  try {
    const redis = await getRedisClient();
    const settings = await redis.get('smtp_settings');
    return settings ? JSON.parse(settings) : defaultSmtpSettings;
  } catch (error) {
    console.error('Error getting SMTP settings:', error);
    return defaultSmtpSettings;
  }
}

export async function saveSmtpSettings(settings) {
  try {
    const redis = await getRedisClient();
    await redis.set('smtp_settings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving SMTP settings:', error);
    return false;
  }
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    const smtpSettings = await getSmtpSettings();
    
    // Create transporter
    const transporter = nodemailer.createTransporter(smtpSettings);
    
    // Email options
    const mailOptions = {
      from: smtpSettings.auth.user,
      to,
      subject,
      html,
      text
    };
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendOrderConfirmationEmail(orderData) {
  const { customerEmail, customerName, orderNumber, items, total, shippingAddress } = orderData;
  
  const subject = `Order Confirmation - ${orderNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .order-details { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; color: #059669; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">YourDollarsOnline</div>
          <h2>Order Confirmation</h2>
        </div>
        
        <p>Dear ${customerName},</p>
        <p>Thank you for your order! We've received your order and are processing it.</p>
        
        <div class="order-details">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          
          <h4>Items Ordered:</h4>
          ${items.map(item => `
            <div class="item">
              <strong>${item.name}</strong><br>
              Quantity: ${item.quantity} × $${item.price} = $${(item.quantity * item.price).toFixed(2)}
            </div>
          `).join('')}
          
          <div class="total">
            <p>Total: $${total}</p>
          </div>
          
          <h4>Shipping Address:</h4>
          <p>
            ${shippingAddress.street}<br>
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
            ${shippingAddress.country}
          </p>
        </div>
        
        <p>We'll send you another email with tracking information once your order ships.</p>
        
        <div class="footer">
          <p>Thank you for shopping with YourDollarsOnline!</p>
          <p>If you have any questions, please contact our customer service.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Order Confirmation - ${orderNumber}
    
    Dear ${customerName},
    
    Thank you for your order! We've received your order and are processing it.
    
    Order Number: ${orderNumber}
    Order Date: ${new Date().toLocaleDateString()}
    Total: $${total}
    
    We'll send you tracking information once your order ships.
    
    Thank you for shopping with YourDollarsOnline!
  `;
  
  return await sendEmail({
    to: customerEmail,
    subject,
    html,
    text
  });
}

export async function sendShippingNotificationEmail(orderData, trackingNumber) {
  const { customerEmail, customerName, orderNumber } = orderData;
  
  const subject = `Your Order Has Shipped - ${orderNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; }
        .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .tracking-box { background-color: #ecfdf5; border: 2px solid #059669; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #059669; letter-spacing: 2px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">YourDollarsOnline</div>
          <h2>🚚 Your Order Has Shipped!</h2>
        </div>
        
        <p>Dear ${customerName},</p>
        <p>Great news! Your order <strong>${orderNumber}</strong> has been shipped and is on its way to you.</p>
        
        <div class="tracking-box">
          <h3>Tracking Number</h3>
          <div class="tracking-number">${trackingNumber}</div>
          <p>You can track your package using this tracking number with the shipping carrier.</p>
        </div>
        
        <p>Your order should arrive within 3-7 business days depending on your location.</p>
        
        <div class="footer">
          <p>Thank you for shopping with YourDollarsOnline!</p>
          <p>If you have any questions about your shipment, please contact our customer service.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Your Order Has Shipped - ${orderNumber}
    
    Dear ${customerName},
    
    Your order ${orderNumber} has been shipped!
    
    Tracking Number: ${trackingNumber}
    
    Your order should arrive within 3-7 business days.
    
    Thank you for shopping with YourDollarsOnline!
  `;
  
  return await sendEmail({
    to: customerEmail,
    subject,
    html,
    text
  });
}
