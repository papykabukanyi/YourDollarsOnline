@echo off
echo 🚨 ADMIN LOGIN FIX - DEPLOYING WITH UPDATED ENVIRONMENT
echo.
echo This will deploy your app with the updated environment variables.
echo.

echo 📝 Current environment variables in .env.local:
echo   REDIS_URL=redis://default:KqxWsKadHsOLTYwiSNvCWxSoAWrBwhwY@trolley.proxy.rlwy.net:59368
echo   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
echo   NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production
echo   NEXTAUTH_URL=https://yourdollars-online.up.railway.app
echo   NODE_ENV=production
echo.

echo 🔨 Building project...
npm run build

echo.
echo 🚀 Deploying to Railway...
railway up

echo.
echo ✅ Deployment complete!
echo.
echo 🔍 Admin login should now work at:
echo   https://yourdollars-online.up.railway.app/admin/login
echo.
echo 👤 Use these credentials:
echo   Username: superadmin
echo   Password: admin123
echo.
echo 🧪 Test these endpoints:
echo   Environment check: https://yourdollars-online.up.railway.app/api/env-check
echo   Redis test: https://yourdollars-online.up.railway.app/api/test-redis
echo.
pause
