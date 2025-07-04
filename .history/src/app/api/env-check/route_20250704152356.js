import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables (don't expose sensitive values)
    const envCheck = {
      hasRedisUrl: !!process.env.REDIS_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      hasSuperAdminUsername: !!process.env.SUPER_ADMIN_USERNAME,
      hasSuperAdminPassword: !!process.env.SUPER_ADMIN_PASSWORD,
      hasSuperAdminEmail: !!process.env.SUPER_ADMIN_EMAIL,
      redisUrlFormat: process.env.REDIS_URL ? 'redis://' + process.env.REDIS_URL.substring(8, 20) + '...' : 'Not set',
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version
    };

    // Count total environment variables (exclude sensitive ones)
    const envVarCount = Object.keys(process.env).length;
    const requiredVars = [
      'REDIS_URL',
      'JWT_SECRET', 
      'NODE_ENV',
      'SUPER_ADMIN_USERNAME',
      'SUPER_ADMIN_PASSWORD',
      'SUPER_ADMIN_EMAIL'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    return NextResponse.json({
      status: missingVars.length === 0 ? 'ready' : 'missing_variables',
      environmentCheck: envCheck,
      totalEnvVars: envVarCount,
      requiredVars,
      missingVars,
      allRequiredVarsPresent: missingVars.length === 0
    });

  } catch (error) {
    console.error('Environment check error:', error);
    return NextResponse.json({ 
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
