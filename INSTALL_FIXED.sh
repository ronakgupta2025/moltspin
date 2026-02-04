#!/bin/bash

echo "🎰 MoltSpin - Complete Rebuild Installation"
echo "==========================================="
echo ""
echo "This will install the completely rebuilt frontend with:"
echo "  ✅ Fixed wheel (proper rotation + depth)"
echo "  ✅ Working sounds (all 6 effects)"
echo "  ✅ Casino-style betting table"
echo "  ✅ 4 pages (landing, play, profile, rules)"
echo "  ✅ Smooth navigation"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "🗑️  Cleaning old build..."
    rm -rf .next node_modules package-lock.json
    
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Installation complete!"
        echo ""
        echo "📋 What's New:"
        echo "  • Landing page at /"
        echo "  • Play page at /play"
        echo "  • Profile page at /profile"
        echo "  • Rules page at /rules"
        echo "  • Fixed wheel with depth + rotation"
        echo "  • Working sounds (click to enable)"
        echo "  • Casino-style betting table"
        echo ""
        echo "🔊 Sound Tip: Click anywhere on the page to enable audio!"
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
