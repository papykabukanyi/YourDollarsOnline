import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 1000);
}

// Role-based permission system
export const PERMISSIONS = {
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_ORDERS: 'manage_orders',
  MANAGE_USERS: 'manage_users',
  MANAGE_ADMINS: 'manage_admins',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SMTP: 'manage_smtp'
};

export const ROLES = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    permissions: [
      PERMISSIONS.MANAGE_PRODUCTS,
      PERMISSIONS.MANAGE_ORDERS,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_ADMINS,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_SMTP
    ]
  },
  ADMIN: {
    name: 'Admin',
    permissions: [
      PERMISSIONS.MANAGE_PRODUCTS,
      PERMISSIONS.MANAGE_ORDERS,
      PERMISSIONS.VIEW_ANALYTICS
    ]
  },
  MODERATOR: {
    name: 'Moderator',
    permissions: [
      PERMISSIONS.MANAGE_PRODUCTS,
      PERMISSIONS.VIEW_ANALYTICS
    ]
  }
};

export function hasPermission(userRole, permission) {
  const role = ROLES[userRole];
  return role && role.permissions.includes(permission);
}

export function checkAdminPermission(decoded, permission) {
  if (!decoded || !decoded.role) {
    return false;
  }
  return hasPermission(decoded.role, permission);
}

export default {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateId,
  isValidEmail,
  sanitizeInput
};
