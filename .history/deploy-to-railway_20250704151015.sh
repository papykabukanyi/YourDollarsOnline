#!/bin/bash

# YourDollarsOnline - Railway Deployment Script
# This script helps deploy the application to Railway with proper Redis configuration

echo "🚀 YourDollarsOnline - Railway Deployment Script"
echo "================================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Please install it first:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

# Check if we're logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    railway login
fi

# Check if we're in a Railway project
if ! railway status &> /dev/null; then
    echo "📋 Linking to Railway project..."
    railway link
fi

# Set environment variables
echo "🔧 Setting environment variables..."

railway variables set REDIS_URL="redis://default:KqxWsKadHsOLTYwiSNvCWxSoAWrBwhwY@trolley.proxy.rlwy.net:59368"
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-railway-2025"
railway variables set NEXT_PUBLIC_SITE_NAME="YourDollarsOnline"
railway variables set SUPER_ADMIN_USERNAME="superadmin"
railway variables set SUPER_ADMIN_PASSWORD="SecurePassword123!"
railway variables set SUPER_ADMIN_EMAIL="admin@yourdollarsonline.com"
railway variables set NODE_ENV="production"

# Get the Railway URL
echo "🌐 Getting Railway URL..."
RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url' 2>/dev/null)

if [ "$RAILWAY_URL" != "null" ] && [ -n "$RAILWAY_URL" ]; then
    echo "✅ Found Railway URL: $RAILWAY_URL"
    railway variables set NEXT_PUBLIC_SITE_URL="$RAILWAY_URL"
else
    echo "⚠️  Railway URL not found. Please set NEXT_PUBLIC_SITE_URL manually after deployment."
fi

# Deploy the application
echo "🚢 Deploying to Railway..."
railway deploy

echo "✅ Deployment initiated!"
echo ""
echo "📋 Post-deployment steps:"
echo "1. Wait for deployment to complete"
echo "2. Visit your Railway URL to test the application"
echo "3. Go to /api/init to initialize the database"
echo "4. Go to /api/test-redis to test Redis connection"
echo "5. Login to admin panel at /admin/login"
echo ""
echo "🔧 Default admin credentials:"
echo "Username: superadmin"
echo "Password: SecurePassword123!"
echo ""
echo "⚠️  Remember to change the default password after first login!"
