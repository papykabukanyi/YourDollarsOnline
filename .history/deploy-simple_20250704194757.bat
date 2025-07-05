@echo off
echo 🚀 SIMPLE DEPLOYMENT TO RAILWAY
echo.

echo 📝 Environment: Production
echo 🔧 PostCSS: Fixed
echo 🔐 Secrets: Hidden in .gitignore
echo.

echo 🔨 Building project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.

echo 🚀 Deploying to Railway...
railway up --detach

echo.
echo 🎉 Deployment initiated!
echo.
echo 🌐 Your app: https://yourdollars-online.up.railway.app
echo 🔑 Admin login: https://yourdollars-online.up.railway.app/admin/login
echo 👤 Username: superadmin
echo 🔒 Password: admin123
echo.
echo 🧪 Test endpoints:
echo   Environment: https://yourdollars-online.up.railway.app/api/env-check
echo   Redis: https://yourdollars-online.up.railway.app/api/test-redis
echo.
pause
