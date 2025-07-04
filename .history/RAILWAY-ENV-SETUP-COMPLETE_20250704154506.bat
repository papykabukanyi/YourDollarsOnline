@echo off
echo ========================================
echo Railway Environment Variables Setup
echo ========================================
echo.

echo This script will set up ALL required environment variables for YourDollarsOnline
echo.

echo Step 1: Link to Railway project
echo.
railway link

echo.
echo Step 2: Setting environment variables...
echo.

echo Setting REDIS_URL (Redis database connection)...
railway variables set REDIS_URL=redis://default:VCBJdxCZkjPFuXDTGKGEHjWZQeZlNrKj@junction.proxy.rlwy.net:40648

echo Setting JWT_SECRET (Authentication security)...
railway variables set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024

echo Setting NEXTAUTH_SECRET (NextAuth security)...
railway variables set NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production-2024

echo Setting NEXTAUTH_URL (Application URL)...
railway variables set NEXTAUTH_URL=https://yourdollarsonline-production.up.railway.app

echo Setting SMTP Configuration...
railway variables set SMTP_HOST=smtp.gmail.com
railway variables set SMTP_PORT=587
railway variables set SMTP_USER=your-email@gmail.com
railway variables set SMTP_PASS=your-app-password

echo Setting PayPal Configuration...
railway variables set PAYPAL_CLIENT_ID=your-paypal-client-id
railway variables set PAYPAL_CLIENT_SECRET=your-paypal-client-secret
railway variables set PAYPAL_MODE=sandbox

echo Setting Admin Configuration...
railway variables set ADMIN_EMAIL=admin@yourdollarsonline.com
railway variables set ADMIN_PASSWORD=admin123

echo Setting Security Configuration...
railway variables set RATE_LIMIT_MAX=100
railway variables set RATE_LIMIT_WINDOW=15

echo Setting Node Environment...
railway variables set NODE_ENV=production

echo.
echo Step 3: Verify environment variables...
echo.
railway variables

echo.
echo Step 4: Deploy the application...
echo.
railway deploy

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for deployment to complete
echo 2. Visit your Railway app URL
echo 3. Test the /api/env-check endpoint
echo 4. Test the /api/test-redis endpoint
echo 5. Try logging into /admin/login
echo.
echo If you encounter issues, check Railway logs:
echo railway logs
echo.
pause
