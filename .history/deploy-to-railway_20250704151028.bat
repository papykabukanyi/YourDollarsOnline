@echo off
echo 🚀 YourDollarsOnline - Railway Deployment Script
echo =================================================

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI is not installed. Please install it first:
    echo    npm install -g @railway/cli
    pause
    exit /b 1
)

REM Check if we're logged in to Railway
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Railway first:
    railway login
)

REM Check if we're in a Railway project
railway status >nul 2>&1
if %errorlevel% neq 0 (
    echo 📋 Linking to Railway project...
    railway link
)

REM Set environment variables
echo 🔧 Setting environment variables...

railway variables set REDIS_URL=redis://default:KqxWsKadHsOLTYwiSNvCWxSoAWrBwhwY@trolley.proxy.rlwy.net:59368
railway variables set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-railway-2025
railway variables set NEXT_PUBLIC_SITE_NAME=YourDollarsOnline
railway variables set SUPER_ADMIN_USERNAME=superadmin
railway variables set SUPER_ADMIN_PASSWORD=SecurePassword123!
railway variables set SUPER_ADMIN_EMAIL=admin@yourdollarsonline.com
railway variables set NODE_ENV=production

REM Note: NEXT_PUBLIC_SITE_URL should be set manually after getting Railway URL

echo ⚠️  Please set NEXT_PUBLIC_SITE_URL manually in Railway dashboard after deployment

REM Deploy the application
echo 🚢 Deploying to Railway...
railway deploy

echo ✅ Deployment initiated!
echo.
echo 📋 Post-deployment steps:
echo 1. Wait for deployment to complete
echo 2. Visit your Railway URL to test the application
echo 3. Go to /api/init to initialize the database
echo 4. Go to /api/test-redis to test Redis connection
echo 5. Login to admin panel at /admin/login
echo.
echo 🔧 Default admin credentials:
echo Username: superadmin
echo Password: SecurePassword123!
echo.
echo ⚠️  Remember to change the default password after first login!
echo.
pause
