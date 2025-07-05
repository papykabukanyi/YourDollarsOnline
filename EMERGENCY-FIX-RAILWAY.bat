@echo off
echo 🚨 EMERGENCY RAILWAY ENVIRONMENT VARIABLE FIX
echo.
echo This script will set all required environment variables for your Railway deployment.
echo.

REM Set environment variables using Railway CLI
echo 📝 Setting REDIS_URL...
railway variables set REDIS_URL=redis://default:KqxWsKadHsOLTYwiSNvCWxSoAWrBwhwY@trolley.proxy.rlwy.net:59368

echo 📝 Setting JWT_SECRET...
railway variables set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

echo 📝 Setting NEXTAUTH_SECRET...
railway variables set NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production

echo 📝 Setting NEXTAUTH_URL...
railway variables set NEXTAUTH_URL=https://yourdollars-online.up.railway.app

echo 📝 Setting NODE_ENV...
railway variables set NODE_ENV=production

echo 📝 Setting SMTP configuration...
railway variables set SMTP_HOST=smtp.gmail.com
railway variables set SMTP_PORT=587
railway variables set SMTP_USER=your-email@gmail.com
railway variables set SMTP_PASS=your-app-password

echo 📝 Setting PayPal configuration...
railway variables set NEXT_PUBLIC_PAYPAL_CLIENT_ID=ASc_rNXU2xfNoTtyq1zwcZOO7TYEQOGGXTg21iiSWV51xM7sx-EcTSgvtd4nVFRllY3-oShAKa4XnAkA
railway variables set PAYPAL_CLIENT_ID=ASc_rNXU2xfNoTtyq1zwcZOO7TYEQOGGXTg21iiSWV51xM7sx-EcTSgvtd4nVFRllY3-oShAKa4XnAkA
railway variables set PAYPAL_CLIENT_SECRET=EFM7wptNgN7dKGiVwQAUW0qhiqolQxbkhb_76puR8AU5kMuQVxO7p13-DLRSu52A445xNTHbtK8lJXXm
railway variables set PAYPAL_MODE=sandbox

echo 📝 Setting site configuration...
railway variables set NEXT_PUBLIC_SITE_URL=https://yourdollars-online.up.railway.app
railway variables set NEXT_PUBLIC_SITE_NAME=YourDollarsOnline

echo 📝 Setting admin configuration...
railway variables set ADMIN_EMAIL=admin@yourdollarsonline.com
railway variables set ADMIN_PASSWORD=admin123
railway variables set SUPER_ADMIN_USERNAME=superadmin
railway variables set SUPER_ADMIN_PASSWORD=admin123
railway variables set SUPER_ADMIN_EMAIL=admin@yourdollarsonline.com

echo 📝 Setting rate limiting...
railway variables set RATE_LIMIT_MAX=100
railway variables set RATE_LIMIT_WINDOW=15

echo.
echo ✅ All environment variables have been set!
echo.
echo 📋 Verifying variables...
railway variables

echo.
echo 🚀 Triggering deployment...
railway up

echo.
echo 🎉 Deployment initiated!
echo.
echo 🌐 Your app will be available at: https://yourdollars-online.up.railway.app
echo.
echo 🔍 Test these endpoints after deployment:
echo   - https://yourdollars-online.up.railway.app/api/env-check
echo   - https://yourdollars-online.up.railway.app/api/test-redis
echo.
pause
