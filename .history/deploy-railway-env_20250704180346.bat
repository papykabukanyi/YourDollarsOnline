@echo off
echo 🚀 Setting up Railway environment variables...

REM Check if Railway CLI is installed
railway version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI is not installed. Please install it first:
    echo npm install -g @railway/cli
    exit /b 1
)

REM Login to Railway (if not already logged in)
echo 🔐 Checking Railway authentication...
railway login

REM Set environment variables
echo 📝 Setting environment variables...

REM Essential Variables
railway variables set REDIS_URL="redis://default:KqxWsKadHsOLTYwiSNvCWxSoAWrBwhwY@trolley.proxy.rlwy.net:59368"
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
railway variables set NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-this-in-production"
railway variables set NEXTAUTH_URL="https://yourdollars-online.up.railway.app"
railway variables set NODE_ENV="production"

REM SMTP Configuration
railway variables set SMTP_HOST="smtp.gmail.com"
railway variables set SMTP_PORT="587"
railway variables set SMTP_USER="your-email@gmail.com"
railway variables set SMTP_PASS="your-app-password"

REM PayPal Configuration
railway variables set NEXT_PUBLIC_PAYPAL_CLIENT_ID="ASc_rNXU2xfNoTtyq1zwcZOO7TYEQOGGXTg21iiSWV51xM7sx-EcTSgvtd4nVFRllY3-oShAKa4XnAkA"
railway variables set PAYPAL_CLIENT_ID="ASc_rNXU2xfNoTtyq1zwcZOO7TYEQOGGXTg21iiSWV51xM7sx-EcTSgvtd4nVFRllY3-oShAKa4XnAkA"
railway variables set PAYPAL_CLIENT_SECRET="EFM7wptNgN7dKGiVwQAUW0qhiqolQxbkhb_76puR8AU5kMuQVxO7p13-DLRSu52A445xNTHbtK8lJXXm"
railway variables set PAYPAL_MODE="sandbox"

REM Site Configuration
railway variables set NEXT_PUBLIC_SITE_URL="https://yourdollars-online.up.railway.app"
railway variables set NEXT_PUBLIC_SITE_NAME="YourDollarsOnline"

REM Admin Configuration
railway variables set ADMIN_EMAIL="admin@yourdollarsonline.com"
railway variables set ADMIN_PASSWORD="admin123"
railway variables set SUPER_ADMIN_USERNAME="superadmin"
railway variables set SUPER_ADMIN_PASSWORD="admin123"
railway variables set SUPER_ADMIN_EMAIL="admin@yourdollarsonline.com"

REM Rate Limiting
railway variables set RATE_LIMIT_MAX="100"
railway variables set RATE_LIMIT_WINDOW="15"

echo ✅ Environment variables set successfully!

REM List all variables to verify
echo 📋 Current environment variables:
railway variables

REM Deploy the application
echo 🚀 Deploying to Railway...
railway up

echo 🎉 Deployment initiated! Check your Railway dashboard for status.
echo 🌐 Your app will be available at: https://yourdollars-online.up.railway.app
pause
