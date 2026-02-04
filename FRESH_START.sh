#!/bin/bash

echo "🎰 MoltSpin - Fresh Start (2D Arcade Wheel)"
echo "==========================================="
echo ""
echo "This will:"
echo "  ✅ Remove 3D dependencies"
echo "  ✅ Clean old build files"
echo "  ✅ Fresh install (2D only)"
echo "  ✅ Start dev server"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "🗑️  Removing old files..."
    rm -rf .next node_modules package-lock.json
    
    echo ""
    echo "📦 Installing dependencies (no 3D libs)..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Installation complete!"
        echo ""
        echo "📋 What to expect:"
        echo "  - Premium 2D arcade wheel"
        echo "  - Smooth animations (60 FPS)"
        echo "  - Working sound effects"
        echo "  - No 3D complexity!"
        echo ""
        echo "🔊 Sound tip: Click anywhere on page to enable audio"
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
