#!/bin/bash

# YourDollarsOnline - Railway Environment Variables Setup
# Run this script to set up all required environment variables in Railway

echo "🚀 Setting up environment variables for Railway deployment..."
echo "============================================================="

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

# Login check
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway:"
    railway login
fi

# Set all required environment variables
echo "🔧 Setting Redis configuration..."
railway variables set REDIS_URL "redis://default:KqxWsKadHsOLTYwiSNvCWxSoAWrBwhwY@trolley.proxy.rlwy.net:59368"

echo "🔐 Setting authentication secrets..."
railway variables set JWT_SECRET "your-super-secret-jwt-key-change-this-in-production-railway-2025"

echo "🌐 Setting site configuration..."
railway variables set NEXT_PUBLIC_SITE_NAME "YourDollarsOnline"
railway variables set NODE_ENV "production"

echo "👤 Setting super admin credentials..."
railway variables set SUPER_ADMIN_USERNAME "superadmin"
railway variables set SUPER_ADMIN_PASSWORD "SecurePassword123!"
railway variables set SUPER_ADMIN_EMAIL "admin@yourdollarsonline.com"

echo "💳 Setting PayPal configuration (update with your credentials)..."
railway variables set NEXT_PUBLIC_PAYPAL_CLIENT_ID "your-paypal-client-id"
railway variables set PAYPAL_CLIENT_SECRET "your-paypal-client-secret"

# Get the Railway domain
echo "🌍 Getting Railway domain..."
DOMAIN=$(railway domain)
if [ -n "$DOMAIN" ]; then
    echo "✅ Found domain: $DOMAIN"
    railway variables set NEXT_PUBLIC_SITE_URL "https://$DOMAIN"
else
    echo "⚠️  Domain not found. Setting default Railway URL pattern..."
    railway variables set NEXT_PUBLIC_SITE_URL "https://yourdollarsonline.up.railway.app"
    echo "   Please update NEXT_PUBLIC_SITE_URL with your actual Railway URL after deployment"
fi

echo ""
echo "✅ All environment variables have been set!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy your application: railway deploy"
echo "2. Wait for deployment to complete"
echo "3. Visit your app URL"
echo "4. Go to /api/init to initialize the database"
echo "5. Login at /admin/login with:"
echo "   Username: superadmin"
echo "   Password: SecurePassword123!"
echo ""
echo "🔒 SECURITY REMINDER:"
echo "- Change the default password after first login"
echo "- Update PayPal credentials with real values"
echo "- Only super admins can access settings and user management"
echo ""
