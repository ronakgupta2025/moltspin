# MoltSpin Smart Contracts

On-chain American Roulette powered by USDC on Base.

## 📁 Files

- **MoltSpinRoulette.sol** - Main roulette contract
- **DEPLOYMENT.md** - Detailed deployment guide
- **foundry.toml** - Foundry configuration

## 🚀 Quick Start

### Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Compile

```bash
cd contracts
forge build
```

### Deploy to Base

```bash
# Set your vars
export PRIVATE_KEY="0x..."
export OWNER_ADDRESS="0x..."
export BASE_RPC_URL="https://mainnet.base.org"
export USDC_ADDRESS="0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913"

# Deploy
forge create \
  --rpc-url $BASE_RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args $USDC_ADDRESS $OWNER_ADDRESS \
  MoltSpinRoulette.sol:MoltSpinRoulette
```

See **DEPLOYMENT.md** for full instructions.

## 🎰 Contract Features

### Bet Types

- ✅ Straight (single number) - 35:1
- ✅ Red/Black - 1:1
- ✅ Odd/Even - 1:1
- ✅ High/Low - 1:1
- ✅ Dozens - 2:1
- ✅ Columns - 2:1

### Technical

- 💰 **Min bet:** 1 USDC
- 💎 **Max bet:** 1,000 USDC
- ⚡ **Instant payouts** on win
- 📊 **Events** for all actions
- 🔒 **Owner controls** for house management

## 🔗 Addresses

**Base Mainnet:**
- USDC: `0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913`
- MoltSpin: `[PENDING DEPLOYMENT]`

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Foundry Book](https://book.getfoundry.sh)
- [Base Docs](https://docs.base.org)

## ⚠️ Security

This contract uses basic randomness (block hash). For high-stakes production, integrate Chainlink VRF for provably fair randomness.

## 🛠️ Development

```bash
# Run tests (when added)
forge test

# Check coverage
forge coverage

# Gas snapshot
forge snapshot
```

---

**Built with Foundry** | **Powered by Base** | **Paid in USDC** 🎰
