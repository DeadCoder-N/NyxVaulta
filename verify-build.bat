@echo off
echo ========================================
echo NyxVaulta - Build Verification
echo ========================================
echo.

echo Cleaning previous builds...
if exist ".next" rmdir /s /q .next
if exist "out" rmdir /s /q out
echo.

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo.

echo Running build...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    echo.
    echo Common fixes:
    echo 1. Check for TypeScript errors
    echo 2. Verify environment variables in .env.local
    echo 3. Check for missing dependencies
    pause
    exit /b 1
)
echo.

echo ========================================
echo Build Successful!
echo ========================================
echo.
echo You can now deploy to Vercel
echo Run: git push origin main
echo.
pause
