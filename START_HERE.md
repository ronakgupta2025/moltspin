# 🚀 MoltSpin UI - Quick Start Guide

## ⚡ Get Running in 2 Minutes

### Step 1: Install Dependencies
```bash
cd /Users/ronak/.openclaw/workspace/projects/roulette-game/moltspin-ui
npm install
```

*This will install:*
- Next.js 14
- React 18
- Framer Motion (animations)
- Tailwind CSS (styling)
- Lucide React (icons)
- TypeScript

**Expected time:** ~1-2 minutes

---

### Step 2: Start Development Server
```bash
npm run dev
```

*Server will start on:* **http://localhost:3000**

Open your browser and navigate to that URL!

---

## 🎮 What You'll See

### Homepage Features:

1. **Animated Roulette Wheel** (center)
   - Spinning animation
   - Live countdown timer
   - Winning number display
   - Number history (last 10 spins)

2. **Betting Table** (bottom)
   - Click numbers to bet (0-36 + 00)
   - Outside bets (Red/Black/Odd/Even/High/Low)
   - Dozen bets
   - Bet counter badges

3. **Betting Controls**
   - Chip selector (0.001 to 1 ETH)
   - Total bet display
   - Clear bets button
   - Confirm bets button

4. **Game Info Panel** (right sidebar)
   - Round timer with progress bar
   - Active players count
   - Round pot size

5. **Player Stats**
   - Total profit/loss
   - Win rate
   - Biggest win
   - Betting history

6. **Recent Wins Feed**
   - Live wins from other "players" (demo data)

---

## 🎯 Try These Actions

1. **Select a chip value** (click the chip buttons)
2. **Place bets** (click on numbers or betting zones)
3. **Watch the round complete** (45s betting → 10s spinning → 5s result)
4. **See your balance update** (wins added, losses deducted)
5. **Start new round** (automatic, repeats every 60s)

---

## 🎨 Demo Mode Features

✅ **10 ETH starting balance**  
✅ **Continuous rounds** (auto-restart)  
✅ **Working bet logic** (all bet types functional)  
✅ **Win/loss calculations** (accurate payouts)  
✅ **Responsive design** (try on mobile!)  

---

## 📱 Mobile Testing

### On macOS:
```bash
# Get your local IP
ipconfig getifaddr en0

# Then visit on your phone:
# http://YOUR_IP:3000
```

---

## 🎨 Arcade Style Elements

Look for these design features:

- **Neon glow effects** (orange/purple/blue)
- **CRT scanlines** (subtle retro effect)
- **Glass morphism** (frosted glass panels)
- **Gradient backgrounds**
- **Smooth animations** (Framer Motion)
- **Custom fonts** (Orbitron for headers)

---

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Dependencies not installing?
```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?
```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 🔧 Project Structure

```
moltspin-ui/
├── app/
│   ├── page.tsx           ← Main game page
│   ├── layout.tsx         ← Root layout
│   └── globals.css        ← Arcade styles
├── components/
│   ├── GameProvider.tsx   ← Game logic (demo mode)
│   ├── RouletteWheel.tsx  ← Spinning wheel
│   ├── BettingTable.tsx   ← Number grid
│   ├── BettingControls.tsx ← Chip selector
│   ├── GameInfo.tsx       ← Timer & stats
│   ├── StatsPanel.tsx     ← Player stats
│   └── RecentWins.tsx     ← Live feed
├── package.json
└── tailwind.config.ts     ← Color scheme
```

---

## 🎯 Next Steps After Testing

### Phase 1: Test Everything ✅
- [ ] Place different bet types
- [ ] Watch multiple rounds
- [ ] Test on mobile
- [ ] Check all animations

### Phase 2: Smart Contract Integration
- [ ] Install wagmi + viem
- [ ] Connect to Roulette contract
- [ ] Replace demo logic
- [ ] Add wallet connection

### Phase 3: Backend API
- [ ] Set up PostgreSQL
- [ ] Create API routes
- [ ] Track real stats
- [ ] WebSocket updates

### Phase 4: Production Deploy
- [ ] Deploy to Vercel
- [ ] Custom domain
- [ ] Analytics
- [ ] Launch! 🚀

---

## 💡 Customization Ideas

### Easy Tweaks:
1. **Change colors** → Edit `tailwind.config.ts`
2. **Adjust timings** → Edit `GameProvider.tsx` (line 42)
3. **Starting balance** → Edit `GameProvider.tsx` (line 38)
4. **Chip values** → Edit `BettingControls.tsx` (line 6)

### Advanced:
1. **Add 3D wheel** → Integrate Three.js or Babylon.js
2. **Sound effects** → Use Howler.js or Web Audio API
3. **Particles** → Use react-particles or canvas
4. **Chat system** → WebSocket + UI component

---

## 📞 Need Help?

Issues? Questions?
1. Check browser console for errors
2. Read component comments in code
3. Check Next.js docs: https://nextjs.org/docs
4. Check Framer Motion: https://www.framer.com/motion/

---

## 🎉 You're Ready!

Run this command and see your casino come to life:

```bash
cd /Users/ronak/.openclaw/workspace/projects/roulette-game/moltspin-ui
npm install
npm run dev
```

Then open: **http://localhost:3000**

**Have fun! 🎰🔥**
