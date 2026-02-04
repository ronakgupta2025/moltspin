"use client";

import { useGame } from "./GameProvider";
import { Wallet, Zap } from "lucide-react";

export default function Header() {
  const { balance } = useGame();

  return (
    <header className="border-b border-molt-orange/30 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-molt-orange to-casino-red rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-molt-orange via-molt-purple to-molt-blue neon-text">
              MOLTSPIN
            </h1>
            <p className="text-xs text-gray-400 font-mono">.fun</p>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="stat-card">
            <div className="text-xs text-gray-400 uppercase">Total Players</div>
            <div className="text-xl font-display font-bold text-molt-orange">1,247</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-gray-400 uppercase">Today's Volume</div>
            <div className="text-xl font-display font-bold text-molt-blue">$12,450</div>
          </div>
        </div>

        {/* Wallet */}
        <div className="flex items-center space-x-4">
          {/* Balance */}
          <div className="glass px-4 py-2 rounded-lg border-2 border-casino-gold/50">
            <div className="text-xs text-gray-400">Balance</div>
            <div className="text-lg font-display font-bold text-casino-gold">
              {balance.toFixed(3)} ETH
            </div>
          </div>

          {/* Connect Wallet Button */}
          <button className="btn-primary flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Demo Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
