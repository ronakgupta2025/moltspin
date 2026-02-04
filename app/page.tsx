"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Trophy, Users, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/50 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-molt-orange/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-molt-purple/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-molt-orange/20 bg-surface/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-molt-orange to-casino-red rounded-full flex items-center justify-center shadow-neon">
              <Zap className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-molt-orange via-molt-purple to-molt-blue">
                MOLTSPIN
              </h1>
              <p className="text-xs text-gray-400 font-mono">.fun</p>
            </div>
          </div>
          
          <Link href="/play">
            <button className="btn-primary">
              Launch App
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-molt-orange/20 border border-molt-orange/50 rounded-full text-molt-orange font-display text-sm font-bold uppercase tracking-wider">
                🎰 Launching Soon
              </span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-molt-orange via-molt-purple to-molt-blue">
                First On-Chain
              </span>
              <br />
              <span className="text-white">American Roulette</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience the thrill of arcade-style casino gaming on <span className="text-molt-blue font-bold">Base</span>.
              <br />
              Provably fair spins. Stunning visuals. AI agents welcome.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/play">
                <motion.button
                  className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/rules">
                <motion.button
                  className="btn-secondary text-lg px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  How to Play
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto"
          >
            <div className="glass p-6 rounded-xl border border-molt-orange/30">
              <div className="text-3xl font-display font-bold text-molt-orange mb-1">35:1</div>
              <div className="text-sm text-gray-400">Max Payout</div>
            </div>
            <div className="glass p-6 rounded-xl border border-molt-purple/30">
              <div className="text-3xl font-display font-bold text-molt-purple mb-1">100%</div>
              <div className="text-sm text-gray-400">On-Chain</div>
            </div>
            <div className="glass p-6 rounded-xl border border-molt-blue/30">
              <div className="text-3xl font-display font-bold text-molt-blue mb-1">60s</div>
              <div className="text-sm text-gray-400">Per Round</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-3xl font-display font-bold text-center mb-12 text-white">
            Why <span className="text-molt-orange">MoltSpin</span>?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Provably Fair"
              description="Chainlink VRF ensures every spin is random and verifiable on-chain."
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Arcade Vibes"
              description="Stunning 2D wheel with depth effects, animations, and sound effects."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="AI Agents"
              description="Built for both humans and AI agents to play seamlessly."
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="Big Payouts"
              description="Up to 35:1 on single number bets. Win big with every spin!"
            />
          </div>
        </motion.div>
      </section>

      {/* Agent Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-molt-purple/20 border border-molt-purple/50 rounded-full text-molt-purple font-display text-sm font-bold uppercase tracking-wider">
                🤖 For AI Agents
              </span>
            </div>
            <h3 className="text-4xl font-display font-bold mb-4 text-white">
              Agents, Start Here
            </h3>
            <p className="text-gray-300 text-lg">
              Read <code className="text-molt-orange bg-surface px-2 py-1 rounded">SKILL.md</code> to learn how to play via Bankr
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass p-6 rounded-xl border border-molt-purple/30">
              <h4 className="text-xl font-display font-bold text-molt-purple mb-3">Quick Start</h4>
              <ol className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-molt-orange font-bold mr-2">1.</span>
                  <span>Get <a href="https://github.com/yourusername/bankr" className="text-molt-blue hover:underline" target="_blank" rel="noopener">Bankr wallet</a> for agent transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-molt-orange font-bold mr-2">2.</span>
                  <span>Fund with USDC or SPIN tokens on Base</span>
                </li>
                <li className="flex items-start">
                  <span className="text-molt-orange font-bold mr-2">3.</span>
                  <span>Approve contract to spend tokens</span>
                </li>
                <li className="flex items-start">
                  <span className="text-molt-orange font-bold mr-2">4.</span>
                  <span>Place bets using <code className="text-molt-orange bg-surface/50 px-1 rounded">placeBetsUSDC</code> or <code className="text-molt-orange bg-surface/50 px-1 rounded">placeBetsSPIN</code></span>
                </li>
                <li className="flex items-start">
                  <span className="text-molt-orange font-bold mr-2">5.</span>
                  <span>Get instant results & automatic payouts!</span>
                </li>
              </ol>
            </div>

            <div className="glass p-6 rounded-xl border border-molt-orange/30">
              <h4 className="text-xl font-display font-bold text-molt-orange mb-3">Betting Example</h4>
              <div className="bg-surface/50 p-4 rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                <div className="text-molt-blue mb-2">// Bet 5 USDC on Red</div>
                <div className="whitespace-pre-wrap">
{`Send transaction to [CONTRACT] on Base
calling placeBetsUSDC([{
  betType: 1,
  number: 0,
  amount: 5000000
}])`}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <span className="text-molt-green">✓</span> Instant settlement
                <br />
                <span className="text-molt-green">✓</span> Automatic payout if win
                <br />
                <span className="text-molt-green">✓</span> Provably fair on-chain
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/skill" className="inline-block">
              <motion.button
                className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>📖 Read Full SKILL.md</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              Complete guide with bet types, strategies, and contract details
            </p>
          </div>
        </motion.div>
      </section>

      {/* CTA for Humans */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass p-12 rounded-2xl border-2 border-molt-orange/30 text-center"
        >
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-molt-orange/20 border border-molt-orange/50 rounded-full text-molt-orange font-display text-sm font-bold uppercase tracking-wider">
              👤 For Humans
            </span>
          </div>
          <h3 className="text-4xl font-display font-bold mb-4 text-white">
            Ready to Spin?
          </h3>
          <p className="text-gray-300 mb-8 text-lg">
            Get in early on the first on-chain American Roulette. Alpha access available now!
          </p>
          <Link href="/play">
            <motion.button
              className="btn-primary text-xl px-10 py-5 flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Playing</span>
              <Zap className="w-5 h-5" fill="currentColor" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-molt-orange/20 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p className="font-display">
            MoltSpin • Built on <span className="text-molt-blue">Base</span> • Powered by{" "}
            <span className="text-molt-orange">Molts</span>
          </p>
          <p className="text-sm mt-2">Demo Mode • Blockchain integration coming soon</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="/rules" className="hover:text-molt-orange transition-colors">Rules</Link>
            <Link href="/play" className="hover:text-molt-orange transition-colors">Play</Link>
            <a href="https://www.clanker.world/clanker/0x0e77F5Fd459d080EEc6C6A5cB903F66D2af1Cb07" 
               target="_blank" 
               rel="noopener noreferrer"
               className="hover:text-molt-orange transition-colors">
              Token
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="glass p-6 rounded-xl border border-molt-orange/20 hover:border-molt-orange/50 transition-all"
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className="text-molt-orange mb-4">{icon}</div>
      <h4 className="text-xl font-display font-bold mb-2 text-white">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
}
