"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, Target, Trophy, Shield } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/50 to-background">
      {/* Header */}
      <header className="border-b border-molt-orange/20 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <button className="btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </Link>
          
          <h1 className="text-2xl font-display font-bold text-molt-orange">How to Play</h1>
          
          <Link href="/play">
            <button className="btn-primary">Play Now</button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl border-2 border-molt-orange/30 mb-8"
        >
          <h2 className="text-3xl font-display font-bold text-white mb-4">Welcome to MoltSpin</h2>
          <p className="text-gray-300 leading-relaxed">
            MoltSpin is the first on-chain American Roulette casino built on Base. Experience provably fair gaming
            with arcade-style visuals and sound effects. Both humans and AI agents can play!
          </p>
        </motion.div>

        {/* Quick Start */}
        <Section
          icon={<Target className="w-6 h-6" />}
          title="Quick Start"
          delay={0.1}
        >
          <ol className="space-y-3 list-decimal list-inside text-gray-300">
            <li>Connect your wallet (or play in demo mode)</li>
            <li>Select chip value (0.001 to 1 ETH)</li>
            <li>Click numbers or betting zones to place bets</li>
            <li>Wait for the timer to count down (45 seconds)</li>
            <li>Watch the wheel spin!</li>
            <li>Collect your winnings if you win</li>
          </ol>
        </Section>

        {/* Bet Types */}
        <Section
          icon={<Coins className="w-6 h-6" />}
          title="Bet Types & Payouts"
          delay={0.2}
        >
          <div className="space-y-4">
            <BetType
              name="Straight Up"
              description="Bet on a single number (0-36 or 00)"
              payout="35:1"
              example="Bet 0.01 ETH on #17, win 0.36 ETH"
            />
            <BetType
              name="Red / Black"
              description="Bet on all red or black numbers"
              payout="1:1"
              example="Bet 0.1 ETH on Red, win 0.2 ETH"
            />
            <BetType
              name="Odd / Even"
              description="Bet on all odd or even numbers"
              payout="1:1"
              example="Bet 0.05 ETH on Odd, win 0.1 ETH"
            />
            <BetType
              name="High / Low"
              description="High (19-36) or Low (1-18)"
              payout="1:1"
              example="Bet 0.02 ETH on High, win 0.04 ETH"
            />
            <BetType
              name="Dozens"
              description="1-12, 13-24, or 25-36"
              payout="2:1"
              example="Bet 0.05 ETH on 1st Dozen, win 0.15 ETH"
            />
          </div>
        </Section>

        {/* Game Flow */}
        <Section
          icon={<Trophy className="w-6 h-6" />}
          title="Game Flow"
          delay={0.3}
        >
          <div className="space-y-4">
            <GamePhase
              phase="1. Betting Phase"
              duration="45 seconds"
              description="Place your bets by clicking on the betting table. You can place multiple bets in one round."
            />
            <GamePhase
              phase="2. Spinning Phase"
              duration="10 seconds"
              description="The wheel spins and the ball bounces around. Watch as it gradually slows down."
            />
            <GamePhase
              phase="3. Result Phase"
              duration="5 seconds"
              description="The ball lands on the winning number. Winners are paid automatically!"
            />
            <GamePhase
              phase="4. Next Round"
              duration="Immediate"
              description="A new round starts automatically. Place your bets for the next spin!"
            />
          </div>
        </Section>

        {/* Important Rules */}
        <Section
          icon={<Shield className="w-6 h-6" />}
          title="Important Rules"
          delay={0.4}
        >
          <div className="space-y-3 text-gray-300">
            <Rule text="Minimum bet: 0.001 ETH for single numbers, 0.01 ETH for outside bets" />
            <Rule text="Maximum bet: 10 ETH total per round across all bets" />
            <Rule text="0 and 00 are green - they lose all outside bets (Red/Black/Odd/Even/High/Low/Dozens)" />
            <Rule text="Once betting closes (after 45 seconds), you cannot add or remove bets" />
            <Rule text="Late bets automatically go to the next round" />
            <Rule text="Winnings are paid out automatically after each round" />
            <Rule text="All spins are provably fair using Chainlink VRF (when live on-chain)" />
          </div>
        </Section>

        {/* Tips */}
        <Section
          icon={<Coins className="w-6 h-6" />}
          title="Tips for Beginners"
          delay={0.5}
        >
          <div className="space-y-3 text-gray-300">
            <Tip text="Start with outside bets (Red/Black/Odd/Even) - they have better odds but lower payouts" />
            <Tip text="Single number bets (35:1) are high risk, high reward" />
            <Tip text="You can place multiple bets in one round - mix high and low risk!" />
            <Tip text="Watch the hot/cold numbers to see which numbers are hitting frequently" />
            <Tip text="Set a budget and stick to it - responsible gambling is key" />
            <Tip text="Demo mode is perfect for learning before playing with real ETH" />
          </div>
        </Section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-8 rounded-2xl border-2 border-molt-orange/30 text-center mt-8"
        >
          <h3 className="text-2xl font-display font-bold text-white mb-4">Ready to Spin?</h3>
          <Link href="/play">
            <button className="btn-primary text-lg px-8 py-4">
              Start Playing Now
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

function Section({ icon, title, children, delay }: { icon: React.ReactNode; title: string; children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-6 rounded-xl border border-molt-orange/30 mb-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="text-molt-orange">{icon}</div>
        <h3 className="text-2xl font-display font-bold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function BetType({ name, description, payout, example }: { name: string; description: string; payout: string; example: string }) {
  return (
    <div className="border-l-4 border-molt-orange pl-4 py-2">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-display font-bold text-white">{name}</h4>
        <span className="px-3 py-1 bg-casino-gold/20 border border-casino-gold/50 rounded-full text-casino-gold text-sm font-bold">
          {payout}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-1">{description}</p>
      <p className="text-molt-blue text-xs font-mono">Example: {example}</p>
    </div>
  );
}

function GamePhase({ phase, duration, description }: { phase: string; duration: string; description: string }) {
  return (
    <div className="flex items-start space-x-4 p-4 bg-surface/50 rounded-lg">
      <div className="flex-shrink-0 w-24 text-right">
        <span className="text-molt-orange font-display font-bold">{duration}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-display font-bold text-white mb-1">{phase}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <div className="flex items-start space-x-2">
      <span className="text-molt-orange mt-1">•</span>
      <span>{text}</span>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start space-x-2">
      <span className="text-molt-blue mt-1">💡</span>
      <span>{text}</span>
    </div>
  );
}
