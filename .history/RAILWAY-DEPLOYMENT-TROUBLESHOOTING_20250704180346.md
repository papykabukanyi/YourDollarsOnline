# 🚨 RAILWAY DEPLOYMENT TROUBLESHOOTING GUIDE

## Environment Variable Issues

### Problem: "REDIS_URL environment variable is not set"

**Symptoms:**
- Error: `REDIS_URL environment variable is not set`
- Environment check shows `hasRedisUrl: false`
- Available env vars: `[]`

**Solutions:**

### 1. Quick Fix - Set Environment Variables via Railway Dashboard

1. Go to https://railway.app/dashboard
2. Select your project
3. Click on "Variables" tab
4. Add these variables:

```
REDIS_URL=redis://default:KqxWsKadHsOLTYwiSNvCWxSoAWrBwhwY@trolley.proxy.rlwy.net:59368
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production
NEXTAUTH_URL=https://yourdollars-online.up.railway.app
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_PAYPAL_CLIENT_ID=ASc_rNXU2xfNoTtyq1zwcZOO7TYEQOGGXTg21iiSWV51xM7sx-EcTSgvtd4nVFRllY3-oShAKa4XnAkA
PAYPAL_CLIENT_ID=ASc_rNXU2xfNoTtyq1zwcZOO7TYEQOGGXTg21iiSWV51xM7sx-EcTSgvtd4nVFRllY3-oShAKa4XnAkA
PAYPAL_CLIENT_SECRET=EFM7wptNgN7dKGiVwQAUW0qhiqolQxbkhb_76puR8AU5kMuQVxO7p13-DLRSu52A445xNTHbtK8lJXXm
PAYPAL_MODE=sandbox
NEXT_PUBLIC_SITE_URL=https://yourdollars-online.up.railway.app
NEXT_PUBLIC_SITE_NAME=YourDollarsOnline
ADMIN_EMAIL=admin@yourdollarsonline.com
ADMIN_PASSWORD=admin123
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=admin123
SUPER_ADMIN_EMAIL=admin@yourdollarsonline.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15
```

### 2. Command Line Fix - Using Railway CLI

```bash
# Install Railway CLI if not installed
npm install -g @railway/cli

# Login to Railway
railway login

# Set environment variables
railway variables set REDIS_URL="redis://default:KqxWsKadHsOLTYwiSNvCWxSoAWrBwhwY@trolley.proxy.rlwy.net:59368"
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
railway variables set NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-this-in-production"
railway variables set NEXTAUTH_URL="https://yourdollars-online.up.railway.app"
railway variables set NODE_ENV="production"

# ... (set all other variables)

# Deploy
railway up
```

### 3. Automated Fix - Run the Deployment Script

**Windows:**
```cmd
deploy-railway-env.bat
```

**Linux/Mac:**
```bash
chmod +x deploy-railway-env.sh
./deploy-railway-env.sh
```

### 4. Manual Verification

After setting variables, verify them:

```bash
# Check variables
railway variables

# Check environment endpoint
curl https://yourdollars-online.up.railway.app/api/env-check

# Test Redis connection
curl https://yourdollars-online.up.railway.app/api/test-redis
```

## Common Issues and Solutions

### Issue 1: Metadata Warnings

**Problem:** Unsupported metadata themeColor/viewport warnings

**Solution:** ✅ Fixed in latest code
- Moved `themeColor` and `viewport` to separate `viewport` export
- Updated both main and admin layouts

### Issue 2: Redis Connection Timeout

**Problem:** Redis connection fails in production

**Solutions:**
1. Verify Redis URL is correct
2. Check Redis service is running in Railway
3. Increase connection timeout (already set to 60s)
4. Enable lazy connect (already enabled)

### Issue 3: Build Failures

**Problem:** Build fails during deployment

**Solutions:**
1. Check for TypeScript errors
2. Verify all imports are correct
3. Ensure all dependencies are installed
4. Check for syntax errors

### Issue 4: Environment Variables Not Loading

**Problem:** Environment variables work locally but not in production

**Solutions:**
1. ✅ Use the new environment utility (`src/lib/env.js`)
2. ✅ Verify `next.config.js` exports env vars
3. Set variables in Railway dashboard
4. Use `railway variables` command to verify

## Deployment Checklist

### Before Deployment:
- [ ] Set all environment variables in Railway
- [ ] Verify Redis service is running
- [ ] Test build locally: `npm run build`
- [ ] Check for any TypeScript/ESLint errors

### During Deployment:
- [ ] Monitor Railway deployment logs
- [ ] Check for any build errors
- [ ] Verify all services start correctly

### After Deployment:
- [ ] Test environment endpoint: `/api/env-check`
- [ ] Test Redis connection: `/api/test-redis`
- [ ] Test admin login: `/admin/login`
- [ ] Verify mobile responsiveness
- [ ] Test all major features

## Emergency Fix Commands

If deployment fails, try these commands:

```bash
# Re-deploy with fresh environment
railway up --detach

# Check logs
railway logs

# Restart service
railway restart

# Check service status
railway status
```

## Support

If issues persist:
1. Check Railway dashboard for service status
2. Review deployment logs
3. Verify all environment variables are set
4. Test locally with production environment
5. Contact Railway support if service issues
