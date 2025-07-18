/**
 * Environment Configuration Utility
 * Handles environment variable loading with fallbacks and validation
 */

// Simple build-time detection
const IS_BUILD_TIME = typeof window === 'undefined' && process.env.NODE_ENV === 'production';

const requiredEnvVars = [
  'REDIS_URL',
  'JWT_SECRET', 
  'NEXTAUTH_SECRET',
];

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key, defaultValue = null) {
  // During build time, return default values to prevent errors
  if (IS_BUILD_TIME && !process.env[key]) {
    console.warn(`Warning: ${key} not available during build, using default`);
    return defaultValue;
  }
  
  return process.env[key] || defaultValue;
}

/**
 * Validate required environment variables
 */
export function validateEnvironment() {
  // Skip validation during build
  if (IS_BUILD_TIME) {
    console.warn('Skipping environment validation during build');
    return { missing: [], available: requiredEnvVars };
  }

  const missing = [];
  const available = [];
  
  for (const key of requiredEnvVars) {
    const value = getEnvVar(key);
    if (!value) {
      missing.push(key);
    } else {
      available.push(key);
    }
  }
  
  const envReport = {
    missing,
    available,
    nodeEnv: process.env.NODE_ENV || 'development',
  };
  
  console.log('Environment validation report:', envReport);
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return envReport;
}

/**
 * Get Redis URL with validation
 */
export function getRedisUrl() {
  const redisUrl = getEnvVar('REDIS_URL');
  
  if (!redisUrl) {
    // Don't throw during build
    if (IS_BUILD_TIME || process.env.SKIP_ENV_VALIDATION === 'true') {
      console.warn('Warning: REDIS_URL not available during build');
      return null;
    }
    
    console.error('REDIS_URL environment variable is not set');
    console.error('Available Redis-related env vars:', 
      Object.keys(process.env).filter(key => key.toLowerCase().includes('redis'))
    );
    throw new Error('REDIS_URL environment variable is not set');
  }
  
  return redisUrl;
}

/**
 * Get all environment configuration
 */
export function getEnvConfig() {
  return {
    redis: {
      url: getEnvVar('REDIS_URL'),
    },
    auth: {
      jwtSecret: getEnvVar('JWT_SECRET'),
      nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
      nextAuthUrl: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
    },
    smtp: {
      host: getEnvVar('SMTP_HOST'),
      port: parseInt(getEnvVar('SMTP_PORT', '587')),
      user: getEnvVar('SMTP_USER'),
      pass: getEnvVar('SMTP_PASS'),
    },
    paypal: {
      clientId: getEnvVar('PAYPAL_CLIENT_ID'),
      clientSecret: getEnvVar('PAYPAL_CLIENT_SECRET'),
      mode: getEnvVar('PAYPAL_MODE', 'sandbox'),
    },
    admin: {
      email: getEnvVar('ADMIN_EMAIL'),
      password: getEnvVar('ADMIN_PASSWORD'),
      superAdminUsername: getEnvVar('SUPER_ADMIN_USERNAME', 'superadmin'),
      superAdminPassword: getEnvVar('SUPER_ADMIN_PASSWORD'),
      superAdminEmail: getEnvVar('SUPER_ADMIN_EMAIL'),
    },
    rateLimit: {
      max: parseInt(getEnvVar('RATE_LIMIT_MAX', '100')),
      window: parseInt(getEnvVar('RATE_LIMIT_WINDOW', '15')),
    },
    app: {
      nodeEnv: getEnvVar('NODE_ENV', 'development'),
      siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
      siteName: getEnvVar('NEXT_PUBLIC_SITE_NAME', 'YourDollarsOnline'),
    },
  };
}
