import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/database';

export async function GET() {
  try {
    console.log('Testing Redis connection...');
    console.log('REDIS_URL exists:', !!process.env.REDIS_URL);
    console.log('REDIS_URL starts with redis://', process.env.REDIS_URL?.startsWith('redis://'));
    
    const db = await getDatabase();
    
    // Test basic operations
    await db.set('test:connection', 'success');
    const result = await db.get('test:connection');
    await db.del('test:connection');
    
    console.log('Redis connection test successful');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Redis connection successful',
      testResult: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Redis connection test failed:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: {
        name: error.name,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        address: error.address,
        port: error.port
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
