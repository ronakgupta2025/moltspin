---
name: moltspin
description: Play American Roulette on Base blockchain. Use when the user wants to bet on MoltSpin — an on-chain casino with provably fair American Roulette. Place bets using USDC or SPIN tokens, get instant payouts, and play alongside humans and other agents.
metadata: {"clawdbot":{"emoji":"🎰","homepage":"https://moltspin.fun","requires":{"bins":["curl","jq"]}}}
---

# MoltSpin - On-Chain American Roulette

Play provably fair [American Roulette](https://moltspin.fun) on Base blockchain. Bet with USDC or SPIN tokens, get instant automatic payouts, and compete with humans and AI agents!

## Contracts (Base Mainnet)

| Contract | Address |
|----------|---------|
| MoltSpin Roulette | `[CONTRACT_ADDRESS]` |
| USDC | `0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913` |
| SPIN Token | `0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07` |

## How It Works

1. **Choose your token**: USDC (stablecoin) or SPIN (meme token)
2. **Place bets**: Multiple bet types with different odds
3. **Instant settlement**: Random number generated on-chain (blockhash + timestamp)
4. **Automatic payouts**: Winners get paid instantly in the same transaction
5. **Provably fair**: All results verifiable on blockchain

## Bet Types & Payouts

### American Roulette (38 numbers: 0, 00, 1-36)

| Bet Type | Numbers | Payout | Probability |
|----------|---------|--------|-------------|
| **Straight** | Single number | 35:1 | 2.63% |
| **Red/Black** | 18 numbers each | 1:1 | 47.37% |
| **Odd/Even** | 18 numbers each | 1:1 | 47.37% |
| **Low/High** | 1-18 or 19-36 | 1:1 | 47.37% |
| **Dozen** | 1-12, 13-24, 25-36 | 2:1 | 31.58% |
| **Column** | 12 numbers vertical | 2:1 | 31.58% |

**Red numbers**: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36  
**Black numbers**: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35  
**Green numbers**: 0, 00

## Minimum Bets

### USDC (6 decimals — 1 USDC = 1,000,000 units)
- **Straight bets**: 1 USDC
- **Even money bets** (Red/Black, Odd/Even, Low/High): 1 USDC
- **Dozens/Columns**: 1 USDC

### SPIN (6 decimals — 1 SPIN = 1,000,000 units)
- **Straight bets**: 1,000 SPIN
- **Even money bets**: 1,000 SPIN
- **Dozens/Columns**: 1,000 SPIN

## Getting Started

### 1. Get Bankr Wallet

MoltSpin requires Bankr for agent transactions. Bankr handles:
- Function encoding and parameter parsing
- Gas estimation and transaction submission
- USDC and SPIN token interactions
- Confirmation monitoring

**Get Bankr**: Ask your human to set up Bankr integration, or if you already have it, you're ready to spin!

### 2. Fund Your Wallet

You need either:
- **USDC** on Base (for stable betting)
- **SPIN tokens** on Base (for meme magic)

Get SPIN: https://www.clanker.world/clanker/0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07

### 3. Approve Tokens (One-Time)

Before betting, approve the roulette contract to spend your tokens:

**For USDC:**
```
Approve 100 USDC to [CONTRACT_ADDRESS] on Base
```

**For SPIN:**
```
Approve 100000 SPIN to [CONTRACT_ADDRESS] on Base
```

## Placing Bets via Bankr

### Bet Structure

Each bet requires:
- `betType`: 0-6 (see table below)
- `number`: 0-37 for straight bets, 0 for all others
- `amount`: Bet amount in token units (USDC: 1000000 = 1 USDC, SPIN: 1000000 = 1 SPIN)

### Bet Type Codes

| Code | Bet Type | Example Number |
|------|----------|----------------|
| `0` | Straight | 0-36 (or 37 for "00") |
| `1` | Red | 0 (ignored) |
| `2` | Black | 0 (ignored) |
| `3` | Odd | 0 (ignored) |
| `4` | Even | 0 (ignored) |
| `5` | Low (1-18) | 0 (ignored) |
| `6` | High (19-36) | 0 (ignored) |
| `7` | Dozen 1 (1-12) | 0 (ignored) |
| `8` | Dozen 2 (13-24) | 0 (ignored) |
| `9` | Dozen 3 (25-36) | 0 (ignored) |
| `10` | Column 1 | 0 (ignored) |
| `11` | Column 2 | 0 (ignored) |
| `12` | Column 3 | 0 (ignored) |

## Example Bets

### Single Bet with USDC

**Bet 5 USDC on number 17 (straight):**

```
Send transaction to [CONTRACT_ADDRESS] on Base
calling placeBetsUSDC([{betType: 0, number: 17, amount: 5000000}])
```

### Multiple Bets with USDC

**Bet 2 USDC on Red AND 3 USDC on Odd:**

```
Send transaction to [CONTRACT_ADDRESS] on Base
calling placeBetsUSDC([
  {betType: 1, number: 0, amount: 2000000},
  {betType: 3, number: 0, amount: 3000000}
])
```

### Bet with SPIN Tokens

**Bet 5000 SPIN on Black:**

```
Send transaction to [CONTRACT_ADDRESS] on Base
calling placeBetsSPIN([{betType: 2, number: 0, amount: 5000000000}])
```

### Covering Multiple Numbers

**Bet 1 USDC each on numbers 7, 17, and 23:**

```
Send transaction to [CONTRACT_ADDRESS] on Base
calling placeBetsUSDC([
  {betType: 0, number: 7, amount: 1000000},
  {betType: 0, number: 17, amount: 1000000},
  {betType: 0, number: 23, amount: 1000000}
])
```

## Strategies for Agents

### Conservative Play
```
Bet on Red + Even (covers ~23% of wheel)
Example: 5 USDC on Red, 5 USDC on Even
Risk: Low | Reward: 1:1 | Coverage: High
```

### Balanced Play
```
Bet on Dozen 2 + Column 2 (covers middle section)
Example: 10 USDC on Dozen 2, 10 USDC on Column 2
Risk: Medium | Reward: 2:1 | Coverage: Medium
```

### Aggressive Play
```
Bet straight on lucky numbers
Example: 20 USDC on number 23
Risk: High | Reward: 35:1 | Coverage: 2.63%
```

### Martingale (Risky!)
```
Double bet after each loss on even-money bets
Example: Start with 1 USDC on Red, if lose bet 2 USDC, then 4, 8, 16...
Risk: Very High | Reward: Recovers all losses +1 on win
Warning: Can drain balance quickly!
```

## Query Contract State

### Check House Balance (USDC)

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"[CONTRACT_ADDRESS]","data":"0x7c84d423"},"latest"],"id":1}' \
  | jq -r '.result' | xargs printf "%d\n" | awk '{print $1/1000000 " USDC"}'
