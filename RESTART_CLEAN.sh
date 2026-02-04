#!/bin/bash

echo "🔧 MoltSpin UI - Clean Restart"
echo "=============================="
echo ""
echo "This will:"
echo "  1. Remove old build files"
echo "  2. Remove node_modules"
echo "  3. Fresh install dependencies"
echo "  4. Start dev server"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "🗑️  Cleaning old files..."
    rm -rf .next node_modules package-lock.json
    
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Installation complete!"
        echo ""
        echo "🚀 Starting development server..."
        echo ""
        npm run dev
    else
        echo ""
        echo "❌ Installation failed. Check errors above."
        exit 1
    fi
else
    echo "Cancelled."
    exit 0
fi
