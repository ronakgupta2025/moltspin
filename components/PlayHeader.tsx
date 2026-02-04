'use client';

import Link from 'next/link';
import { useGame } from './GameProvider';
import ConnectWallet from './ConnectWallet';
import { Zap, User, ArrowLeft, Coins } from 'lucide-react';

export default function PlayHeader() {
  const { balance, selectedToken, isConnected } = useGame();

  const tokenSymbol = selectedToken === 'USDC' ? 'USDC' : 'SPIN';
  const formattedBalance = parseFloat(balance).toLocaleString(undefined, {
    maximumFractionDigits: selectedToken === 'USDC' ? 2 : 0,
  });

  return (
    <header className="border-b border-molt-orange/30 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Back */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-molt-orange transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-display hidden sm:inline">Home</span>
            </button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-molt-orange to-casino-red rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-molt-orange via-molt-purple to-molt-blue">
                MOLTSPIN
              </h1>
            </div>
          </div>
        </div>

        {/* Center Stats */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="stat-card">
            <div className="text-xs text-gray-400 uppercase">Network</div>
            <div className="text-lg font-display font-bold text-molt-blue flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Base
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-gray-400 uppercase">Contract</div>
            <a 
              href="https://basescan.org/address/0x1C43e4D9734AaB5873ee6BC36646c075eb93040B"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-display font-bold text-molt-orange hover:underline"
            >
              0x1C43...040B
            </a>
          </div>
        </div>

        {/* Right Side: Balance + Wallet */}
        <div className="flex items-center space-x-3">
          {/* Balance (only show when connected) */}
          {isConnected && (
            <div className="glass px-4 py-2 rounded-lg border-2 border-casino-gold/50">
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {tokenSymbol}
              </div>
              <div className="text-lg font-display font-bold text-casino-gold">
                {formattedBalance}
              </div>
            </div>
          )}

          {/* Profile */}
          <Link href="/profile">
            <button className="btn-secondary flex items-center space-x-2 !px-3 !py-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </Link>

          {/* Connect Wallet */}
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
