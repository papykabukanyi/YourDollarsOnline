@echo off
echo 📱 YourDollarsOnline Mobile App Setup
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if React Native CLI is installed
react-native --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔧 Installing React Native CLI...
    npm install -g @react-native-community/cli
) else (
    echo ✅ React Native CLI is already installed
)

REM Create mobile app directory
set MOBILE_APP_DIR=YourDollarsOnlineMobile
if exist "%MOBILE_APP_DIR%" (
    echo 📁 Directory %MOBILE_APP_DIR% already exists
    set /p "REPLY=Do you want to remove it and start fresh? (y/N): "
    if /i "%REPLY%"=="y" (
        rmdir /s /q "%MOBILE_APP_DIR%"
        echo 🗑️  Removed existing directory
    ) else (
        echo ❌ Setup cancelled
        pause
        exit /b 1
    )
)

REM Copy foundation files
echo 📋 Copying foundation files...
xcopy /e /i mobile-app-foundation "%MOBILE_APP_DIR%"
cd "%MOBILE_APP_DIR%"

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Platform-specific setup
echo 🔧 Platform Setup
echo ==================

REM Check for Android setup
adb version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Android SDK detected
    echo 📱 You can run: npx react-native run-android
) else (
    echo ⚠️  Android SDK not found. Install Android Studio to develop for Android.
)

echo.
echo 🎉 Setup Complete!
echo ==================
echo Next steps:
echo 1. cd %MOBILE_APP_DIR%
echo 2. Configure API endpoint in src/services/api.js
echo 3. Run 'npx react-native run-android'
echo.
echo Development URLs:
echo - Metro bundler: http://localhost:8081
echo - API backend: https://yourdollars-online.up.railway.app
echo.
echo Happy coding! 🚀
pause