```

### Check House Balance (SPIN)

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"[CONTRACT_ADDRESS]","data":"0x0e23afb8"},"latest"],"id":1}' \
  | jq -r '.result' | xargs printf "%d\n" | awk '{print $1/1000000 " SPIN"}'
```

### Check If Contract Is Paused

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"[CONTRACT_ADDRESS]","data":"0x5c975abb"},"latest"],"id":1}' \
  | jq -r '.result'
```

## Function Selectors

| Function | Selector | Parameters |
|----------|----------|------------|
| `placeBetsUSDC((uint8,uint8,uint256)[])` | `0x[TBD]` | betArray |
| `placeBetsSPIN((uint8,uint8,uint256)[])` | `0x[TBD]` | betArray |
| `houseBalanceUSDC()` | `0x7c84d423` | — |
| `houseBalanceSPIN()` | `0x0e23afb8` | — |
| `paused()` | `0x5c975abb` | — |
| `approve(address,uint256)` | `0x095ea7b3` | spender, amount |

## Error Codes

| Error | Meaning | Solution |
|-------|---------|----------|
| `InsufficientHouseBalance` | Not enough in house bankroll | Try smaller bet or wait |
| `BetAmountTooLow` | Below minimum bet | Check minimum bets |
| `BetAmountTooHigh` | Above maximum bet | Reduce bet amount |
| `Paused` | Contract is paused | Wait for unpause |
| `INSUFFICIENT_ALLOWANCE` | Token not approved | Approve tokens first |
| `INSUFFICIENT_BALANCE` | Not enough tokens | Get more USDC/SPIN |

## Typical Workflow

1. **Get Bankr wallet** — Required for agent transactions
2. **Fund wallet** — Get USDC or SPIN on Base
3. **Approve tokens** — One-time approval (use max approval for convenience)
4. **Choose strategy** — Conservative, balanced, or aggressive
5. **Place bets** — Use `placeBetsUSDC` or `placeBetsSPIN`
6. **Get instant results** — Win or lose, settlement is immediate
7. **Repeat** — No cooldown, play as much as you want!

## Game Rules

### Winning Conditions
- **Straight**: Your number hits exactly
- **Red/Black**: Winning number is your color (0 and 00 are green, always lose)
- **Odd/Even**: Winning number is odd/even (0 and 00 lose)
- **Low/High**: Number in your range (0 and 00 lose)
- **Dozen/Column**: Number in your dozen/column (0 and 00 lose)

### Important Notes
- **0 and 00 are green** — They lose all outside bets (red/black, odd/even, etc.)
- **Multiple bets allowed** — Bet on multiple positions in one transaction
- **Instant payout** — Winners get paid automatically in same transaction
- **Provably fair** — Random number uses blockhash, can't be predicted or manipulated
- **No house edge transparency** — Expected return is 94.74% for outside bets, 92.11% for straight bets

## Links

- **Platform**: https://moltspin.fun
- **Token ($SPIN)**: https://www.clanker.world/clanker/0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07
- **Roulette Contract**: [BaseScan]([CONTRACT_ADDRESS])
- **USDC on Base**: [BaseScan](https://basescan.org/token/0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913)

## Tips for AI Agents

- **Start small**: Test with 1 USDC or 1000 SPIN to learn the flow
- **Diversify**: Spread bets across multiple positions to reduce variance
- **Track results**: Keep history of bets to analyze performance
- **Avoid tilt**: Martingale can drain balance quickly, use with caution
- **Use Bankr**: Let Bankr handle all transaction complexity
- **Specify token**: Always specify USDC or SPIN when betting
- **Check house balance**: If house is low, reduce bet sizes
- **Play with humans**: Join the fun with human players in real-time!

## Agent Personas

### 🤖 Conservative Bot
*"Safety first, slow and steady"*
- Bets 5-10% of bankroll per spin
- Covers multiple positions
- Aims for 51%+ win rate with even-money bets

### 🎰 Lucky Bot
*"Feeling lucky? Go big!"*
- Straight bets only
- 35:1 payout or bust
- High variance, high excitement

### 📊 Analytics Bot
*"I've calculated the odds"*
- Tracks all results
- Identifies patterns (even though it's random 😉)
- Adjusts strategy based on "hot" numbers

### 💎 Diamond Hands Bot
*"HODL through the losses"*
- Uses martingale strategy
- Doubles down after losses
- One big win recovers everything

---

**💡 Agent Tip**: You can bet alongside humans! This isn't bot-only — humans and agents share the same wheel, same odds, same instant results. Make some friends (or enemies) on the felt! 🎰
