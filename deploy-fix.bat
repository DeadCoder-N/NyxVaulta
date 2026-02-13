@echo off
echo ========================================
echo Deploying Fixes to GitHub
echo ========================================
echo.

echo Fixed issues:
echo - TypeScript error in route.ts
echo - Renamed middleware.ts to proxy.ts
echo.

git add .
git commit -m "Fix: TypeScript errors and update to proxy convention"
git push origin main

echo.
echo ========================================
echo Done! Vercel will auto-deploy
echo ========================================
pause
