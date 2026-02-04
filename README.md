# MoltSpin UI - American Roulette Casino Frontend

Arcade-style American Roulette casino interface built with Next.js 14, TypeScript, and Framer Motion.

## 🎨 Features

✅ **Arcade/Casino Aesthetic**
- Neon glow effects
- Retro CRT scanlines
- Molt orange/purple/blue color scheme
- Casino felt textures

✅ **Fully Functional Demo Mode**
- Continuous rounds (60s cycles)
- Live betting with chips
- Spinning wheel animation
- Win/loss calculation
- Balance tracking

✅ **Complete Components**
- Animated roulette wheel (2D, upgradeable to 3D)
- Betting table with all bet types
- Chip selection & betting controls
- Real-time game info & timer
- Player stats panel
- Recent wins feed
- Responsive design (mobile-friendly)

✅ **Betting Options**
- Single numbers (35:1)
- Red/Black (1:1)
- Odd/Even (1:1)
- High/Low (1:1)
- Dozens (2:1)
- Multiple bets in one round

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
moltspin-ui/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx             # Main game page
│   └── globals.css          # Global styles + arcade effects
├── components/
│   ├── GameProvider.tsx     # Game state management (demo logic)
│   ├── Header.tsx           # Top bar with wallet/balance
│   ├── RouletteWheel.tsx    # Animated spinning wheel
│   ├── BettingTable.tsx     # Number grid + outside bets
│   ├── BettingControls.tsx  # Chip selector + bet actions
│   ├── GameInfo.tsx         # Timer + round info
│   ├── StatsPanel.tsx       # Player statistics
│   └── RecentWins.tsx       # Live wins feed
├── package.json
├── tailwind.config.ts       # Arcade color scheme
├── tsconfig.json
└── README.md
```

---

## 🎮 How It Works (Demo Mode)

### Game Loop
1. **Betting Phase** (45 seconds)
   - Players place bets by clicking table
   - Multiple bets allowed
   - Balance updates in real-time

2. **Spinning Phase** (10 seconds)
   - Wheel spins with animation
   - VRF randomness (simulated)
   - Suspenseful timer countdown

3. **Result Phase** (5 seconds)
   - Winning number revealed
   - Payouts calculated automatically
   - Balance updated
   - New round starts

### State Management
All game state lives in `GameProvider.tsx`:
- Round status (betting/spinning/result)
- Player bets array
- Balance tracking
- Timer countdown
- Number history

No blockchain needed for demo - perfect for UI testing!

---

## 🎨 Customization

### Colors (tailwind.config.ts)
```typescript
molt: {
  orange: "#FF6B35",  // Primary brand
  purple: "#9D4EDD",  // Accent
  blue: "#06FFF0",    // Base chain
}
casino: {
  red: "#DC2626",     // Red numbers
  green: "#10B981",   // 0/00
  gold: "#FFD60A",    // Wins/highlights
}
```

### Animations
Adjust in `globals.css`:
- `neon-text` - Glowing text effect
- `neon-border` - Glowing borders
- `crt-effect` - Retro scanlines
- `glow-pulse` - Pulsing animation

### Fonts
- **Display:** Orbitron (headers, numbers)
- **Body:** Inter (text)
- **Mono:** JetBrains Mono (stats, code)

---

## 🔧 Integration Roadmap

### Phase 1: Demo (Current) ✅
- [x] Full UI with fake data
- [x] All bet types working
- [x] Animations & effects
- [x] Responsive design

### Phase 2: Blockchain Integration
- [ ] Connect wagmi + viem
- [ ] Smart contract integration
- [ ] Real wallet connection
- [ ] Transaction signing
- [ ] Event listening (VRF callback)

### Phase 3: Backend API
- [ ] Connect to database
- [ ] Real player stats
- [ ] Leaderboard data
- [ ] Transaction history
- [ ] WebSocket for live updates

### Phase 4: Advanced Features
- [ ] 3D wheel (Three.js/Babylon.js)
- [ ] Sound effects
- [ ] Chat system
- [ ] NFT cosmetics
- [ ] Mobile PWA

---

## 🎯 Next Steps

1. **Test the UI**
   ```bash
   npm run dev
   ```
   Play around, place bets, watch rounds complete!

2. **Add Web3**
   - Install wagmi, viem
   - Connect to smart contract
   - Replace demo logic with blockchain calls

3. **Add Backend**
   - Set up PostgreSQL
   - Create API routes
   - Track real player data

4. **Deploy**
   - Vercel (recommended for Next.js)
   - Connect custom domain
   - Enable analytics

---

## 🐛 Known Limitations (Demo Mode)

- **No persistence** - Refresh resets everything
- **Fake balance** - Starts with 10 ETH
- **No real randomness** - Uses Math.random()
- **No multiplayer** - Just local state
- **No database** - No stats saved

All of these will be fixed when integrating with the smart contract and backend!

---

## 💡 Tips

### Mobile Testing
```bash
# Find your local IP
ipconfig getifaddr en0  # macOS
# Then visit: http://YOUR_IP:3000 on mobile
```

### Performance
- Framer Motion animations are GPU-accelerated
- Tailwind CSS purges unused styles in production
- Next.js optimizes images automatically

### Debugging
- Open browser DevTools
- Check console for game state logs
- React DevTools shows component tree

---

## 🤝 Contributing

This is an internal project, but feel free to:
- Suggest UI improvements
- Report bugs
- Add more animations
- Improve mobile experience

---

## 📸 Screenshots

*Coming soon - take screenshots after first run!*

---

## 🎰 Let's Ship It!

The UI is ready for demo. Next steps:
1. Run `npm install && npm run dev`
2. Test all betting scenarios
3. Show it to stakeholders
4. Start blockchain integration

**Built with ❤️ for the Molt community**
