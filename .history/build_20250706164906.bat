@echo off
echo Setting up production environment variables for build...

:: Set production environment variables
set NODE_ENV=production

echo Building the application...
next build

echo Build complete!
