@echo off
echo 🔨 Building YourDollarsOnline for Production
echo.

echo 📝 Setting build environment...
set NODE_ENV=production
set SKIP_ENV_VALIDATION=true

echo 🧹 Cleaning previous build...
if exist ".next" rmdir /s /q ".next"

echo 📦 Installing dependencies...
npm install

echo 🔨 Building application...
npm run build

if %errorlevel% == 0 (
    echo.
    echo ✅ Build completed successfully!
    echo.
    echo 🚀 Ready to deploy to Railway!
    echo.
    echo Run: railway up
    echo.
) else (
    echo.
    echo ❌ Build failed! Check the errors above.
    echo.
    pause
)

pause
