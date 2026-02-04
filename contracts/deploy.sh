#!/bin/bash

# MoltSpin Contract Deployment Script
# Usage: ./deploy.sh

set -e

echo "🎰 MoltSpin Contract Deployment"
echo "================================"
echo ""

# Check if foundry is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not found. Install it first:"
    echo "curl -L https://foundry.paradigm.xyz | bash"
    echo "foundryup"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    echo "📝 Loading .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found. Please set these variables:"
    echo ""
    echo "PRIVATE_KEY=0x..."
    echo "OWNER_ADDRESS=0x..."
    echo "BASE_RPC_URL=https://mainnet.base.org"
    echo "USDC_ADDRESS=0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913"
    echo "BASESCAN_API_KEY=your_api_key_optional"
    echo ""
    exit 1
fi

# Validate required variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set"
    exit 1
fi

if [ -z "$OWNER_ADDRESS" ]; then
    echo "❌ OWNER_ADDRESS not set"
    exit 1
fi

# Set defaults
BASE_RPC_URL="${BASE_RPC_URL:-https://mainnet.base.org}"
USDC_ADDRESS="${USDC_ADDRESS:-0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913}"

echo "📋 Configuration:"
echo "  RPC: $BASE_RPC_URL"
echo "  USDC: $USDC_ADDRESS"
echo "  Owner: $OWNER_ADDRESS"
echo ""

# Compile
echo "🔨 Compiling contract..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi

echo "✅ Compilation successful"
echo ""

# Deploy
echo "🚀 Deploying to Base..."
echo ""

if [ -n "$BASESCAN_API_KEY" ]; then
    echo "📝 Deploying with verification..."
    DEPLOY_OUTPUT=$(forge create \
        --rpc-url $BASE_RPC_URL \
        --private-key $PRIVATE_KEY \
        --constructor-args $USDC_ADDRESS $OWNER_ADDRESS \
        --verify \
        --etherscan-api-key $BASESCAN_API_KEY \
        MoltSpinRoulette.sol:MoltSpinRoulette 2>&1)
else
    echo "📝 Deploying without verification (set BASESCAN_API_KEY to verify)..."
    DEPLOY_OUTPUT=$(forge create \
        --rpc-url $BASE_RPC_URL \
        --private-key $PRIVATE_KEY \
        --constructor-args $USDC_ADDRESS $OWNER_ADDRESS \
        MoltSpinRoulette.sol:MoltSpinRoulette 2>&1)
fi

echo "$DEPLOY_OUTPUT"

# Extract contract address
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "Deployed to:" | awk '{print $3}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Deployment failed - could not extract contract address"
    exit 1
fi

echo ""
echo "✅ Contract deployed successfully!"
echo ""
echo "📍 Contract Address: $CONTRACT_ADDRESS"
echo ""

# Save address to file
echo $CONTRACT_ADDRESS > CONTRACT_ADDRESS.txt
echo "💾 Address saved to CONTRACT_ADDRESS.txt"
echo ""

# Show next steps
echo "🎯 Next Steps:"
echo ""
echo "1. Fund the house (recommended: 1000 USDC minimum):"
echo "   cast send $USDC_ADDRESS \"approve(address,uint256)\" $CONTRACT_ADDRESS 1000000000 --rpc-url $BASE_RPC_URL --private-key \$PRIVATE_KEY"
echo "   cast send $CONTRACT_ADDRESS \"fundHouse(uint256)\" 1000000000 --rpc-url $BASE_RPC_URL --private-key \$PRIVATE_KEY"
echo ""
echo "2. Update frontend .env.local:"
echo "   NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS"
echo "   NEXT_PUBLIC_USDC_ADDRESS=$USDC_ADDRESS"
echo ""
echo "3. View on BaseScan:"
echo "   https://basescan.org/address/$CONTRACT_ADDRESS"
echo ""
echo "4. Update SKILL.md with contract address"
echo ""
echo "🎰 Ready to spin!"
