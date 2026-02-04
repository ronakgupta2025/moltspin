"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Calendar, Coins } from "lucide-react";

export default function ProfilePage() {
  // Mock data - will be replaced with real data
  const stats = {
    totalBets: 142,
    totalWagered: 15.3,
    totalWon: 18.7,
    profitLoss: 3.4,
    winRate: 42.3,
    biggestWin: 5.2,
    gamesPlayed: 89,
    favoriteNumber: 17,
    longestStreak: 7,
  };

  const recentGames = [
    { id: 1, round: 145, bet: "Red", amount: 0.05, result: "Win", payout: 0.1, number: 17 },
    { id: 2, round: 144, bet: "#23", amount: 0.01, result: "Loss", payout: 0, number: 8 },
    { id: 3, round: 143, bet: "Odd", amount: 0.03, result: "Win", payout: 0.06, number: 19 },
    { id: 4, round: 142, bet: "Black", amount: 0.02, result: "Loss", payout: 0, number: 5 },
    { id: 5, round: 141, bet: "#17", amount: 0.01, result: "Win", payout: 0.36, number: 17 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/50 to-background">
      {/* Header */}
      <header className="border-b border-molt-orange/20 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/play">
            <button className="btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Game</span>
            </button>
          </Link>
          
          <h1 className="text-2xl font-display font-bold text-molt-orange">Player Profile</h1>
          
          <div className="w-32" /> {/* Spacer */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl border-2 border-molt-orange/30 mb-8"
        >
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-molt-orange to-molt-purple flex items-center justify-center text-4xl font-display font-bold">
              P
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Player #1337</h2>
              <p className="text-gray-400">Member since: January 2026</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="px-3 py-1 bg-casino-gold/20 border border-casino-gold/50 rounded-full text-casino-gold text-sm font-bold">
                  🏆 High Roller
                </span>
                <span className="px-3 py-1 bg-molt-blue/20 border border-molt-blue/50 rounded-full text-molt-blue text-sm font-bold">
                  Level 12
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Trophy className="w-6 h-6" />}
            label="Total Games"
            value={stats.gamesPlayed.toString()}
            color="orange"
          />
          <StatCard
            icon={<Coins className="w-6 h-6" />}
            label="Total Wagered"
            value={`${stats.totalWagered} ETH`}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Win Rate"
            value={`${stats.winRate}%`}
            color="green"
          />
          <StatCard
            icon={stats.profitLoss >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            label="Total P/L"
            value={`${stats.profitLoss >= 0 ? "+" : ""}${stats.profitLoss} ETH`}
            color={stats.profitLoss >= 0 ? "green" : "red"}
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-6 rounded-xl border border-molt-orange/30"
          >
            <h3 className="text-xl font-display font-bold text-molt-orange mb-4">Performance</h3>
            <div className="space-y-4">
              <StatRow label="Total Bets Placed" value={stats.totalBets.toString()} />
              <StatRow label="Total Won" value={`${stats.totalWon} ETH`} />
              <StatRow label="Biggest Win" value={`${stats.biggestWin} ETH`} />
              <StatRow label="Longest Win Streak" value={`${stats.longestStreak} games`} />
              <StatRow label="Favorite Number" value={`#${stats.favoriteNumber}`} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-xl border border-molt-purple/30"
          >
            <h3 className="text-xl font-display font-bold text-molt-purple mb-4">Achievements</h3>
            <div className="space-y-3">
              <AchievementBadge title="First Spin" description="Placed your first bet" unlocked />
              <AchievementBadge title="Lucky Number" description="Hit your lucky number 3 times" unlocked />
              <AchievementBadge title="High Roller" description="Bet 10 ETH in total" unlocked />
              <AchievementBadge title="Perfect 10" description="Win 10 games in a row" unlocked={false} />
              <AchievementBadge title="Whale" description="Bet 100 ETH in total" unlocked={false} />
            </div>
          </motion.div>
        </div>

        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-xl border border-molt-orange/30"
        >
          <h3 className="text-xl font-display font-bold text-molt-orange mb-4">Recent Games</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-molt-orange/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-display text-sm">Round</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-display text-sm">Bet</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-display text-sm">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-display text-sm">Result</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-display text-sm">Number</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-display text-sm">Payout</th>
                </tr>
              </thead>
              <tbody>
                {recentGames.map((game) => (
                  <tr key={game.id} className="border-b border-molt-orange/10 hover:bg-molt-orange/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">#{game.round}</td>
                    <td className="py-3 px-4 font-bold text-sm">{game.bet}</td>
                    <td className="py-3 px-4 font-mono text-sm">{game.amount} ETH</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        game.result === "Win" 
                          ? "bg-green-500/20 text-green-500" 
                          : "bg-red-500/20 text-red-500"
                      }`}>
                        {game.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">#{game.number}</td>
                    <td className="py-3 px-4 text-right font-mono text-sm font-bold">
                      {game.payout > 0 ? (
                        <span className="text-green-500">+{game.payout} ETH</span>
                      ) : (
                        <span className="text-gray-500">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses = {
    orange: "border-molt-orange/30 text-molt-orange",
    blue: "border-molt-blue/30 text-molt-blue",
    purple: "border-molt-purple/30 text-molt-purple",
    green: "border-green-500/30 text-green-500",
    red: "border-red-500/30 text-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass p-6 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-center space-x-3 mb-2">
        {icon}
        <span className="text-sm text-gray-400 uppercase">{label}</span>
      </div>
      <div className="text-2xl font-display font-bold">{value}</div>
    </motion.div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className="font-display font-bold text-white">{value}</span>
    </div>
  );
}

function AchievementBadge({ title, description, unlocked }: { title: string; description: string; unlocked: boolean }) {
  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg ${
      unlocked ? "bg-casino-gold/10 border border-casino-gold/30" : "bg-surface/50 border border-white/10 opacity-50"
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        unlocked ? "bg-casino-gold text-white" : "bg-gray-700 text-gray-500"
      }`}>
        {unlocked ? "🏆" : "🔒"}
      </div>
      <div>
        <div className="font-display font-bold text-sm text-white">{title}</div>
        <div className="text-xs text-gray-400">{description}</div>
      </div>
    </div>
  );
}
