@echo off
title AI Trading System Deployment

echo 🚀 Starting AI Trading System Deployment Setup
echo.

REM Check if we're in a git repository
if not exist .git (
    echo Initializing git repository...
    git init
    echo.
)

REM Add all files to git
echo Adding files to git...
git add *.py *.json *.md *.html *.css *.js
echo.

REM Make initial commit if no commits exist
git rev-parse --verify HEAD >nul 2>&1
if errorlevel 1 (
    echo Making initial commit...
    git commit -m "Initial commit - AI Trading System"
) else (
    echo Updating existing repository...
    git commit -m "Update - AI Trading System" >nul 2>&1
    if errorlevel 1 (
        echo No changes to commit
    ) else (
        echo Changes committed successfully
    )
)

echo.
echo ✅ Files prepared for deployment
echo.
echo NEXT STEPS:
echo 1. Create a new repository on GitHub
echo 2. Add the remote origin:
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo 3. Push to GitHub:
echo    git push -u origin main
echo.
echo Then follow the instructions in DEPLOY_INSTRUCTIONS.md
echo.
pause