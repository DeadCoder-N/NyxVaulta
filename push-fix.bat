@echo off
echo ========================================
echo Pushing TypeScript Fix to GitHub
echo ========================================
echo.

echo Changes:
echo - Fixed TypeScript error in route.ts
echo - Already renamed middleware to proxy
echo.

git add .
git commit -m "Fix: TypeScript error - use proper Database type"
git push origin main

echo.
echo ========================================
echo Pushed! Vercel will auto-deploy
echo ========================================
echo.
pause
