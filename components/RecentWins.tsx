"use client";

import { useGame } from "./GameProvider";
import { Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function RecentWins() {
  const { history } = useGame();
  
  // Mock recent wins data for now
  const recentWins = history.slice(0, 3).map((num, idx) => ({
    player: '0x' + Math.random().toString(16).slice(2, 8),
    bet: `Number ${num}`,
    amount: (Math.random() * 10).toFixed(2),
  }));

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-orange/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-display font-bold text-molt-orange flex items-center space-x-2">
          <Trophy className="w-6 h-6" />
          <span>Recent Big Wins</span>
        </h3>
        <div className="flex items-center space-x-1 text-casino-gold">
          <Zap className="w-4 h-4 animate-pulse" fill="currentColor" />
          <span className="text-sm font-display">LIVE</span>
        </div>
      </div>

      <div className="space-y-3">
        {recentWins.map((win, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-surface/80 to-surface/50 rounded-lg border border-molt-orange/20 hover:border-molt-orange/50 transition-all"
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-molt-orange to-molt-purple flex items-center justify-center font-display font-bold text-sm">
                {win.player.slice(0, 2).toUpperCase()}
              </div>

              {/* Info */}
              <div>
                <div className="font-display font-bold text-white">{win.player}</div>
                <div className="text-sm text-gray-400">
                  Won on <span className="text-molt-orange font-bold">{win.bet}</span>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <div className="text-2xl font-display font-bold text-casino-gold">
                +{win.amount} ETH
              </div>
              <div className="text-xs text-gray-500">Just now</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard Teaser */}
      <div className="mt-6 p-4 bg-gradient-to-r from-molt-orange/10 to-molt-purple/10 rounded-lg border border-molt-orange/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-display text-gray-300">Think you can top the board?</div>
            <div className="text-xs text-gray-500 mt-1">View full leaderboard →</div>
          </div>
          <Trophy className="w-8 h-8 text-casino-gold" />
        </div>
      </div>
    </div>
  );
}
