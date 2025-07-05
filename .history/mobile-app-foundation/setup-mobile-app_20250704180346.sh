#!/bin/bash

# YourDollarsOnline Mobile App Setup Script
# This script helps set up the React Native development environment

echo "📱 YourDollarsOnline Mobile App Setup"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if React Native CLI is installed
if ! command -v react-native &> /dev/null; then
    echo "🔧 Installing React Native CLI..."
    npm install -g @react-native-community/cli
else
    echo "✅ React Native CLI is already installed"
fi

# Create mobile app directory
MOBILE_APP_DIR="YourDollarsOnlineMobile"
if [ -d "$MOBILE_APP_DIR" ]; then
    echo "📁 Directory $MOBILE_APP_DIR already exists"
    read -p "Do you want to remove it and start fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$MOBILE_APP_DIR"
        echo "🗑️  Removed existing directory"
    else
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Copy foundation files
echo "📋 Copying foundation files..."
cp -r mobile-app-foundation "$MOBILE_APP_DIR"
cd "$MOBILE_APP_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Platform-specific setup
echo "🔧 Platform Setup"
echo "=================="

# Check for Android setup
if command -v adb &> /dev/null; then
    echo "✅ Android SDK detected"
    echo "📱 You can run: npx react-native run-android"
else
    echo "⚠️  Android SDK not found. Install Android Studio to develop for Android."
fi

# Check for iOS setup (Mac only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcodebuild &> /dev/null; then
        echo "✅ Xcode detected"
        echo "📱 Installing iOS dependencies..."
        cd ios && pod install && cd ..
        echo "🍎 You can run: npx react-native run-ios"
    else
        echo "⚠️  Xcode not found. Install Xcode from Mac App Store to develop for iOS."
    fi
else
    echo "⚠️  iOS development requires macOS"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "Next steps:"
echo "1. cd $MOBILE_APP_DIR"
echo "2. Configure API endpoint in src/services/api.js"
echo "3. Run 'npx react-native run-android' or 'npx react-native run-ios'"
echo ""
echo "Development URLs:"
echo "- Metro bundler: http://localhost:8081"
echo "- API backend: https://yourdollars-online.up.railway.app"
echo ""
echo "Happy coding! 🚀"
