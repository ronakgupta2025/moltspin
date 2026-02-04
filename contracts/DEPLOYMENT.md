# MoltSpin Contract Deployment Guide

## Contract Details

**Contract:** `MoltSpinRoulette.sol`  
**Network:** Base Mainnet  
**Payment Token:** USDC (0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913)

## Features

✅ **USDC-based betting** (not ETH)  
✅ **American Roulette** (38 numbers: 0, 00, 1-36)  
✅ **Min bet:** 1 USDC ($1)  
✅ **Max bet:** 1,000 USDC  
✅ **All bet types:** Straight, Red/Black, Odd/Even, High/Low, Dozens, Columns  
✅ **Automatic payouts:** Instant on win  
✅ **Events for frontend:** No database needed  
✅ **Owner controls:** Fund and withdraw house balance  

## Payout Structure

| Bet Type | Pays | Example |
|----------|------|---------|
| Straight (single number) | 35:1 | Bet $1, win $36 |
| Red/Black | 1:1 | Bet $1, win $2 |
| Odd/Even | 1:1 | Bet $1, win $2 |
| High/Low (19-36 / 1-18) | 1:1 | Bet $1, win $2 |
| Dozens (1-12, 13-24, 25-36) | 2:1 | Bet $1, win $3 |
| Columns | 2:1 | Bet $1, win $3 |

## Prerequisites

1. **Foundry** installed (for compilation and deployment)
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Base RPC URL** (get from Alchemy, Infura, or use public: https://mainnet.base.org)

3. **Deployer wallet** with:
   - Base ETH for gas (~0.01 ETH)
   - Private key ready

4. **Owner address** (who can withdraw from house)

## Deployment Steps

### Step 1: Initialize Foundry Project

```bash
cd ~/.openclaw/workspace/projects/roulette-game/moltspin-ui/contracts
forge init --no-git --force
```

### Step 2: Copy Contract

The contract is already in `contracts/MoltSpinRoulette.sol`.

### Step 3: Compile

```bash
forge build
```

Expected output: `Compiler run successful!`

### Step 4: Set Environment Variables

```bash
# Your deployment wallet private key
export PRIVATE_KEY="0x..."

# Base mainnet RPC
export BASE_RPC_URL="https://mainnet.base.org"

# Owner address (can withdraw house funds)
export OWNER_ADDRESS="0x..."

# USDC on Base
export USDC_ADDRESS="0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913"
```

### Step 5: Deploy

```bash
forge create \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args $USDC_ADDRESS $OWNER_ADDRESS \
  src/MoltSpinRoulette.sol:MoltSpinRoulette \
  --verify \
  --etherscan-api-key YOUR_BASESCAN_API_KEY
```

**Or without verification (verify later):**

```bash
forge create \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args $USDC_ADDRESS $OWNER_ADDRESS \
  src/MoltSpinRoulette.sol:MoltSpinRoulette
```

### Step 6: Save Contract Address

```bash
# You'll get output like:
# Deployed to: 0xYourContractAddress

# Save it!
export CONTRACT_ADDRESS="0xYourContractAddress"
echo $CONTRACT_ADDRESS > CONTRACT_ADDRESS.txt
```

### Step 7: Verify on BaseScan (if not done during deployment)

```bash
forge verify-contract \
  --chain-id 8453 \
  --compiler-version v0.8.20 \
  --constructor-args $(cast abi-encode "constructor(address,address)" $USDC_ADDRESS $OWNER_ADDRESS) \
  $CONTRACT_ADDRESS \
  src/MoltSpinRoulette.sol:MoltSpinRoulette \
  --etherscan-api-key YOUR_BASESCAN_API_KEY
```

## Post-Deployment Setup

### Fund the House

The contract needs USDC to pay winners. Fund it with at least $1000 USDC to start:

```bash
# Approve contract to receive USDC
cast send $USDC_ADDRESS \
  "approve(address,uint256)" \
  $CONTRACT_ADDRESS \
  1000000000 \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY

# Fund the house
cast send $CONTRACT_ADDRESS \
  "fundHouse(uint256)" \
  1000000000 \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY
```

### Test a Bet

```bash
# Approve contract to spend your USDC
cast send $USDC_ADDRESS \
  "approve(address,uint256)" \
  $CONTRACT_ADDRESS \
  10000000 \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY

# Place a $1 bet on red
cast send $CONTRACT_ADDRESS \
  "betRed(uint256)" \
  1000000 \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY
```

### Check House Balance

```bash
cast call $CONTRACT_ADDRESS \
  "getHouseBalance()(uint256)" \
  --rpc-url $BASE_RPC_URL
```

## Integration with Frontend

### Update Environment Variables

Create `.env.local` in your Next.js project:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913
NEXT_PUBLIC_CHAIN_ID=8453
```

### Contract ABI

The ABI will be in `out/MoltSpinRoulette.sol/MoltSpinRoulette.json` after compilation.

Copy it to your frontend:

```bash
cp out/MoltSpinRoulette.sol/MoltSpinRoulette.json ../app/contracts/
```

### Key Events to Listen To

```typescript
// BetPlaced event
event BetPlaced(
  uint256 indexed betId,
  address indexed player,
  BetType betType,
  uint8 number,
  uint256 amount,
  uint256 timestamp
);

// SpinResult event (immediate after bet)
event SpinResult(
  uint256 indexed betId,
  address indexed player,
  uint8 winningNumber,
  bool won,
  uint256 payout,
  uint256 timestamp
);
```

## Owner Functions

### Withdraw Profits

```bash
# Withdraw 100 USDC
cast send $CONTRACT_ADDRESS \
  "withdrawHouse(uint256)" \
  100000000 \
  --rpc-url $BASE_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY
```

### Emergency Withdraw All

```bash
cast send $CONTRACT_ADDRESS \
  "emergencyWithdraw()" \
  --rpc-url $BASE_RPC_URL \
  --private-key $OWNER_PRIVATE_KEY
```

## Addresses & Links

**Base Mainnet:**
- USDC: `0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913`
- MoltSpin Contract: `[TO BE DEPLOYED]`

**Resources:**
- BaseScan: https://basescan.org
- Base RPC: https://mainnet.base.org
- Foundry Docs: https://book.getfoundry.sh

## Security Notes

1. **Randomness:** Currently uses block hash + timestamp. For production with high stakes, consider Chainlink VRF.
2. **House Balance:** Always maintain 35x the max bet to cover straight bet payouts.
3. **Owner Key:** Keep the owner private key secure - it can withdraw all funds.
4. **Approvals:** Users must approve USDC spending before betting.

## Troubleshooting

**"Insufficient house balance":**
- Fund the contract with more USDC via `fundHouse()`

**"Bet too low":**
- Min bet is 1 USDC (1000000 with 6 decimals)

**"Transfer failed":**
- Check user approved contract to spend USDC
- Verify user has enough USDC balance

**"Unauthorized":**
- Only owner address can call `withdrawHouse()` and `emergencyWithdraw()`

## Next Steps

1. Deploy contract to Base mainnet
2. Verify on BaseScan
3. Fund house with USDC
4. Update frontend environment variables
5. Test with small bets
6. Update SKILL.md with deployed contract address
7. Announce on Moltx & Moltbook! 🎰
