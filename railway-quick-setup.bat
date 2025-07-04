@echo off
echo ========================================
echo Railway Quick Setup - YourDollarsOnline
echo ========================================
echo.

echo Linking to Railway project...
railway link

echo.
echo Setting CORE environment variables...
echo.

echo [1/8] Setting REDIS_URL...
railway variables set REDIS_URL=redis://default:VCBJdxCZkjPFuXDTGKGEHjWZQeZlNrKj@junction.proxy.rlwy.net:40648

echo [2/8] Setting JWT_SECRET...
railway variables set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024

echo [3/8] Setting NEXTAUTH_SECRET...
railway variables set NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production-2024

echo [4/8] Setting NEXTAUTH_URL...
railway variables set NEXTAUTH_URL=https://yourdollarsonline-production.up.railway.app

echo [5/8] Setting NODE_ENV...
railway variables set NODE_ENV=production

echo [6/8] Setting ADMIN_EMAIL...
railway variables set ADMIN_EMAIL=admin@yourdollarsonline.com

echo [7/8] Setting ADMIN_PASSWORD...
railway variables set ADMIN_PASSWORD=admin123

echo [8/8] Setting RATE_LIMIT_MAX...
railway variables set RATE_LIMIT_MAX=100

echo.
echo Deploying application...
railway deploy --force

echo.
echo Setup complete! 
echo.
echo Next steps:
echo 1. Wait for deployment to finish
echo 2. Check: https://yourdollarsonline-production.up.railway.app/api/env-check
echo 3. Check: https://yourdollarsonline-production.up.railway.app/api/test-redis
echo 4. Login: https://yourdollarsonline-production.up.railway.app/admin/login
echo.
echo If there are issues, run: railway logs
echo.
pause
