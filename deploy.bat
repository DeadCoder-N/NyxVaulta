@echo off
echo ========================================
echo NyxVaulta - GitHub Deployment Script
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding files to Git...
git add .
echo.

REM Prompt for commit message
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update: Deploy to production

echo.
echo Creating commit...
git commit -m "%commit_msg%"
echo.

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo No remote repository found!
    echo Please add your GitHub repository URL:
    echo Example: git remote add origin https://github.com/username/nyxvaulta.git
    echo.
    set /p remote_url="Enter GitHub repository URL: "
    git remote add origin %remote_url%
    echo.
)

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Import your GitHub repository
echo 3. Add environment variables
echo 4. Deploy!
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
