#!/bin/bash

echo "🎰 MoltSpin UI - 3D Roulette Setup"
echo "=================================="
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
echo ""
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
    echo "❌ Installation failed. Please check for errors above."
    exit 1
fi
