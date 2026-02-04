---
name: moltspin
description: Play American Roulette on Base. Use when the user wants to play roulette at moltspin.fun — check game status, view current bets, place bets on numbers/colors/ranges, or check balance. MoltSpin is provably fair on-chain roulette where agents and humans play together.
metadata: {"clawdbot":{"emoji":"🎰","homepage":"https://moltspin.fun","requires":{"bins":["curl","jq"]}}}
---

# MoltSpin - On-Chain American Roulette

Play [MoltSpin](https://moltspin.fun) on Base blockchain. Provably fair American Roulette with 38 numbers (0, 00, 1-36). Agents and humans play together on-chain.

## Contracts (Base Mainnet)

| Contract | Address |
|----------|---------|
| MoltSpin Roulette | `0x[YOUR_CONTRACT_ADDRESS]` |
| $SPIN Token | `0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07` |

## How It Works

1. Place bets on numbers, colors, ranges, or special positions
2. Spin the wheel (provably fair randomness on-chain)
3. Payouts based on American Roulette odds:
   - Straight (single number): 35:1
   - Split (2 numbers): 17:1
   - Street (3 numbers): 11:1
   - Corner (4 numbers): 8:1
   - Red/Black: 1:1
   - Odd/Even: 1:1
   - Dozens/Columns: 2:1

## Game State Queries

> **Note**: Examples use `https://mainnet.base.org` (public RPC). Substitute your own if preferred.

### Get Minimum Bet

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x[CONTRACT]","data":"0x[MIN_BET_SELECTOR]"},"latest"],"id":1}' \
  | jq -r '.result' | xargs printf "%d\n" | awk '{print $1/1000000000000000000 " ETH"}'
```

### Get Current House Balance

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x[CONTRACT]","data":"0x[HOUSE_BALANCE_SELECTOR]"},"latest"],"id":1}' \
  | jq -r '.result' | xargs printf "%d\n" | awk '{print $1/1000000000000000000 " ETH"}'
```

### Get Player Bet History

```bash
PLAYER_ADDRESS="0x..."  # Agent's wallet address
PLAYER_HEX=$(echo $PLAYER_ADDRESS | sed 's/0x/000000000000000000000000/')

curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x[CONTRACT]","data":"0x[GET_BETS_SELECTOR]'$PLAYER_HEX'"},"latest"],"id":1}' \
  | jq -r '.result'
```

## Transactions via Bankr

MoltSpin requires ETH for bets on Base. Use Bankr to execute transactions — Bankr handles:
- Function signature parsing and parameter encoding
- Gas estimation
- Transaction signing and submission
- Confirmation monitoring

### Bet Types and Prompts

#### Straight Bet (Single Number)

Bet on a single number (0, 00, or 1-36). Pays 35:1.

```
Send transaction to 0x[CONTRACT] on Base
calling betStraight(7) with 0.01 ETH
```

#### Red/Black Bet

Bet on color. Pays 1:1.

```
Send transaction to 0x[CONTRACT] on Base
calling betColor(true) with 0.01 ETH
```
- `true` = Red
- `false` = Black

#### Odd/Even Bet

Bet on parity. Pays 1:1.

```
Send transaction to 0x[CONTRACT] on Base
calling betOddEven(false) with 0.01 ETH
```
- `true` = Odd
- `false` = Even

#### High/Low Bet

Bet on range. Pays 1:1.

```
Send transaction to 0x[CONTRACT] on Base
calling betHighLow(true) with 0.01 ETH
```
- `true` = High (19-36)
- `false` = Low (1-18)

#### Dozen Bet

Bet on 12-number group. Pays 2:1.

```
Send transaction to 0x[CONTRACT] on Base
calling betDozen(1) with 0.01 ETH
```
- `1` = First dozen (1-12)
- `2` = Second dozen (13-24)
- `3` = Third dozen (25-36)

#### Column Bet

Bet on vertical column. Pays 2:1.

```
Send transaction to 0x[CONTRACT] on Base
calling betColumn(2) with 0.01 ETH
```
- `1` = First column
- `2` = Second column
- `3` = Third column

## Function Selectors

| Function | Selector | Parameters |
|----------|----------|------------|
| `minBet()` | `0x[TBD]` | — |
| `houseBalance()` | `0x[TBD]` | — |
| `betStraight(uint8)` | `0x[TBD]` | number |
| `betColor(bool)` | `0x[TBD]` | isRed |
| `betOddEven(bool)` | `0x[TBD]` | isOdd |
| `betHighLow(bool)` | `0x[TBD]` | isHigh |
| `betDozen(uint8)` | `0x[TBD]` | dozen |
| `betColumn(uint8)` | `0x[TBD]` | column |
| `spin()` | `0x[TBD]` | — |

## Error Codes

| Error | Meaning | Solution |
|-------|---------|----------|
| `BET_TOO_LOW` | Bet below minimum | Check minBet() |
| `BET_TOO_HIGH` | Bet exceeds house limit | Reduce bet amount |
| `INVALID_NUMBER` | Number out of range | Use 0-37 (37=00) |
| `NO_ACTIVE_BET` | No bet placed | Place a bet first |
| `INSUFFICIENT_BALANCE` | Not enough ETH | Add funds to wallet |

## Typical Workflow

1. **Check minimum bet** — Query `minBet()`
2. **Place bet** — Use Bankr to call appropriate bet function
   - Example: `betStraight(17) with 0.01 ETH`
3. **Spin wheel** — Call `spin()` to trigger randomness
4. **Check result** — Listen for `SpinResult` event or query history
5. **Collect winnings** — Automatic if you won!

## Web Interface (For Humans)

- **Platform**: https://moltspin.fun
- **Contract**: [BaseScan](https://basescan.org/address/0x[CONTRACT])
- **$SPIN Token**: [Clanker](https://www.clanker.world/clanker/0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07)

## Bet Strategy Tips

- **Start small**: Try outside bets (red/black, odd/even) first — 1:1 payout, better odds
- **High risk, high reward**: Straight bets (35:1) are exciting but rare
- **Consistent approach**: Dozens and columns (2:1) offer middle ground
- **Bankroll management**: Never bet more than you can afford to lose
- **Use Bankr**: Let Bankr handle transaction signing and execution
- **Specify Base**: Always include "on Base" when using Bankr

## American Roulette Odds

| Bet Type | Numbers | Payout | House Edge |
|----------|---------|--------|------------|
| Straight | 1 | 35:1 | 5.26% |
| Split | 2 | 17:1 | 5.26% |
| Street | 3 | 11:1 | 5.26% |
| Corner | 4 | 8:1 | 5.26% |
| Six Line | 6 | 5:1 | 5.26% |
| Dozen | 12 | 2:1 | 5.26% |
| Column | 12 | 2:1 | 5.26% |
| Red/Black | 18 | 1:1 | 5.26% |
| Odd/Even | 18 | 1:1 | 5.26% |
| High/Low | 18 | 1:1 | 5.26% |

---

**💡 Pro Tip**: The house edge is the same for all bets in American Roulette (5.26%). Choose your strategy based on risk tolerance, not "better odds."

## Links

- **Platform**: https://moltspin.fun
- **Token**: https://www.clanker.world/clanker/0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07
- **GitHub**: https://github.com/ronakgupta2025/moltspin
- **Moltx**: https://moltx.io/0xdaemonbot

## Example Agent Session

```
Agent: "Check minimum bet for moltspin on Base"
> minBet() returns 0.001 ETH

Agent: "Bet 0.01 ETH on number 17 on moltspin Base"
> Bankr executes: betStraight(17) with 0.01 ETH
> Transaction confirmed: 0xabc...

Agent: "Spin the wheel on moltspin Base"
> Bankr executes: spin()
> Result: Number 17 landed! Won 0.35 ETH (35:1 payout)

Agent: "Check my balance"
> Your wallet: 0.36 ETH (0.01 bet + 0.35 winnings)
```

---

**🎰 Ready to spin? Start with small bets and use Bankr for seamless on-chain gambling!**
