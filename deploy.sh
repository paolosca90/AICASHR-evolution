#!/bin/bash

# AI Trading System Deployment Script

echo "🚀 Starting AI Trading System Deployment Setup"

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
fi

# Add all files to git
echo "Adding files to git..."
git add *.py *.json *.md *.html *.css *.js

# Make initial commit if no commits exist
if [ $(git rev-list --count HEAD 2>/dev/null || echo 0) -eq 0 ]; then
    echo "Making initial commit..."
    git commit -m "Initial commit - AI Trading System"
else
    echo "Updating existing repository..."
    git commit -m "Update - AI Trading System" || echo "No changes to commit"
fi

echo "✅ Files prepared for deployment"
echo ""
echo "NEXT STEPS:"
echo "1. Create a new repository on GitHub"
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "3. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "Then follow the instructions in DEPLOY_INSTRUCTIONS.md"