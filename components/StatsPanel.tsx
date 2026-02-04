"use client";

import { useGame } from "./GameProvider";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function StatsPanel() {
  const { balance } = useGame();

  const stats = {
    totalBets: 142,
    totalWagered: 15.3,
    totalWon: 18.7,
    profitLoss: 3.4,
    winRate: 42.3,
    biggestWin: 5.2,
  };

  return (
    <div className="glass p-6 rounded-2xl border-2 border-molt-purple/30">
      <h3 className="text-xl font-display font-bold text-molt-purple mb-4">Your Stats</h3>

      <div className="space-y-4">
        {/* Profit/Loss */}
        <div className="p-4 bg-surface/50 rounded-lg border-2 border-casino-gold/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 uppercase">Total P/L</span>
            {stats.profitLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div
            className={`text-3xl font-display font-bold ${
              stats.profitLoss >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {stats.profitLoss >= 0 ? "+" : ""}
            {stats.profitLoss} ETH
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-surface/50 rounded-lg text-center">
            <div className="text-xl font-display font-bold text-white">{stats.totalBets}</div>
            <div className="text-xs text-gray-500 uppercase">Total Bets</div>
          </div>
          <div className="p-3 bg-surface/50 rounded-lg text-center">
            <div className="text-xl font-display font-bold text-molt-orange">
              {stats.winRate}%
            </div>
            <div className="text-xs text-gray-500 uppercase">Win Rate</div>
          </div>
        </div>

        {/* Wagered vs Won */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-surface/50 rounded">
            <span className="text-sm text-gray-400">Total Wagered</span>
            <span className="font-mono text-white">{stats.totalWagered} ETH</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface/50 rounded">
            <span className="text-sm text-gray-400">Total Won</span>
            <span className="font-mono text-green-500">{stats.totalWon} ETH</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-surface/50 rounded border-2 border-casino-gold/30">
            <span className="text-sm text-gray-400 font-bold">Biggest Win</span>
            <span className="font-mono text-casino-gold font-bold">
              {stats.biggestWin} ETH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
