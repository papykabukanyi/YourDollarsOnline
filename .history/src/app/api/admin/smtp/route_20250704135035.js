import { NextResponse } from 'next/server';
import { verifyToken, PERMISSIONS, checkAdminPermission } from '../../../../lib/auth';
import { getSmtpSettings, saveSmtpSettings, sendEmail } from '../../../../lib/email';

// GET - Get SMTP settings (Super Admin only)
export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !checkAdminPermission(decoded, PERMISSIONS.MANAGE_SMTP)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const settings = await getSmtpSettings();
    
    // Hide password in response
    const safeSettings = {
      ...settings,
      auth: {
        ...settings.auth,
        pass: settings.auth.pass ? '********' : ''
      }
    };

    return NextResponse.json({ settings: safeSettings });

  } catch (error) {
    console.error('Error fetching SMTP settings:', error);
    return NextResponse.json({ error: 'Failed to fetch SMTP settings' }, { status: 500 });
  }
}

// POST - Update SMTP settings (Super Admin only)
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !checkAdminPermission(decoded, PERMISSIONS.MANAGE_SMTP)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { host, port, secure, user, pass } = await request.json();

    if (!host || !port || !user || !pass) {
      return NextResponse.json({ error: 'All SMTP fields are required' }, { status: 400 });
    }

    const newSettings = {
      host,
      port: parseInt(port),
      secure: secure === true,
      auth: {
        user,
        pass
      }
    };

    const saved = await saveSmtpSettings(newSettings);

    if (!saved) {
      return NextResponse.json({ error: 'Failed to save SMTP settings' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'SMTP settings updated successfully',
      settings: {
        ...newSettings,
        auth: {
          ...newSettings.auth,
          pass: '********'
        }
      }
    });

  } catch (error) {
    console.error('Error updating SMTP settings:', error);
    return NextResponse.json({ error: 'Failed to update SMTP settings' }, { status: 500 });
  }
}

// PUT - Test SMTP settings
export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || !checkAdminPermission(decoded, PERMISSIONS.MANAGE_SMTP)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json({ error: 'Test email address is required' }, { status: 400 });
    }

    const result = await sendEmail({
      to: testEmail,
      subject: 'SMTP Test Email - YourDollarsOnline',
      html: `
        <h2>SMTP Configuration Test</h2>
        <p>This is a test email to verify your SMTP settings are working correctly.</p>
        <p>If you received this email, your SMTP configuration is successful!</p>
        <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><em>YourDollarsOnline Admin Panel</em></p>
      `,
      text: `
        SMTP Configuration Test
        
        This is a test email to verify your SMTP settings are working correctly.
        If you received this email, your SMTP configuration is successful!
        
        Test Time: ${new Date().toLocaleString()}
        
        YourDollarsOnline Admin Panel
      `
    });

    if (result.success) {
      return NextResponse.json({ 
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({ 
        error: 'Failed to send test email',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error testing SMTP:', error);
    return NextResponse.json({ error: 'Failed to test SMTP settings' }, { status: 500 });
  }
}
